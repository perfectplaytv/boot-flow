
import { getDb } from '../../../db';
import { users, resellers } from '../../../db/schema';
import { eq, isNull } from 'drizzle-orm';
import { verifyToken } from '../../utils/auth';

interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    const token = await verifyToken(authHeader.split(' ')[1]);
    // @ts-ignore
    if (!token || !token.is_super_admin) {
        return new Response(JSON.stringify({ error: 'Acesso negado. Apenas Super Admin.' }), { status: 403 });
    }

    const db = getDb(context.env.DB);
    try {
        // @ts-ignore
        const myOwnerId = `${token.type}:${token.id}`;

        // Atualizar todos os revendedores sem dono para serem meus
        const result = await db.update(resellers)
            .set({ owner_uid: myOwnerId })
            .where(isNull(resellers.owner_uid))
            .returning();

        return new Response(JSON.stringify({
            success: true,
            message: `Migração concluída. ${result.length} revendedores foram vinculados à sua conta.`,
            updated_count: result.length
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: unknown) {
        return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erro na migração' }), { status: 500 });
    }
}
