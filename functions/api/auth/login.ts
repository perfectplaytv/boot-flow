
import { getDb } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { createToken } from '../../utils/auth';
import * as bcrypt from 'bcryptjs';

interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const { email, password } = await context.request.json() as any;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email e senha obrigatórios' }), { status: 400 });
        }

        // Buscar usuário
        const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = userList[0];

        if (!user || !user.password) {
            return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), { status: 401 });
        }

        // Verificar Senha
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Credenciais inválidas' }), { status: 401 });
        }

        // Gerar Token
        const token = await createToken({ id: user.id, email: user.email, role: 'admin' }); // Simplificado

        return new Response(JSON.stringify({ token, user: { id: user.id, email: user.email, name: user.name } }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
