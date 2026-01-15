
import { verifyToken } from '../../utils/auth';

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const authHeader = context.request.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);

        if (!payload) return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 401 });

        const { id, role } = payload as { id: number, role: string };

        // Apenas revendedores (ou admins que também são revendedores) têm credenciais de painel na tabela resellers
        // Se for admin puro (tabela users), talvez não tenha. Mas aqui focamos no fluxo de revenda.

        if (role === 'client') {
            return new Response(JSON.stringify({ error: "Clientes não possuem credenciais de revenda." }), { status: 403 });
        }

        // Buscar na tabela resellers
        // Nota: O Login garante que se role for 'reseller', o ID é da tabela resellers.
        const reseller = await context.env.DB.prepare("SELECT username, password FROM resellers WHERE id = ?").bind(id).first();

        if (!reseller) {
            return new Response(JSON.stringify({ error: "Credenciais não encontradas." }), { status: 404 });
        }

        return new Response(JSON.stringify({
            username: reseller.username,
            password: reseller.password
        }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
};
