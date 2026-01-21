// Heating Scheduler - Process running campaigns and send messages
// This endpoint is called by a cron trigger every minute

interface Env {
    DB: D1Database;
}

interface Campaign {
    id: number;
    admin_id: string;
    name: string;
    group_id: number;
    status: string;
    send_mode: string;
    interval_min: number;
    interval_max: number;
    window_start: string;
    window_end: string;
    max_messages_per_bot_per_day: number;
    message_index: number;
    total_messages_sent: number;
    total_errors: number;
    last_sent_at: string | null;
}

interface Group {
    id: number;
    chat_id: string;
    name: string;
}

interface Bot {
    id: number;
    name: string;
    token: string;
    username: string;
    messages_sent_today: number;
}

interface CampaignBot {
    id: number;
    campaign_id: number;
    bot_id: number;
    messages_sent_today: number;
    last_sent_at: string | null;
}

interface Message {
    id: number;
    campaign_id: number;
    content: string;
    order_index: number;
}

interface TelegramResponse {
    ok: boolean;
    result?: {
        message_id: number;
    };
    description?: string;
}

function isWithinTimeWindow(windowStart: string, windowEnd: string): boolean {
    const now = new Date();
    // Adjust for Brazilian timezone (UTC-3)
    const brazilOffset = -3 * 60;
    const localOffset = now.getTimezoneOffset();
    const diff = brazilOffset - localOffset;
    now.setMinutes(now.getMinutes() + diff);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = windowStart.split(':').map(Number);
    const [endH, endM] = windowEnd.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

function getRandomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendTelegramMessage(token: string, chatId: string, text: string): Promise<TelegramResponse> {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            disable_web_page_preview: true,
        }),
    });
    return response.json() as Promise<TelegramResponse>;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const results: { campaign: string; status: string; message?: string }[] = [];

    try {
        // Get all running campaigns
        const campaigns = await DB.prepare(
            "SELECT * FROM heating_campaigns WHERE status = 'running'"
        ).all<Campaign>();

        console.log(`[Heating Scheduler] Found ${campaigns.results.length} running campaigns`);

        for (const campaign of campaigns.results) {
            try {
                // Check time window
                if (!isWithinTimeWindow(campaign.window_start, campaign.window_end)) {
                    results.push({
                        campaign: campaign.name,
                        status: 'skipped',
                        message: 'Outside time window'
                    });
                    continue;
                }

                // Check last send time (respect interval)
                if (campaign.last_sent_at) {
                    const lastSendTime = new Date(campaign.last_sent_at).getTime();
                    const now = Date.now();
                    const randomInterval = getRandomInterval(
                        campaign.interval_min * 1000,
                        campaign.interval_max * 1000
                    );

                    if (now - lastSendTime < randomInterval) {
                        results.push({
                            campaign: campaign.name,
                            status: 'skipped',
                            message: 'Waiting for interval'
                        });
                        continue;
                    }
                }

                // Get group
                const groupResult = await DB.prepare(
                    'SELECT * FROM heating_groups WHERE id = ?'
                ).bind(campaign.group_id).first<Group>();

                if (!groupResult) {
                    results.push({
                        campaign: campaign.name,
                        status: 'error',
                        message: 'Group not found'
                    });
                    continue;
                }

                // Get campaign bots
                const campaignBots = await DB.prepare(
                    'SELECT cb.*, b.name, b.token, b.username, b.messages_sent_today as bot_total_today FROM heating_campaign_bots cb JOIN heating_bots b ON cb.bot_id = b.id WHERE cb.campaign_id = ? AND b.status = ?'
                ).bind(campaign.id, 'active').all<CampaignBot & Bot>();

                if (campaignBots.results.length === 0) {
                    results.push({
                        campaign: campaign.name,
                        status: 'error',
                        message: 'No active bots'
                    });
                    continue;
                }

                // Filter bots that haven't exceeded daily limit
                const availableBots = campaignBots.results.filter(
                    cb => cb.messages_sent_today < campaign.max_messages_per_bot_per_day
                );

                if (availableBots.length === 0) {
                    results.push({
                        campaign: campaign.name,
                        status: 'skipped',
                        message: 'All bots reached daily limit'
                    });
                    continue;
                }

                // Pick a random bot
                const selectedBot = availableBots[Math.floor(Math.random() * availableBots.length)];

                // Get messages
                const messages = await DB.prepare(
                    'SELECT * FROM heating_messages WHERE campaign_id = ? ORDER BY order_index'
                ).bind(campaign.id).all<Message>();

                if (messages.results.length === 0) {
                    results.push({
                        campaign: campaign.name,
                        status: 'error',
                        message: 'No messages configured'
                    });
                    continue;
                }

                // Pick message based on send mode
                let selectedMessage: Message;
                if (campaign.send_mode === 'sequential') {
                    const index = campaign.message_index % messages.results.length;
                    selectedMessage = messages.results[index];
                } else {
                    selectedMessage = messages.results[Math.floor(Math.random() * messages.results.length)];
                }

                // Send message
                const telegramResult = await sendTelegramMessage(
                    selectedBot.token,
                    groupResult.chat_id,
                    selectedMessage.content
                );

                const now = new Date().toISOString();

                // Log the result
                await DB.prepare(`
                    INSERT INTO heating_logs (campaign_id, bot_id, bot_name, message_id, message_preview, status, error_message, telegram_message_id, sent_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    campaign.id,
                    selectedBot.bot_id,
                    selectedBot.name,
                    selectedMessage.id,
                    selectedMessage.content.slice(0, 50),
                    telegramResult.ok ? 'success' : 'error',
                    telegramResult.ok ? null : telegramResult.description,
                    telegramResult.result?.message_id?.toString() || null,
                    now
                ).run();

                // Update campaign stats
                await DB.prepare(`
                    UPDATE heating_campaigns 
                    SET total_messages_sent = total_messages_sent + ?,
                        total_errors = total_errors + ?,
                        message_index = message_index + 1,
                        last_sent_at = ?,
                        updated_at = ?
                    WHERE id = ?
                `).bind(
                    telegramResult.ok ? 1 : 0,
                    telegramResult.ok ? 0 : 1,
                    now,
                    now,
                    campaign.id
                ).run();

                // Update campaign bot stats
                await DB.prepare(`
                    UPDATE heating_campaign_bots 
                    SET messages_sent_today = messages_sent_today + 1,
                        last_sent_at = ?
                    WHERE campaign_id = ? AND bot_id = ?
                `).bind(now, campaign.id, selectedBot.bot_id).run();

                // Update bot total stats
                await DB.prepare(`
                    UPDATE heating_bots 
                    SET messages_sent_today = messages_sent_today + 1,
                        updated_at = ?
                    WHERE id = ?
                `).bind(now, selectedBot.bot_id).run();

                results.push({
                    campaign: campaign.name,
                    status: telegramResult.ok ? 'sent' : 'error',
                    message: telegramResult.ok
                        ? `${selectedBot.name} -> ${groupResult.name}`
                        : telegramResult.description,
                });

            } catch (error) {
                results.push({
                    campaign: campaign.name,
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return Response.json({
            success: true,
            processed: results.length,
            results,
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

// GET endpoint to check status
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;

    try {
        const running = await DB.prepare(
            "SELECT COUNT(*) as count FROM heating_campaigns WHERE status = 'running'"
        ).first<{ count: number }>();

        const todaysSent = await DB.prepare(`
            SELECT COUNT(*) as count FROM heating_logs 
            WHERE DATE(sent_at) = DATE('now') AND status = 'success'
        `).first<{ count: number }>();

        return Response.json({
            success: true,
            data: {
                runningCampaigns: running?.count || 0,
                messagesSentToday: todaysSent?.count || 0,
                lastCheck: new Date().toISOString(),
            },
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
