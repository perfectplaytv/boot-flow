
import { getDb } from '../../../db';
import { users, resellers } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { createToken } from '../../utils/auth';
import * as bcrypt from 'bcryptjs';

interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const { email, password } = await context.request.json() as { email?: string; password?: string };

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email e senha obrigatórios' }), { status: 400 });
        }

        // Buscar usuário na tabela users
        let user = await db.select().from(users).where(eq(users.email, email)).get();
        let isReseller = false;

        // Se não achar, busca na tabela resellers
        if (!user) {
            const reseller = await db.select().from(resellers).where(eq(resellers.email, email)).get();
            if (reseller) {
                // Adaptar objeto reseller para ter interface compatível (password, id, email, name)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                user = { ...reseller, name: reseller.username, plan: 'revenda' } as any;
                isReseller = true;
            }
        }

        if (!user || !user.password) {
            return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), { status: 401 });
        }

        // Verificar Senha
        let isValid = false;
        if (user.password && user.password.startsWith('$2')) {
            try {
                isValid = await bcrypt.compare(password, user.password);
            } catch (e) {
                console.error("Erro ao comparar hash bcrypt:", e);
                isValid = false;
            }
        } else {
            // Fallback para senhas em texto plano (migração/dev)
            console.log("Aviso: Verificando senha em texto plano para usuário", user.email);
            isValid = password === user.password;
        }

        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), { status: 401 });
        }

        // Determinar Role e Tipo
        let role = 'client';
        let type = 'user'; // 'user' (admin/client) ou 'reseller'

        if (isReseller) {
            // Revendedores NUNCA são admin a menos que explicitamente configurado
            type = 'reseller';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const permission = (user as any).permission;
            // Apenas 'admin' explícito no campo permission permite acesso admin
            // Default é SEMPRE 'reseller' para segurança
            role = permission === 'admin' ? 'admin' : 'reseller';
        } else {
            type = 'user';
            // Super admin é apenas o email específico
            if (user.email === 'pontonois@gmail.com') {
                role = 'admin';
            } else if (user.plan === 'admin') {
                role = 'admin';
            } else if (user.plan === 'revenda') {
                role = 'reseller';
            }
        }

        const isSuperAdmin = user.email === 'pontonois@gmail.com';

        // Gerar Token com a role correta e flags de identidade
        const token = await createToken({
            id: user.id,
            email: user.email,
            role: role,
            type: type,
            is_super_admin: isSuperAdmin
        });

        return new Response(JSON.stringify({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: role,
                is_super_admin: isSuperAdmin
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
