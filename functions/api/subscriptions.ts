// API para criar um pedido de assinatura (subscription)
interface Env {
    DB: D1Database;
}

interface SubscriptionData {
    name: string;
    email: string;
    cpf: string;
    whatsapp?: string;
    plan_name: string;
    plan_price: string;
    payment_id?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const data = await context.request.json() as SubscriptionData;

        if (!data.name || !data.email || !data.plan_name) {
            return new Response(JSON.stringify({ error: "Dados incompletos" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Inserir novo pedido de assinatura
        const result = await context.env.DB.prepare(`
            INSERT INTO subscriptions (
                customer_name,
                customer_email,
                customer_cpf,
                customer_whatsapp,
                plan_name,
                plan_price,
                payment_id,
                status,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'), datetime('now'))
        `).bind(
            data.name,
            data.email,
            data.cpf || '',
            data.whatsapp || '',
            data.plan_name,
            data.plan_price,
            data.payment_id || ''
        ).run();

        const subscriptionId = result.meta.last_row_id;

        return new Response(JSON.stringify({
            success: true,
            message: "Pedido de assinatura criado com sucesso",
            subscription_id: subscriptionId
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Erro ao criar pedido:", err);
        return new Response(JSON.stringify({
            error: err instanceof Error ? err.message : "Erro interno do servidor"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

// GET - Buscar pedido por ID ou listar todos pendentes
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');
        const status = url.searchParams.get('status') || 'pending';

        if (id) {
            // Buscar pedido específico
            const subscription = await context.env.DB.prepare(
                "SELECT * FROM subscriptions WHERE id = ?"
            ).bind(id).first();

            if (!subscription) {
                return new Response(JSON.stringify({ error: "Pedido não encontrado" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            return new Response(JSON.stringify(subscription), {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // Listar pedidos por status
            const subscriptions = await context.env.DB.prepare(
                "SELECT * FROM subscriptions WHERE status = ? ORDER BY created_at DESC"
            ).bind(status).all();

            return new Response(JSON.stringify(subscriptions.results || []), {
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        return new Response(JSON.stringify({ error: "Erro interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
