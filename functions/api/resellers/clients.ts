import { getDb } from '../../../db';
import { users } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyToken } from '../../utils/auth';

interface Env {
    DB: D1Database;
}

interface TokenPayload {
    id: number;
    email: string;
    role: string;
    type: string;
    is_super_admin?: boolean;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

        const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
        if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

        const db = getDb(context.env.DB);

        // Construct owner ID (e.g. "reseller:123")
        const ownerId = `${token.type}:${token.id}`;

        const list = await db.select()
            .from(users)
            .where(eq(users.owner_uid, ownerId))
            .orderBy(desc(users.created_at))
            .all();

        return new Response(JSON.stringify(list), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || 'Erro ao buscar clientes' }), { status: 500 });
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

        const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
        if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

        const db = getDb(context.env.DB);
        const body = await context.request.json() as any;

        const ownerId = `${token.type}:${token.id}`;

        // Check for duplicate email
        const existing = await db.select().from(users).where(eq(users.email, body.email)).get();
        if (existing) {
            return new Response(JSON.stringify({ error: 'Este email já está cadastrado.' }), { status: 400 });
        }

        const result = await db.insert(users).values({
            name: body.nome,
            email: body.email,
            plan: body.plano,
            server: body.servidor,
            status: body.status || 'Ativo',
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
            owner_uid: ownerId
        }).returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message || 'Erro ao criar cliente' }), { status: 500 });
    }
}
