
interface Env {
    DB: D1Database;
}

const MERCADO_PAGO_TOKEN = "APP_USR-233787625021211-011103-2cfc9a9b55695cb0faddbfc47c7b08ef-3095772720";

// Configuração de limite de clientes por plano
const PLAN_MAX_CLIENTS: Record<string, number> = {
    'Essencial': 5,
    'Profissional': 50,
    'Business': 100,
    'Elite': 1000
};

function generatePassword(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { payment_id, subscription_id } = await context.request.json() as { payment_id: string, subscription_id: number };

        if (!payment_id || !subscription_id) {
            return new Response(JSON.stringify({ error: "IDs obrigatórios" }), { status: 400 });
        }

        // Consultar Mercado Pago
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
            headers: {
                "Authorization": `Bearer ${MERCADO_PAGO_TOKEN}`
            }
        });

        if (!mpResponse.ok) {
            return new Response(JSON.stringify({ error: "Erro ao consultar Mercado Pago" }), { status: 502 });
        }

        const mpData = await mpResponse.json() as any;
        const status = mpData.status;

        // Buscar Subscription
        const subscription = await context.env.DB.prepare(
            "SELECT * FROM subscriptions WHERE id = ?"
        ).bind(subscription_id).first() as any;

        if (!subscription) {
            return new Response(JSON.stringify({ error: "Pedido não encontrado" }), { status: 404 });
        }

        if (status === 'approved') {
            if (subscription.status === 'approved' && subscription.reseller_id) {
                const reseller = await context.env.DB.prepare("SELECT username, password FROM resellers WHERE id = ?").bind(subscription.reseller_id).first() as any;

                return new Response(JSON.stringify({
                    status: 'approved',
                    message: "Pagamento já processado.",
                    username: reseller?.username,
                    password: reseller?.password
                }), { headers: { "Content-Type": "application/json" } });
            }

            if (subscription.status === 'pending') {
                const username = subscription.customer_email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                const password = generatePassword(10);
                const maxClients = PLAN_MAX_CLIENTS[subscription.plan_name] || 5;

                // Buscar ID do Super Admin para atribuir a revenda (Isolamento de Dados)
                // Se não achar, atribui null (órfão)
                const superAdmin = await context.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind('pontonois@gmail.com').first() as any;
                const ownerUid = superAdmin ? `user:${superAdmin.id}` : null;

                // Criar Revendedor
                const resellerResult = await context.env.DB.prepare(`
                    INSERT INTO resellers (
                        username, email, password, personal_name, permission, credits, status, whatsapp, observations,
                        plan_name, plan_price, max_clients, subscription_date, owner_uid, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, datetime('now'), datetime('now'))
                `).bind(
                    username,
                    subscription.customer_email,
                    password,
                    subscription.customer_name,
                    'reseller',
                    10,
                    'Ativo',
                    subscription.customer_whatsapp || '',
                    `CPF: ${subscription.customer_cpf} | Auto-aprovado via Mercado Pago (ID: ${payment_id})`,
                    subscription.plan_name,
                    subscription.plan_price,
                    maxClients,
                    ownerUid // Atribui ao Super Admin
                ).run();

                const resellerId = resellerResult.meta.last_row_id;

                await context.env.DB.prepare(`
                    UPDATE subscriptions 
                    SET status = 'approved', reseller_id = ?, approved_at = datetime('now'), updated_at = datetime('now'), payment_id = ?
                    WHERE id = ?
                `).bind(resellerId, payment_id, subscription_id).run();

                return new Response(JSON.stringify({
                    status: 'approved',
                    success: true,
                    message: "Pagamento aprovado e revendedor criado!",
                    username,
                    password
                }), { headers: { "Content-Type": "application/json" } });
            }
        }

        return new Response(JSON.stringify({
            status: status,
            message: "Aguardando pagamento..."
        }), { headers: { "Content-Type": "application/json" } });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
