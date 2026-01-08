
import { getDb } from '../../../db';
import { users } from '../../../db/schema';

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const allUsers = await db.select().from(users).all();
        return new Response(JSON.stringify(allUsers), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('GET /api/users error:', message);
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);

    try {
        const body = await context.request.json() as Record<string, unknown>;

        // Validate required fields
        const requiredFields = ['name', 'email', 'plan', 'expiration_date'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return new Response(JSON.stringify({
                error: `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Prepare data with defaults
        const userData = {
            name: body.name as string,
            email: body.email as string,
            plan: body.plan as string,
            status: (body.status as string) || 'Ativo',
            expiration_date: body.expiration_date as string,
            password: (body.password as string) || '',
            m3u_url: (body.m3u_url as string) || null,
            bouquets: (body.bouquets as string) || null,
            observations: (body.observations as string) || null,
            real_name: (body.real_name as string) || null,
            telegram: (body.telegram as string) || null,
            whatsapp: (body.whatsapp as string) || null,
            phone: (body.phone as string) || null,
            devices: typeof body.devices === 'number' ? body.devices : 0,
            credits: typeof body.credits === 'number' ? body.credits : 0,
            notes: (body.notes as string) || null,
            server: (body.server as string) || null,
            owner_uid: (body.owner_uid as string) || null,
            renewal_date: (body.renewal_date as string) || null,
        };

        const result = await db.insert(users).values(userData).returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' },
            status: 201
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        console.error('POST /api/users error:', message);

        // Check for unique constraint violation
        if (message.includes('UNIQUE constraint failed')) {
            return new Response(JSON.stringify({
                error: 'Este email já está cadastrado.'
            }), { status: 409, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
