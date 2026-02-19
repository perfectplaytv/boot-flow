
import { getDb } from '../../../db';
import { applications } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../utils/auth';

interface TokenPayload {
    id: number;
    email: string;
    role: string;
    type: string;
}

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    const ownerId = `${token.type}:${token.id}`;

    try {
        const result = await db.select().from(applications).where(eq(applications.owner_uid, ownerId)).orderBy(applications.nome).all();
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

    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    const ownerId = `${token.type}:${token.id}`;

    try {
        const body = await context.request.json() as {
            nome: string;
            versao: string;
            servidor: string;
            tipo: string;
            status?: string;
        };

        // Simples validação
        if (!body.nome || !body.versao || !body.servidor || !body.tipo) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), { status: 400 });
        }

        const result = await db.insert(applications).values({
            nome: body.nome,
            versao: body.versao,
            servidor: body.servidor,
            tipo: body.tipo,
            status: body.status || 'inativo',
            usuarios: 0,
            owner_uid: ownerId
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
