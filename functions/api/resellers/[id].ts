
// Last update: 2026-01-22 02:45 - Plan sync fix
import { getDb } from '../../../db';
import { resellers } from '../../../db/schema';
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
        await db.delete(resellers).where(eq(resellers.id, id)).execute();
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
        interface ResellerUpdateBody {
            username?: string;
            email?: string;
            password?: string;
            permission?: string;
            credits?: number;
            personal_name?: string;
            status?: string;
            force_password_change?: boolean;
            servers?: string;
            master_reseller?: string;
            disable_login_days?: number;
            monthly_reseller?: boolean;
            telegram?: string;
            whatsapp?: string;
            observations?: string;
            plan_name?: string;
            plan_price?: string;
            max_clients?: number;
        }
        const body = await context.request.json() as ResellerUpdateBody;

        const updates: Record<string, unknown> = {};

        // Mapear campos da tabela resellers
        if (body.username) updates.username = body.username;
        if (body.email) updates.email = body.email;
        if (body.permission) updates.permission = body.permission;
        if (body.credits !== undefined) updates.credits = body.credits;
        if (body.personal_name) updates.personal_name = body.personal_name;
        if (body.status) updates.status = body.status;
        if (body.force_password_change !== undefined) updates.force_password_change = body.force_password_change;
        if (body.servers !== undefined) updates.servers = body.servers;
        if (body.master_reseller !== undefined) updates.master_reseller = body.master_reseller;
        if (body.disable_login_days !== undefined) updates.disable_login_days = body.disable_login_days;
        if (body.monthly_reseller !== undefined) updates.monthly_reseller = body.monthly_reseller;
        if (body.telegram !== undefined) updates.telegram = body.telegram;
        if (body.whatsapp !== undefined) updates.whatsapp = body.whatsapp;
        if (body.observations !== undefined) updates.observations = body.observations;

        // Campos do plano
        if (body.plan_name !== undefined) updates.plan_name = body.plan_name;
        if (body.plan_price !== undefined) updates.plan_price = body.plan_price;
        if (body.max_clients !== undefined) updates.max_clients = body.max_clients;

        // Se tiver senha, hashear
        if (body.password && body.password.trim() !== '') {
            updates.password = await bcrypt.hash(body.password, 10);
        }

        if (Object.keys(updates).length === 0) {
            return new Response(JSON.stringify({ error: 'Nenhum dado para atualizar' }), { status: 400 });
        }

        const result = await db.update(resellers)
            .set(updates)
            .where(eq(resellers.id, id))
            .returning();

        return new Response(JSON.stringify(result[0]), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao atualizar revendedor';
        return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
}
