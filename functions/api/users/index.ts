
import { getDb } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const allUsers = await db.select().from(users).all();
        return new Response(JSON.stringify(allUsers), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    const body = await context.request.json() as typeof users.$inferInsert;

    try {
        const result = await db.insert(users).values(body).returning();
        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
