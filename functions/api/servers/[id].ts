
import { getDb } from '../../../db';
import { servers } from '../../../db/schema';
import { verifyToken } from '../../utils/auth';
import { eq } from 'drizzle-orm';

interface Env {
    DB: D1Database;
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const id = parseInt(context.params.id as string);
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]);
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    try {
        await db.delete(servers).where(eq(servers.id, id)).run();
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
    const id = parseInt(context.params.id as string);
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]);
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    try {
        const body = await context.request.json() as Record<string, unknown>;

        // Remove campos que não devem ser editados via patch simples se necessário
        const updateData = { ...body };
        delete updateData.id;
        delete updateData.created_at;

        // Atualiza timestamp
        updateData.updated_at = new Date().toISOString();

        const result = await db.update(servers)
            .set(updateData)
            .where(eq(servers.id, id))
            .returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
