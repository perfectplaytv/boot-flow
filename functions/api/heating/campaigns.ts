// Heating Campaigns API - CRUD operations for campaigns

interface Env {
    DB: D1Database;
}

interface CampaignRecord {
    id: number;
    admin_id: string;
    name: string;
    group_id: number;
    group_name: string | null;
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
    created_at: string;
    updated_at: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        // Get campaigns with group name
        const campaigns = await DB.prepare(`
            SELECT c.*, g.name as group_name 
            FROM heating_campaigns c 
            LEFT JOIN heating_groups g ON c.group_id = g.id 
            WHERE c.admin_id = ? 
            ORDER BY c.created_at DESC
        `).bind(adminId).all<CampaignRecord>();

        // For each campaign, get bots and messages
        const enrichedCampaigns = await Promise.all(
            campaigns.results.map(async (campaign) => {
                const bots = await DB.prepare(`
                    SELECT cb.*, b.name as bot_name, b.username as bot_username 
                    FROM heating_campaign_bots cb 
                    LEFT JOIN heating_bots b ON cb.bot_id = b.id 
                    WHERE cb.campaign_id = ?
                `).bind(campaign.id).all();

                const messages = await DB.prepare(`
                    SELECT * FROM heating_messages WHERE campaign_id = ? ORDER BY order_index
                `).bind(campaign.id).all();

                return {
                    ...campaign,
                    bots: bots.results,
                    messages: messages.results,
                };
            })
        );

        return Response.json({
            success: true,
            data: enrichedCampaigns,
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        admin_id: string;
        name: string;
        group_id: number;
        bot_ids: number[];
        messages: string[];
        send_mode: string;
        interval_min: number;
        interval_max: number;
        window_start: string;
        window_end: string;
        max_messages_per_bot_per_day: number;
    };

    try {
        const now = new Date().toISOString();

        // Create campaign
        const result = await DB.prepare(`
            INSERT INTO heating_campaigns (
                admin_id, name, group_id, status, send_mode, 
                interval_min, interval_max, window_start, window_end, 
                max_messages_per_bot_per_day, message_index, 
                total_messages_sent, total_errors, created_at, updated_at
            )
            VALUES (?, ?, ?, 'paused', ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)
        `).bind(
            body.admin_id || 'default',
            body.name,
            body.group_id,
            body.send_mode,
            body.interval_min,
            body.interval_max,
            body.window_start,
            body.window_end,
            body.max_messages_per_bot_per_day,
            now,
            now
        ).run();

        const campaignId = result.meta.last_row_id;

        // Add bots to campaign
        for (const botId of body.bot_ids) {
            await DB.prepare(`
                INSERT INTO heating_campaign_bots (campaign_id, bot_id, messages_sent_today)
                VALUES (?, ?, 0)
            `).bind(campaignId, botId).run();
        }

        // Add messages
        let orderIndex = 0;
        for (const content of body.messages) {
            await DB.prepare(`
                INSERT INTO heating_messages (campaign_id, content, order_index, times_sent, created_at)
                VALUES (?, ?, ?, 0, ?)
            `).bind(campaignId, content, orderIndex, now).run();
            orderIndex++;
        }

        return Response.json({
            success: true,
            data: { id: campaignId },
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        id: number;
        name?: string;
        status?: string;
        send_mode?: string;
        interval_min?: number;
        interval_max?: number;
        window_start?: string;
        window_end?: string;
        max_messages_per_bot_per_day?: number;
        message_index?: number;
        total_messages_sent?: number;
        total_errors?: number;
        last_sent_at?: string;
    };

    try {
        const updates: string[] = [];
        const values: (string | number | null)[] = [];

        if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
        if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
        if (body.send_mode !== undefined) { updates.push('send_mode = ?'); values.push(body.send_mode); }
        if (body.interval_min !== undefined) { updates.push('interval_min = ?'); values.push(body.interval_min); }
        if (body.interval_max !== undefined) { updates.push('interval_max = ?'); values.push(body.interval_max); }
        if (body.window_start !== undefined) { updates.push('window_start = ?'); values.push(body.window_start); }
        if (body.window_end !== undefined) { updates.push('window_end = ?'); values.push(body.window_end); }
        if (body.max_messages_per_bot_per_day !== undefined) { updates.push('max_messages_per_bot_per_day = ?'); values.push(body.max_messages_per_bot_per_day); }
        if (body.message_index !== undefined) { updates.push('message_index = ?'); values.push(body.message_index); }
        if (body.total_messages_sent !== undefined) { updates.push('total_messages_sent = ?'); values.push(body.total_messages_sent); }
        if (body.total_errors !== undefined) { updates.push('total_errors = ?'); values.push(body.total_errors); }
        if (body.last_sent_at !== undefined) { updates.push('last_sent_at = ?'); values.push(body.last_sent_at); }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(body.id);

        await DB.prepare(`UPDATE heating_campaigns SET ${updates.join(', ')} WHERE id = ?`)
            .bind(...values)
            .run();

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return Response.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    try {
        const campaignId = parseInt(id);

        // Delete related data first
        await DB.prepare('DELETE FROM heating_campaign_bots WHERE campaign_id = ?').bind(campaignId).run();
        await DB.prepare('DELETE FROM heating_messages WHERE campaign_id = ?').bind(campaignId).run();
        await DB.prepare('DELETE FROM heating_logs WHERE campaign_id = ?').bind(campaignId).run();

        // Delete campaign
        await DB.prepare('DELETE FROM heating_campaigns WHERE id = ?').bind(campaignId).run();

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
