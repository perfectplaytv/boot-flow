
import { getDb } from '../../../db';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

interface Env {
    DB: D1Database;
}

// DELETE: Excluir Revendedor
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    const id = Number(context.params.id);

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
    }

    try {
        await db.delete(users).where(eq(users.id, id)).execute();
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao deletar revendedor';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}

// PATCH: Atualizar Revendedor
export const onRequestPatch: PagesFunction<Env> = async (context) => {
    const db = getDb(context.env.DB);
    const id = Number(context.params.id);

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID inválido' }), { status: 400 });
    }

    try {
        const body = await context.request.json() as {
            name?: string;
            username?: string;
            email?: string;
            password?: string;
            whatsapp?: string;
            credits?: number;
            status?: string;
        };

        const updates: Record<string, unknown> = {};

        // Mapear campos
        if (body.name) updates.name = body.name;
        if (body.username) updates.name = body.username; // Fallback username->name
        if (body.email) updates.email = body.email;
        if (body.whatsapp) updates.whatsapp = body.whatsapp;
        if (body.credits !== undefined) updates.credits = body.credits;
        if (body.status) updates.status = body.status;

        // Se tiver senha, hashear
        if (body.password && body.password.trim() !== '') {
            updates.password = await bcrypt.hash(body.password, 10);
        }

        if (Object.keys(updates).length === 0) {
            return new Response(JSON.stringify({ error: 'Nenhum dado para atualizar' }), { status: 400 });
        }

        const result = await db.update(users)
            .set(updates)
            .where(eq(users.id, id))
            .returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao atualizar revendedor';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
