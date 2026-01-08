
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
        const { email, password, name, plan } = await context.request.json() as any;

        if (!email || !password || !name) {
            return new Response(JSON.stringify({ error: 'Dados incompletos' }), { status: 400 });
        }

        // Verificar se já existe
        const exists = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (exists.length > 0) {
            return new Response(JSON.stringify({ error: 'Email já cadastrado' }), { status: 409 });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const newUser = await db.insert(users).values({
            email,
            password: hashedPassword,
            name,
            plan: plan || 'active',
            expiration_date: new Date().toISOString() // Data provisória
        }).returning();

        // Gerar Token
        const user = newUser[0];
        const token = await createToken({ id: user.id, email: user.email });

        return new Response(JSON.stringify({ token, user: { id: user.id, email: user.email, name: user.name } }), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
