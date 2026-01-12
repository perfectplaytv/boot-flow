
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
        const status = mpData.status; // pending, approved, authorized, in_process, in_mediation, rejected, cancelled, refunded, charged_back

        // Buscar Subscription
        const subscription = await context.env.DB.prepare(
            "SELECT * FROM subscriptions WHERE id = ?"
        ).bind(subscription_id).first() as any;

        if (!subscription) {
            return new Response(JSON.stringify({ error: "Pedido não encontrado" }), { status: 404 });
        }

        if (status === 'approved') {
            // Se já foi processado/aprovado anteriormente, apenas retornar sucesso e credenciais se possível
            if (subscription.status === 'approved' && subscription.reseller_id) {
                // Buscar credenciais do revendedor já existente para retornar (opcional, mas bom user experience se ele recarregar a página)
                const reseller = await context.env.DB.prepare("SELECT username, password FROM resellers WHERE id = ?").bind(subscription.reseller_id).first() as any;

                return new Response(JSON.stringify({
                    status: 'approved',
                    message: "Pagamento já processado.",
                    username: reseller?.username,
                    password: reseller?.password // Apenas se quiser exibir novamente
                }), { headers: { "Content-Type": "application/json" } });
            }

            // Se ainda está pendente, aprovar e criar revendedor
            if (subscription.status === 'pending') {
                // 1. Gerar Username/Password
                const username = subscription.customer_email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
                const password = generatePassword(10);
                const maxClients = PLAN_MAX_CLIENTS[subscription.plan_name] || 5;

                // 2. Criar Revendedor
                const resellerResult = await context.env.DB.prepare(`
                    INSERT INTO resellers (
                        username, email, password, personal_name, permission, credits, status, whatsapp, observations,
                        plan_name, plan_price, max_clients, subscription_date, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))
                `).bind(
                    username,
                    subscription.customer_email,
                    password,
                    subscription.customer_name,
                    'reseller', // Permission
                    10, // Default credits
                    'Ativo',
                    subscription.customer_whatsapp || '',
                    `CPF: ${subscription.customer_cpf} | Auto-aprovado via Mercado Pago (ID: ${payment_id})`,
                    subscription.plan_name,
                    subscription.plan_price,
                    maxClients,
                    subscription.created_at
                ).run();

                const resellerId = resellerResult.meta.last_row_id;

                // 3. Atualizar Subscription
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

        // Se não aprovado
        return new Response(JSON.stringify({
            status: status, // pending, in_process, etc
            message: "Aguardando pagamento..."
        }), { headers: { "Content-Type": "application/json" } });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
};
