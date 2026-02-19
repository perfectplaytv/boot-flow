
import { getDb } from '../../../db';
import { resellers, users } from '../../../db/schema';
import { isNull } from 'drizzle-orm';
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Token não fornecido' }), { status: 401 });

    // Cast para interface customizada
    const token = await verifyToken(authHeader.split(' ')[1]) as unknown as TokenPayload;

    if (!token || !token.is_super_admin) {
        return new Response(JSON.stringify({ error: 'Acesso negado. Apenas Super Admin.' }), { status: 403 });
    }

    const db = getDb(context.env.DB);
    try {
        const myOwnerId = `${token.type}:${token.id}`;

        // 1. Vincular Revendedores Órfãos
        const resellersResult = await db.update(resellers)
            .set({ owner_uid: myOwnerId })
            .where(isNull(resellers.owner_uid))
            .returning();

        // 2. Vincular Clientes/Usuários Órfãos
        const usersResult = await db.update(users)
            .set({ owner_uid: myOwnerId })
            .where(isNull(users.owner_uid))
            .returning();

        return new Response(JSON.stringify({
            success: true,
            message: `Migração concluída!`,
            details: {
                resellers_adopted: resellersResult.length,
                users_adopted: usersResult.length
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: unknown) {
        return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erro na migração' }), { status: 500 });
    }
}
