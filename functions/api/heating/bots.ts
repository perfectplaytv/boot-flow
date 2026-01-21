// Heating Bots API - CRUD operations for bots

interface Env {
    DB: D1Database;
}

interface HeatingBot {
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;
    const url = new URL(context.request.url);
    const adminId = url.searchParams.get('admin_id') || 'default';

    try {
        const result = await DB.prepare(
            'SELECT * FROM heating_bots WHERE admin_id = ? ORDER BY created_at DESC'
        ).bind(adminId).all<HeatingBot>();

        // Don't expose full tokens in list
        const bots = result.results.map(b => ({
            ...b,
            token: b.token, // In production, you might want to mask this
        }));

        return Response.json({
            success: true,
            data: bots,
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
        token: string;
        username?: string;
        max_messages_per_hour?: number;
        max_messages_per_day?: number;
    };

    try {
        const now = new Date().toISOString();
        const result = await DB.prepare(`
            INSERT INTO heating_bots (admin_id, name, token, username, status, max_messages_per_hour, max_messages_per_day, messages_sent_today, messages_sent_this_hour, last_validated_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'active', ?, ?, 0, 0, ?, ?, ?)
        `).bind(
            body.admin_id || 'default',
            body.name,
            body.token,
            body.username || null,
            body.max_messages_per_hour || 10,
            body.max_messages_per_day || 100,
            now,
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
        token?: string;
        username?: string;
        status?: string;
        max_messages_per_hour?: number;
        max_messages_per_day?: number;
        messages_sent_today?: number;
        messages_sent_this_hour?: number;
        last_validated_at?: string;
        validation_error?: string;
    };

    try {
        const updates: string[] = [];
        const values: (string | number | null)[] = [];

        if (body.name !== undefined) { updates.push('name = ?'); values.push(body.name); }
        if (body.token !== undefined) { updates.push('token = ?'); values.push(body.token); }
        if (body.username !== undefined) { updates.push('username = ?'); values.push(body.username); }
        if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
        if (body.max_messages_per_hour !== undefined) { updates.push('max_messages_per_hour = ?'); values.push(body.max_messages_per_hour); }
        if (body.max_messages_per_day !== undefined) { updates.push('max_messages_per_day = ?'); values.push(body.max_messages_per_day); }
        if (body.messages_sent_today !== undefined) { updates.push('messages_sent_today = ?'); values.push(body.messages_sent_today); }
        if (body.messages_sent_this_hour !== undefined) { updates.push('messages_sent_this_hour = ?'); values.push(body.messages_sent_this_hour); }
        if (body.last_validated_at !== undefined) { updates.push('last_validated_at = ?'); values.push(body.last_validated_at); }
        if (body.validation_error !== undefined) { updates.push('validation_error = ?'); values.push(body.validation_error); }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(body.id);

        await DB.prepare(`UPDATE heating_bots SET ${updates.join(', ')} WHERE id = ?`)
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
        await DB.prepare('DELETE FROM heating_bots WHERE id = ?').bind(parseInt(id)).run();
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
};
