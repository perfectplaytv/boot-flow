
import { getDb } from '../../../db';
import { resellers } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
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

interface ResellerBody {
    username: string;
    email?: string;
    password?: string;
    permission?: string;
    credits?: number;
    personal_name?: string;
    servers?: string;
    master_reseller?: string;
    disable_login_days?: number;
    monthly_reseller?: boolean;
    telegram?: string;
    whatsapp?: string;
    observations?: string;
}

// GET: Listar Revendedores (Com Isolamento)
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    // Cast Token
    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    const db = getDb(context.env.DB);
    try {
        // Regra 1: Super Admin vê tudo
        if (token.is_super_admin) {
            const list = await db.select().from(resellers).all();
            return new Response(JSON.stringify(list), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Regra 2: Outros admins veem apenas o que criaram
        const ownerId = `${token.type}:${token.id}`;
        const list = await db.select().from(resellers).where(eq(resellers.owner_uid, ownerId)).all();

        return new Response(JSON.stringify(list), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}

// POST: Criar Novo Revendedor (Com Vínculo de Dono)
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;
    if (!token) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

    // Permissões: Apenas Admin e Revendedor podem criar sub-revendedores
    if (token.role !== 'admin' && token.role !== 'reseller') {
        return new Response(JSON.stringify({ error: 'Sem permissão para criar revendedores' }), { status: 403 });
    }

    const db = getDb(context.env.DB);
    try {
        const body = await context.request.json() as ResellerBody;

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

        // Verifica se já existe
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

        // Definir Dono (Owner)
        const ownerId = `${token.type}:${token.id}`;

        // Insere na tabela RESELLERS
        const result = await db.insert(resellers).values({
            username,
            email: email || `${username}@system.local`,
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
            status: 'Ativo',
            owner_uid: ownerId // Vínculo criado!
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
