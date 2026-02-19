
interface Env {
    DB: D1Database;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const id = context.params.id as string;
    const body = await context.request.json() as {
        title: string;
        tag: string;
        content: string;
        status: string;
    };

    try {
        const now = new Date().toISOString();
        await DB.prepare(`
        UPDATE whatsapp_templates 
        SET title = ?, tag = ?, content = ?, status = ?, updated_at = ?
        WHERE id = ?
    `).bind(body.title, body.tag, body.content, body.status, now, id).run();

        return Response.json({
            success: true,
            data: { id: parseInt(id), ...body, updated_at: now }
        });
    } catch (error) {
        console.error('Error updating template:', error);
        return Response.json({ success: false, error: 'Failed to update template' }, { status: 500 });
    }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const id = context.params.id as string;

    try {
        await DB.prepare(`
        DELETE FROM whatsapp_templates WHERE id = ?
    `).bind(id).run();

        return Response.json({ success: true, id: parseInt(id) });
    } catch (error) {
        console.error('Error deleting template:', error);
        return Response.json({ success: false, error: 'Failed to delete template' }, { status: 500 });
    }
};
