
import { getDb } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

interface Env {
    DB: D1Database;
}

// DELETE /api/users/[id]
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    const id = Number(context.params.id);

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
    }

    try {
        await db.delete(users).where(eq(users.id, id)).execute();
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

// PATCH /api/users/[id]
export const onRequestPatch: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    const id = Number(context.params.id);

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
    }

    try {
        const body = await context.request.json() as Partial<typeof users.$inferInsert>;

        const result = await db.update(users)
            .set(body)
            .where(eq(users.id, id))
            .returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
