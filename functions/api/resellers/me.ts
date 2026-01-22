
import { getDb } from '../../../db';
import { resellers } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../../utils/auth';

interface Env {
    DB: D1Database;
}

// GET: Buscar dados do revendedor atual (me)
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        // Verificar token de autenticação
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = await verifyToken(token);

        if (!payload || !payload.id) {
            return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });
        }

        // Buscar revendedor pelo ID do token
        const reseller = await db.select({
            id: resellers.id,
            username: resellers.username,
            email: resellers.email,
            personal_name: resellers.personal_name,
            permission: resellers.permission,
            credits: resellers.credits,
            status: resellers.status,
            plan_name: resellers.plan_name,
            plan_price: resellers.plan_price,
            max_clients: resellers.max_clients,
        }).from(resellers).where(eq(resellers.id, Number(payload.id))).get();

        if (!reseller) {
            return new Response(JSON.stringify({ error: 'Revendedor não encontrado' }), { status: 404 });
        }

        return new Response(JSON.stringify({
            id: reseller.id,
            username: reseller.username,
            email: reseller.email,
            name: reseller.personal_name || reseller.username,
            plan_name: reseller.plan_name || 'Essencial',
            plan_price: reseller.plan_price || 'R$ 0',
            max_clients: reseller.max_clients || 5,
            credits: reseller.credits || 0,
            status: reseller.status || 'Ativo'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Reseller Me Error:", error);
        return new Response(JSON.stringify({ error: 'Erro ao buscar dados do revendedor' }), { status: 500 });
    }
}
