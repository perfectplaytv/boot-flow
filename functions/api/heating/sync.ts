// Heating Sync - Migrate data from localStorage to D1 database

interface Env {
    DB: D1Database;
}

interface LocalGroup {
    id: number;
    admin_id: string;
    name: string;
    chat_id: string;
    description?: string;
    tags?: string[];
    is_active: boolean;
    test_status: string;
    last_test_at?: string;
    created_at: string;
    updated_at: string;
}

interface LocalBot {
    id: number;
    admin_id: string;
    name: string;
    token: string;
    username?: string;
    status: string;
    max_messages_per_hour: number;
    max_messages_per_day: number;
    messages_sent_today: number;
    messages_sent_this_hour: number;
    last_validated_at?: string;
    validation_error?: string;
    created_at: string;
    updated_at: string;
}

interface LocalCampaign {
    id: number;
    admin_id: string;
    name: string;
    group_id: number;
    group_name?: string;
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
    last_sent_at?: string;
    created_at: string;
    updated_at: string;
    bots?: { bot_id: number; messages_sent_today: number }[];
    messages?: { id: number; content: string; order_index: number }[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        groups: LocalGroup[];
        bots: LocalBot[];
        campaigns: LocalCampaign[];
        adminId?: string;
    };

    const adminId = body.adminId || 'default';
    const results = {
        groups: { imported: 0, errors: 0 },
        bots: { imported: 0, errors: 0, idMapping: {} as Record<number, number> },
        campaigns: { imported: 0, errors: 0 },
    };

    try {
        // 1. Import Groups
        const groupIdMapping: Record<number, number> = {};
        for (const group of body.groups) {
            try {
                const result = await DB.prepare(`
                    INSERT INTO heating_groups (admin_id, name, chat_id, description, tags, is_active, test_status, last_test_at, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    adminId,
                    group.name,
                    group.chat_id,
                    group.description || null,
                    group.tags ? JSON.stringify(group.tags) : null,
                    group.is_active ? 1 : 0,
                    group.test_status,
                    group.last_test_at || null,
                    group.created_at,
                    group.updated_at
                ).run();

                groupIdMapping[group.id] = result.meta.last_row_id as number;
                results.groups.imported++;
            } catch (e) {
                console.error('Error importing group:', e);
                results.groups.errors++;
            }
        }

        // 2. Import Bots
        const botIdMapping: Record<number, number> = {};
        for (const bot of body.bots) {
            try {
                const result = await DB.prepare(`
                    INSERT INTO heating_bots (admin_id, name, token, username, status, max_messages_per_hour, max_messages_per_day, messages_sent_today, messages_sent_this_hour, last_validated_at, validation_error, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    adminId,
                    bot.name,
                    bot.token,
                    bot.username || null,
                    bot.status,
                    bot.max_messages_per_hour,
                    bot.max_messages_per_day,
                    bot.messages_sent_today || 0,
                    bot.messages_sent_this_hour || 0,
                    bot.last_validated_at || null,
                    bot.validation_error || null,
                    bot.created_at,
                    bot.updated_at
                ).run();

                botIdMapping[bot.id] = result.meta.last_row_id as number;
                results.bots.imported++;
            } catch (e) {
                console.error('Error importing bot:', e);
                results.bots.errors++;
            }
        }
        results.bots.idMapping = botIdMapping;

        // 3. Import Campaigns with bots and messages
        for (const campaign of body.campaigns) {
            try {
                const newGroupId = groupIdMapping[campaign.group_id] || campaign.group_id;

                const result = await DB.prepare(`
                    INSERT INTO heating_campaigns (
                        admin_id, name, group_id, status, send_mode, 
                        interval_min, interval_max, window_start, window_end, 
                        max_messages_per_bot_per_day, message_index, 
                        total_messages_sent, total_errors, last_sent_at, created_at, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).bind(
                    adminId,
                    campaign.name,
                    newGroupId,
                    campaign.status,
                    campaign.send_mode,
                    campaign.interval_min,
                    campaign.interval_max,
                    campaign.window_start,
                    campaign.window_end,
                    campaign.max_messages_per_bot_per_day,
                    campaign.message_index || 0,
                    campaign.total_messages_sent || 0,
                    campaign.total_errors || 0,
                    campaign.last_sent_at || null,
                    campaign.created_at,
                    campaign.updated_at
                ).run();

                const newCampaignId = result.meta.last_row_id as number;

                // Import campaign bots
                if (campaign.bots) {
                    for (const cb of campaign.bots) {
                        const newBotId = botIdMapping[cb.bot_id] || cb.bot_id;
                        await DB.prepare(`
                            INSERT INTO heating_campaign_bots (campaign_id, bot_id, messages_sent_today)
                            VALUES (?, ?, ?)
                        `).bind(newCampaignId, newBotId, cb.messages_sent_today || 0).run();
                    }
                }

                // Import messages
                if (campaign.messages) {
                    for (const msg of campaign.messages) {
                        await DB.prepare(`
                            INSERT INTO heating_messages (campaign_id, content, order_index, times_sent, created_at)
                            VALUES (?, ?, ?, 0, ?)
                        `).bind(
                            newCampaignId,
                            msg.content,
                            msg.order_index,
                            new Date().toISOString()
                        ).run();
                    }
                }

                results.campaigns.imported++;
            } catch (e) {
                console.error('Error importing campaign:', e);
                results.campaigns.errors++;
            }
        }

        return Response.json({
            success: true,
            message: 'Migration completed',
            results,
        });

    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            results,
        }, { status: 500 });
    }
};

// GET endpoint to check if data already exists
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        const groups = await DB.prepare(
            'SELECT COUNT(*) as count FROM heating_groups WHERE admin_id = ?'
        ).bind(adminId).first<{ count: number }>();

        const bots = await DB.prepare(
            'SELECT COUNT(*) as count FROM heating_bots WHERE admin_id = ?'
        ).bind(adminId).first<{ count: number }>();

        const campaigns = await DB.prepare(
            'SELECT COUNT(*) as count FROM heating_campaigns WHERE admin_id = ?'
        ).bind(adminId).first<{ count: number }>();

        return Response.json({
            success: true,
            data: {
                hasData: (groups?.count || 0) > 0 || (bots?.count || 0) > 0 || (campaigns?.count || 0) > 0,
                groups: groups?.count || 0,
                bots: bots?.count || 0,
                campaigns: campaigns?.count || 0,
            },
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
