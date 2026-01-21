// Heating Groups API - CRUD operations for groups

interface Env {
    DB: D1Database;
}

interface HeatingGroup {
    id: number;
    admin_id: string;
    name: string;
    chat_id: string;
    description?: string;
    tags?: string;
    is_active: number;
    test_status: string;
    last_test_at?: string;
    created_at: string;
    updated_at: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        const result = await DB.prepare(
            'SELECT * FROM heating_groups WHERE admin_id = ? ORDER BY created_at DESC'
        ).bind(adminId).all<HeatingGroup>();

        return Response.json({
            success: true,
            data: result.results.map(g => ({
                ...g,
                tags: g.tags ? JSON.parse(g.tags) : [],
                is_active: Boolean(g.is_active),
            })),
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
        chat_id: string;
        description?: string;
        tags?: string[];
    };

    try {
        const now = new Date().toISOString();
        const result = await DB.prepare(`
            INSERT INTO heating_groups (admin_id, name, chat_id, description, tags, is_active, test_status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, 'pending', ?, ?)
        `).bind(
            body.admin_id || 'default',
            body.name,
            body.chat_id,
            body.description || null,
            body.tags ? JSON.stringify(body.tags) : null,
            now,
            now
        ).run();

        return Response.json({
            success: true,
            data: { id: result.meta.last_row_id },
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
        chat_id?: string;
        description?: string;
        tags?: string[];
        is_active?: boolean;
        test_status?: string;
        last_test_at?: string;
    };

    try {
        const updates: string[] = [];
        const values: (string | number | null)[] = [];

        if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
        if (body.chat_id !== undefined) { updates.push('chat_id = ?'); values.push(body.chat_id); }
        if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description); }
        if (body.tags !== undefined) { updates.push('tags = ?'); values.push(JSON.stringify(body.tags)); }
        if (body.is_active !== undefined) { updates.push('is_active = ?'); values.push(body.is_active ? 1 : 0); }
        if (body.test_status !== undefined) { updates.push('test_status = ?'); values.push(body.test_status); }
        if (body.last_test_at !== undefined) { updates.push('last_test_at = ?'); values.push(body.last_test_at); }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(body.id);

        await DB.prepare(`UPDATE heating_groups SET ${updates.join(', ')} WHERE id = ?`)
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
        await DB.prepare('DELETE FROM heating_groups WHERE id = ?').bind(parseInt(id)).run();
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
