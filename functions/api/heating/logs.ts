// Heating Logs API - View and manage logs

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';
    const campaignId = url.searchParams.get('campaign_id');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    try {
        let query = `
            SELECT l.*, c.name as campaign_name 
            FROM heating_logs l 
            LEFT JOIN heating_campaigns c ON l.campaign_id = c.id 
            WHERE c.admin_id = ?
        `;
        const bindings: (string | number)[] = [adminId];

        if (campaignId) {
            query += ' AND l.campaign_id = ?';
            bindings.push(parseInt(campaignId));
        }

        query += ' ORDER BY l.sent_at DESC LIMIT ?';
        bindings.push(limit);

        const result = await DB.prepare(query).bind(...bindings).all();

        return Response.json({
            success: true,
            data: result.results,
        });
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
    const campaignId = url.searchParams.get('campaign_id');

    try {
        if (campaignId) {
            await DB.prepare('DELETE FROM heating_logs WHERE campaign_id = ?')
                .bind(parseInt(campaignId))
                .run();
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
