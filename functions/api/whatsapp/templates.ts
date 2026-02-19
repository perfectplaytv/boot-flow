
interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    try {
        const templates = await DB.prepare(`
        SELECT * FROM whatsapp_templates ORDER BY created_at DESC
    `).all();

        return Response.json({ success: true, data: templates.results });
    } catch (error) {
        console.error('Error fetching templates:', error);
        return Response.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const body = await context.request.json() as {
        title: string;
        tag: string;
        content: string;
        status: string;
    };

    try {
        const now = new Date().toISOString();
        const result = await DB.prepare(`
        INSERT INTO whatsapp_templates (title, tag, content, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(body.title, body.tag, body.content, body.status, now, now).run();

        return Response.json({
            success: true,
            data: { id: result.meta.last_row_id, ...body, created_at: now, updated_at: now }
        });
    } catch (error) {
        console.error('Error creating template:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
};
