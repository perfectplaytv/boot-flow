
import { getDb } from '../../../db';
import { applications } from '../../../db/schema';
import { verifyToken } from '../../utils/auth';
import { eq, and } from 'drizzle-orm';

interface TokenPayload {
    id: number;
    email: string;
    role: string;
    type: string;
}

interface Env {
    DB: D1Database;
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const id = parseInt(context.params.id as string);
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const ownerId = `${token.type}:${token.id}`;

    const db = getDb(context.env.DB);
    try {
        await db.delete(applications).where(and(eq(applications.id, id), eq(applications.owner_uid, ownerId))).run();
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

    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const ownerId = `${token.type}:${token.id}`;

    const db = getDb(context.env.DB);
    try {
        const body = await context.request.json() as Record<string, unknown>;

        // Remove campos que não devem ser editados
        const updateData = { ...body };
        delete updateData.id;
        delete updateData.created_at;

        // Atualiza timestamp
        updateData.updated_at = new Date().toISOString();

        const result = await db.update(applications)
            .set(updateData)
            .where(and(eq(applications.id, id), eq(applications.owner_uid, ownerId)))
            .returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
