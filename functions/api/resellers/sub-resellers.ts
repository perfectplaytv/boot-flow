
import { getDb } from '../../../db';
import { resellers } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../utils/auth';

interface Env {
    DB: D1Database;
}

interface CreateSubResellerRequest {
    username?: string;
    password?: string;
    credits?: number;
    observations?: string;
    personal_name?: string;
    email?: string;
    whatsapp?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = await verifyToken(token);

        if (!payload || !payload.id) {
            return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
        }

        // Buscar revendedor mestre (quem está criando)
        const masterReseller = await db.select().from(resellers).where(eq(resellers.id, Number(payload.id))).get();

        if (!masterReseller) {
            return new Response(JSON.stringify({ error: 'Revendedor não encontrado' }), { status: 404 });
        }

        // Validar se o plano permite criar sub-revendas (Exemplo de lógica por plano)
        // "Rotas diferentes" simuladas via lógica interna para manter a API limpa, 
        // mas funcionalmente distintas.
        const plan = masterReseller.plan_name || 'Essencial';

        // Regras por plano
        const planRules: Record<string, { maxSubResellers: number; allowed: boolean }> = {
            'Essencial': { maxSubResellers: 0, allowed: false },
            'Profissional': { maxSubResellers: 5, allowed: true },
            'Business': { maxSubResellers: 20, allowed: true },
            'Elite': { maxSubResellers: 9999, allowed: true },
            'default': { maxSubResellers: 0, allowed: false }
        };

        const rules = planRules[plan] || planRules['default'];

        if (!rules.allowed) {
            return new Response(JSON.stringify({ error: `O plano ${plan} não permite criar sub-revendas.` }), { status: 403 });
        }

        // Ler dados do corpo
        const body = await context.request.json() as CreateSubResellerRequest;

        // Validação básica
        if (!body.username || !body.password) {
            return new Response(JSON.stringify({ error: 'Usuário e senha são obrigatórios' }), { status: 400 });
        }

        // Verificar duplicação (simplificado)
        const existingUser = await db.select().from(resellers).where(eq(resellers.username, body.username)).get();
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Este nome de usuário já está em uso.' }), { status: 400 });
        }

        // Criação do Sub-Revendedor
        // Forçar hierarquia
        const newSubReseller = {
            username: body.username,
            password: body.password,
            permission: 'subreseller', // Força subreseller
            master_reseller: masterReseller.username, // Vincula ao mestre
            credits: body.credits || 0,
            notes: body.observations,

            // Herdar ou definir padrões
            status: 'Ativo',
            created_at: new Date().toISOString(),

            // Campos opcionais
            personal_name: body.personal_name,
            email: body.email,
            whatsapp: body.whatsapp,

            // Definir um plano básico para o sub ou deixar null
            plan_name: 'Sub-Revenda',
            max_clients: 10, // Exemplo
        };

        // Inserir
        const result = await db.insert(resellers).values(newSubReseller).returning().get();

        return new Response(JSON.stringify({ success: true, reseller: result }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Create Sub-Reseller Error:", error);
        return new Response(JSON.stringify({ error: 'Erro interno ao criar revenda: ' + (error as Error).message }), { status: 500 });
    }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = await verifyToken(token);

        if (!payload || !payload.id) {
            return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
        }

        // Buscar o revendedor atual para pegar o username
        const currentReseller = await db.select().from(resellers).where(eq(resellers.id, Number(payload.id))).get();

        if (!currentReseller) {
            return new Response(JSON.stringify({ error: 'Revendedor não encontrado' }), { status: 404 });
        }

        // Buscar revendas onde master_reseller == currentReseller.username
        const mySubResellers = await db.select().from(resellers).where(eq(resellers.master_reseller, currentReseller.username)).all();

        return new Response(JSON.stringify(mySubResellers), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("List Sub-Resellers Error:", error);
        return new Response(JSON.stringify({ error: 'Erro ao buscar sub-revendas' }), { status: 500 });
    }
}
