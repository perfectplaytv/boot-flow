// Public endpoint to check subscription/payment status
// No authentication required - only returns limited info

interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    const paymentId = url.searchParams.get('payment_id');

    if (!id && !paymentId) {
        return Response.json({
            error: 'ID ou payment_id é obrigatório'
        }, { status: 400 });
    }

    try {
        let subscription;

        if (id) {
            subscription = await context.env.DB.prepare(
                `SELECT id, status, plan_name, plan_price, customer_name, approved_at, created_at 
                 FROM subscriptions WHERE id = ?`
            ).bind(id).first();
        } else if (paymentId) {
            subscription = await context.env.DB.prepare(
                `SELECT id, status, plan_name, plan_price, customer_name, approved_at, created_at 
                 FROM subscriptions WHERE payment_id = ?`
            ).bind(paymentId).first();
        }

        if (!subscription) {
            return Response.json({
                error: 'Pedido não encontrado',
                status: 'not_found'
            }, { status: 404 });
        }

        // Return only safe public info
        return Response.json({
            success: true,
            data: {
                id: subscription.id,
                status: subscription.status,
                plan_name: subscription.plan_name,
                plan_price: subscription.plan_price,
                customer_name: subscription.customer_name,
                approved_at: subscription.approved_at,
                created_at: subscription.created_at,
            }
        });
    } catch (error) {
        console.error('[Payment Status] Error:', error);
        return Response.json({
            error: 'Erro ao verificar status'
        }, { status: 500 });
    }
};
