
import { getDb } from '../../../db';
import { users } from '../../../db/schema';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

interface Env {
    DB: D1Database;
}

// GET: Listar Revendedores
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    try {
        // Busca usuários que são revenda ou reseller
        // Ajuste conforme padronizamos roles: plan='revenda' ou role='reseller' se tivermos coluna role
        // Como o schema atual usa 'plan', vamos filtrar por ele.
        const list = await db.select().from(users).where(or(
            eq(users.plan, 'revenda'),
            eq(users.plan, 'reseller')
        )).all();

        return new Response(JSON.stringify(list), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}

// POST: Criar Novo Revendedor
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    try {
        const body = await context.request.json() as { name?: string; email?: string; password?: string; whatsapp?: string };
        const { name, email, password, whatsapp } = body;

        if (!email || !password || !name) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios faltando' }), { status: 400 });
        }

        // Verifica se já existe
        const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existing.length > 0) {
            return new Response(JSON.stringify({ error: 'Email já cadastrado' }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere na tabela USERS com o plano 'revenda'
        const result = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            whatsapp: whatsapp || null,
            plan: 'revenda', // Isso define que é um revendedor
            server: 'default', // Valor padrão obrigatório se esquema pedir
            expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano de validade padrão
            credits: 0,
            status: 'Ativo'
        }).returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao criar reseller';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
