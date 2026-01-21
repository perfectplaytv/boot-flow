// Scheduled handler for cron trigger
// This file handles the cron trigger and calls the heating process endpoint

interface Env {
    DB: D1Database;
}

// The scheduled handler for Cloudflare Workers
export default {
    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        console.log('[Cron] Heating scheduler triggered at:', new Date().toISOString());

        try {
            // Process running campaigns
            const campaigns = await env.DB.prepare(
                "SELECT * FROM heating_campaigns WHERE status = 'running'"
            ).all();

            console.log(`[Cron] Found ${campaigns.results.length} running campaigns`);

            for (const campaign of campaigns.results as any[]) {
                await processCampaign(env.DB, campaign);
            }
        } catch (error) {
            console.error('[Cron] Error in scheduled handler:', error);
        }
    },
};

async function processCampaign(DB: D1Database, campaign: any) {
    try {
        // Check time window
        if (!isWithinTimeWindow(campaign.window_start, campaign.window_end)) {
            console.log(`[Cron] Campaign ${campaign.name}: Outside time window`);
            return;
        }

        // Check interval
        if (campaign.last_sent_at) {
            const lastSend = new Date(campaign.last_sent_at).getTime();
            const now = Date.now();
            const minInterval = campaign.interval_min * 1000;

            if (now - lastSend < minInterval) {
                console.log(`[Cron] Campaign ${campaign.name}: Waiting for interval`);
                return;
            }
        }

        // Get group
        const group = await DB.prepare(
            'SELECT * FROM heating_groups WHERE id = ?'
        ).bind(campaign.group_id).first();

        if (!group) {
            console.log(`[Cron] Campaign ${campaign.name}: Group not found`);
            return;
        }

        // Get available bots
        const bots = await DB.prepare(`
            SELECT cb.*, b.name, b.token, b.username 
            FROM heating_campaign_bots cb 
            JOIN heating_bots b ON cb.bot_id = b.id 
            WHERE cb.campaign_id = ? AND b.status = 'active'
            AND cb.messages_sent_today < ?
        `).bind(campaign.id, campaign.max_messages_per_bot_per_day).all();

        if (bots.results.length === 0) {
            console.log(`[Cron] Campaign ${campaign.name}: No available bots`);
            return;
        }

        // Get messages
        const messages = await DB.prepare(
            'SELECT * FROM heating_messages WHERE campaign_id = ? ORDER BY order_index'
        ).bind(campaign.id).all();

        if (messages.results.length === 0) {
            console.log(`[Cron] Campaign ${campaign.name}: No messages`);
            return;
        }

        // Select bot and message
        const selectedBot = bots.results[Math.floor(Math.random() * bots.results.length)] as any;

        let selectedMessage: any;
        if (campaign.send_mode === 'sequential') {
            const index = campaign.message_index % messages.results.length;
            selectedMessage = messages.results[index];
        } else {
            selectedMessage = messages.results[Math.floor(Math.random() * messages.results.length)];
        }

        // Send message
        const response = await fetch(`https://api.telegram.org/bot${selectedBot.token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: (group as any).chat_id,
                text: (selectedMessage as any).content,
                disable_web_page_preview: true,
            }),
        });

        const result = await response.json() as { ok: boolean; result?: { message_id: number }; description?: string };
        const now = new Date().toISOString();

        // Log
        await DB.prepare(`
            INSERT INTO heating_logs (campaign_id, bot_id, bot_name, message_id, message_preview, status, error_message, telegram_message_id, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            campaign.id,
            selectedBot.bot_id,
            selectedBot.name,
            selectedMessage.id,
            selectedMessage.content.slice(0, 50),
            result.ok ? 'success' : 'error',
            result.ok ? null : result.description,
            result.result?.message_id?.toString() || null,
            now
        ).run();

        // Update stats
        await DB.prepare(`
            UPDATE heating_campaigns 
            SET total_messages_sent = total_messages_sent + ?,
                total_errors = total_errors + ?,
                message_index = message_index + 1,
                last_sent_at = ?,
                updated_at = ?
            WHERE id = ?
        `).bind(
            result.ok ? 1 : 0,
            result.ok ? 0 : 1,
            now,
            now,
            campaign.id
        ).run();

        await DB.prepare(`
            UPDATE heating_campaign_bots 
            SET messages_sent_today = messages_sent_today + 1, last_sent_at = ?
            WHERE campaign_id = ? AND bot_id = ?
        `).bind(now, campaign.id, selectedBot.bot_id).run();

        await DB.prepare(`
            UPDATE heating_bots SET messages_sent_today = messages_sent_today + 1, updated_at = ?
            WHERE id = ?
        `).bind(now, selectedBot.bot_id).run();

        console.log(`[Cron] Campaign ${campaign.name}: ${result.ok ? 'Sent' : 'Failed'} - ${selectedBot.name}`);

    } catch (error) {
        console.error(`[Cron] Error processing campaign ${campaign.name}:`, error);
    }
}

function isWithinTimeWindow(windowStart: string, windowEnd: string): boolean {
    const now = new Date();
    // Brazil timezone (UTC-3)
    const hours = (now.getUTCHours() - 3 + 24) % 24;
    const minutes = now.getUTCMinutes();
    const currentMinutes = hours * 60 + minutes;

    const [startH, startM] = windowStart.split(':').map(Number);
    const [endH, endM] = windowEnd.split(':').map(Number);

    return currentMinutes >= (startH * 60 + startM) && currentMinutes <= (endH * 60 + endM);
}
