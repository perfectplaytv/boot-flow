// Heating Debug API - Check database state

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        // Get counts
        const groups = await DB.prepare(
            'SELECT COUNT(*) as count FROM heating_groups WHERE admin_id = ?'
        ).bind(adminId).first<{ count: number }>();

        const bots = await DB.prepare(
            'SELECT COUNT(*) as count FROM heating_bots WHERE admin_id = ?'
        ).bind(adminId).first<{ count: number }>();

        const campaigns = await DB.prepare(
            'SELECT * FROM heating_campaigns WHERE admin_id = ?'
        ).bind(adminId).all();

        const logs = await DB.prepare(
            'SELECT COUNT(*) as count FROM heating_logs'
        ).first<{ count: number }>();

        // Get campaign details
        const campaignDetails = await Promise.all(
            campaigns.results.map(async (c: Record<string, unknown>) => {
                const campaignBots = await DB.prepare(
                    'SELECT COUNT(*) as count FROM heating_campaign_bots WHERE campaign_id = ?'
                ).bind(c.id).first<{ count: number }>();

                const messages = await DB.prepare(
                    'SELECT COUNT(*) as count FROM heating_messages WHERE campaign_id = ?'
                ).bind(c.id).first<{ count: number }>();

                return {
                    id: c.id,
                    name: c.name,
                    status: c.status,
                    total_messages_sent: c.total_messages_sent,
                    bots_count: campaignBots?.count || 0,
                    messages_count: messages?.count || 0,
                };
            })
        );

        return Response.json({
            success: true,
            data: {
                adminId,
                groups: groups?.count || 0,
                bots: bots?.count || 0,
                campaigns: campaigns.results.length,
                logs: logs?.count || 0,
                campaignDetails,
            },
        });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        }, { status: 500 });
    }
};
