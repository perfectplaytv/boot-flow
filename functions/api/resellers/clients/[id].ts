import { getDb } from '../../../../db';
import { users } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../../../utils/auth';

interface Env {
    DB: D1Database;
}

interface TokenPayload {
    id: number;
    email: string;
    role: string;
    type: string;
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

        const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
        if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

        const clientId = Number(context.params.id);
        if (!clientId) return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });

        const db = getDb(context.env.DB);
        const ownerId = `${token.type}:${token.id}`;

        // Verify ownership and delete
        const result = await db.delete(users)
            .where(and(eq(users.id, clientId), eq(users.owner_uid, ownerId)))
            .returning();

        if (result.length === 0) {
            return new Response(JSON.stringify({ error: 'Cliente não encontrado ou sem permissão' }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || 'Erro ao deletar cliente' }), { status: 500 });
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

        const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
        if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

        const clientId = Number(context.params.id);
        if (!clientId) return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });

        const db = getDb(context.env.DB);
        const ownerId = `${token.type}:${token.id}`;
        const body = await context.request.json() as any;

        // Verify ownership
        const existing = await db.select().from(users)
            .where(and(eq(users.id, clientId), eq(users.owner_uid, ownerId)))
            .get();

        if (!existing) {
            return new Response(JSON.stringify({ error: 'Cliente não encontrado' }), { status: 404 });
        }

        // Update fields
        const result = await db.update(users)
            .set({
                name: body.nome,
                email: body.email,
                plan: body.plano,
                server: body.servidor,
                status: body.status,
                expiration_date: body.dataExpiracao,
                whatsapp: body.telefone,
                telegram: body.telegram,
                password: body.senha,
                devices: body.dispositivos,
                credits: body.creditos,
                bouquets: body.bouquets,
                real_name: body.nomeReal,
                observations: body.observacoes,
                notes: body.notas,
                m3u_url: body.m3uUrl,
                updated_at: new Date().toISOString()
            })
            .where(eq(users.id, clientId))
            .returning();

        return new Response(JSON.stringify(result[0]), { headers: { 'Content-Type': 'application/json' } });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || 'Erro ao atualizar cliente' }), { status: 500 });
    }
}
