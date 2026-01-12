// API para aprovar um pedido de assinatura
interface Env {
    DB: D1Database;
}

// Configuração de limite de clientes por plano
const PLAN_MAX_CLIENTS: Record<string, number> = {
    'Essencial': 5,
    'Profissional': 50,
    'Business': 100,
    'Elite': 1000
};

// Função para gerar senha aleatória
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
        const { subscription_id } = await context.request.json() as { subscription_id: number };

        if (!subscription_id) {
            return new Response(JSON.stringify({ error: "ID do pedido é obrigatório" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Buscar o pedido
        const subscription = await context.env.DB.prepare(
            "SELECT * FROM subscriptions WHERE id = ?"
        ).bind(subscription_id).first() as {
            id: number;
            customer_name: string;
            customer_email: string;
            customer_cpf: string;
            customer_whatsapp: string;
            plan_name: string;
            plan_price: string;
            status: string;
            created_at: string;
        } | null;

        if (!subscription) {
            return new Response(JSON.stringify({ error: "Pedido não encontrado" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (subscription.status !== 'pending') {
            return new Response(JSON.stringify({ error: "Pedido já foi processado" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Gerar username a partir do email
        const username = subscription.customer_email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

        // Gerar senha aleatória
        const password = generatePassword(10);

        // Obter limite de clientes pelo plano
        const maxClients = PLAN_MAX_CLIENTS[subscription.plan_name] || 5;

        // Criar o revendedor com todos os dados do plano
        const resellerResult = await context.env.DB.prepare(`
            INSERT INTO resellers (
                username,
                email,
                password,
                personal_name,
                permission,
                credits,
                status,
                whatsapp,
                observations,
                plan_name,
                plan_price,
                max_clients,
                subscription_date,
                created_at,
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).bind(
            username,
            subscription.customer_email,
            password,
            subscription.customer_name,
            'reseller',
            10,
            'Ativo',
            subscription.customer_whatsapp || '',
            `CPF: ${subscription.customer_cpf}`,
            subscription.plan_name,
            subscription.plan_price,
            maxClients,
            subscription.created_at
        ).run();

        const resellerId = resellerResult.meta.last_row_id;

        // Atualizar o status do pedido para 'approved'
        await context.env.DB.prepare(`
            UPDATE subscriptions 
            SET status = 'approved', 
                reseller_id = ?, 
                approved_at = datetime('now'),
                updated_at = datetime('now')
            WHERE id = ?
        `).bind(resellerId, subscription_id).run();

        return new Response(JSON.stringify({
            success: true,
            message: "Pedido aprovado com sucesso! Revendedor criado.",
            reseller_id: resellerId,
            username: username,
            password: password,
            plan_name: subscription.plan_name,
            plan_price: subscription.plan_price,
            max_clients: maxClients
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Erro ao aprovar pedido:", err);
        return new Response(JSON.stringify({
            error: err instanceof Error ? err.message : "Erro interno do servidor"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
