
import { getDb } from '../../../db';
import { servers } from '../../../db/schema';
import { verifyToken } from '../../utils/auth';

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]);
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    try {
        const result = await db.select().from(servers).orderBy(servers.nome).all();
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]);
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    try {
        const body = await context.request.json() as {
            nome: string;
            ip: string;
            porta: string | number;
            tipo: string;
            status?: string;
        };

        // Simples validação
        if (!body.nome || !body.ip || !body.porta || !body.tipo) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), { status: 400 });
        }

        const result = await db.insert(servers).values({
            nome: body.nome,
            ip: body.ip,
            porta: Number(body.porta),
            tipo: body.tipo,
            status: body.status || 'offline',
            cpu: 0,
            memoria: 0,
            disco: 0
        }).returning();

        return new Response(JSON.stringify(result[0]), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
