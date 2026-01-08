
import { getDb } from '../../../db';
import { resellers } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

interface Env {
    DB: D1Database;
}

// GET: Listar Revendedores
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    try {
        const list = await db.select().from(resellers).all();
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
        const body = await context.request.json() as any;

        const {
            username,
            email,
            password,
            permission,
            credits,
            personal_name,
            servers,
            master_reseller,
            disable_login_days,
            monthly_reseller,
            telegram,
            whatsapp,
            observations
        } = body;

        // Validação básica
        if (!username || !password || !permission) {
            return new Response(JSON.stringify({ error: 'Campos obrigatórios (Usuário/Senha/Permissão) faltando' }), { status: 400 });
        }

        // Verifica se já existe por username ou email
        const existingUsername = await db.select().from(resellers).where(eq(resellers.username, username)).limit(1);
        if (existingUsername.length > 0) {
            return new Response(JSON.stringify({ error: 'Usuário já cadastrado' }), { status: 400 });
        }

        if (email) {
            const existingEmail = await db.select().from(resellers).where(eq(resellers.email, email)).limit(1);
            if (existingEmail.length > 0) {
                return new Response(JSON.stringify({ error: 'Email já cadastrado' }), { status: 400 });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere na tabela RESELLERS
        const result = await db.insert(resellers).values({
            username,
            email: email || `${username}@system.local`, // Fallback se email for opcional no banco, mas unique requer valor
            password: hashedPassword,
            permission: permission || 'reseller',
            credits: credits || 0,
            personal_name: personal_name || null,
            servers: servers || null,
            master_reseller: master_reseller || null,
            disable_login_days: disable_login_days || 0,
            monthly_reseller: monthly_reseller || false,
            telegram: telegram || null,
            whatsapp: whatsapp || null,
            observations: observations || null,
            status: 'Ativo'
        }).returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (e: unknown) {
        console.error("Erro criar revenda:", e);
        const message = e instanceof Error ? e.message : 'Erro ao criar reseller';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
