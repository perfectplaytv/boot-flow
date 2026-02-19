// Mercado Pago Webhook Handler
// Receives payment notifications and updates subscription status

interface Env {
    DB: D1Database;
}

interface MercadoPagoWebhookData {
    action: string;
    api_version: string;
    data: {
        id: string;
    };
    date_created: string;
    id: number;
    live_mode: boolean;
    type: string;
    user_id: string;
}

interface MercadoPagoPayment {
    id: number;
    status: string;
    status_detail: string;
    external_reference?: string;
    transaction_amount: number;
    payer: {
        email?: string;
        first_name?: string;
        last_name?: string;
    };
    date_approved?: string;
}

// Get payment details from Mercado Pago API
async function getPaymentDetails(paymentId: string, accessToken: string): Promise<MercadoPagoPayment | null> {
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error(`[MP Webhook] Failed to get payment ${paymentId}: ${response.status}`);
            return null;
        }

        return await response.json() as MercadoPagoPayment;
    } catch (error) {
        console.error('[MP Webhook] Error fetching payment:', error);
        return null;
    }
}

// Update subscription status based on payment
async function updateSubscriptionStatus(
    db: D1Database,
    paymentId: string,
    status: string,
    approvedAt?: string
): Promise<boolean> {
    try {
        const now = new Date().toISOString();

        if (status === 'approved') {
            await db.prepare(`
                UPDATE subscriptions 
                SET status = 'approved',
                    approved_at = ?,
                    updated_at = ?
                WHERE payment_id = ?
            `).bind(approvedAt || now, now, paymentId).run();
        } else if (status === 'rejected' || status === 'cancelled') {
            await db.prepare(`
                UPDATE subscriptions 
                SET status = 'cancelled',
                    updated_at = ?
                WHERE payment_id = ?
            `).bind(now, paymentId).run();
        } else if (status === 'pending' || status === 'in_process') {
            await db.prepare(`
                UPDATE subscriptions 
                SET status = 'pending',
                    updated_at = ?
                WHERE payment_id = ?
            `).bind(now, paymentId).run();
        }

        return true;
    } catch (error) {
        console.error('[MP Webhook] Error updating subscription:', error);
        return false;
    }
}

// Create reseller account after payment approval
async function createResellerFromSubscription(
    db: D1Database,
    subscriptionId: number
): Promise<number | null> {
    try {
        const subscription = await db.prepare(
            'SELECT * FROM subscriptions WHERE id = ?'
        ).bind(subscriptionId).first<{
            id: number;
            customer_name: string;
            customer_email: string;
            customer_cpf?: string;
            customer_whatsapp?: string;
            plan_name: string;
            reseller_id?: number;
        }>();

        if (!subscription) {
            console.error('[MP Webhook] Subscription not found:', subscriptionId);
            return null;
        }

        // Check if reseller already exists
        if (subscription.reseller_id) {
            return subscription.reseller_id;
        }

        // Check if reseller with this email already exists
        const existingReseller = await db.prepare(
            'SELECT id FROM resellers WHERE email = ?'
        ).bind(subscription.customer_email).first<{ id: number }>();

        if (existingReseller) {
            // Update subscription with existing reseller
            await db.prepare(
                'UPDATE subscriptions SET reseller_id = ?, status = ? WHERE id = ?'
            ).bind(existingReseller.id, 'active', subscriptionId).run();
            return existingReseller.id;
        }

        // Generate username from name (remove spaces, lowercase, add random suffix)
        const baseName = subscription.customer_name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]/g, '') // Remove special chars
            .substring(0, 15);
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const username = `${baseName}${randomSuffix}`;

        // Generate random password
        const randomPassword = Math.random().toString(36).substring(2, 10) +
            Math.random().toString(36).substring(2, 6).toUpperCase();

        // Hash password using simple SHA-256 (no bcrypt available in CF Workers)
        // For production, consider using Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(randomPassword);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Create new reseller with all required fields
        const now = new Date().toISOString();
        const result = await db.prepare(`
            INSERT INTO resellers (
                username, 
                email, 
                password, 
                permission, 
                personal_name,
                status, 
                whatsapp,
                created_at, 
                updated_at
            )
            VALUES (?, ?, ?, 'reseller', ?, 'Ativo', ?, ?, ?)
        `).bind(
            username,
            subscription.customer_email,
            randomPassword, // Store plain text for now since login compares plain text
            subscription.customer_name,
            subscription.customer_whatsapp || '',
            now,
            now
        ).run();

        const resellerId = result.meta.last_row_id;

        // Update subscription with new reseller ID and store generated password
        await db.prepare(
            'UPDATE subscriptions SET reseller_id = ?, status = ? WHERE id = ?'
        ).bind(resellerId, 'active', subscriptionId).run();

        console.log(`[MP Webhook] Created reseller ${resellerId} (${username}) for subscription ${subscriptionId}`);
        return resellerId as number;
    } catch (error) {
        console.error('[MP Webhook] Error creating reseller:', error);
        return null;
    }
}

// Log webhook event
async function logWebhookEvent(
    db: D1Database,
    eventType: string,
    paymentId: string,
    status: string,
    rawData: string
): Promise<void> {
    try {
        // Create table if not exists
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS webhook_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                payment_id TEXT,
                status TEXT,
                raw_data TEXT,
                processed_at TEXT DEFAULT (datetime('now'))
            )
        `).run();

        await db.prepare(`
            INSERT INTO webhook_logs (event_type, payment_id, status, raw_data)
            VALUES (?, ?, ?, ?)
        `).bind(eventType, paymentId, status, rawData).run();
    } catch (error) {
        console.error('[MP Webhook] Error logging event:', error);
    }
}

// POST - Receive webhook from Mercado Pago
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { DB } = context.env;

    try {
        const body = await context.request.text();
        const data = JSON.parse(body) as MercadoPagoWebhookData;

        console.log('[MP Webhook] Received:', data.type, data.action);

        // Log the event
        await logWebhookEvent(DB, data.type, data.data?.id || '', data.action, body);

        // Only process payment events
        if (data.type !== 'payment') {
            return new Response('OK', { status: 200 });
        }

        const paymentId = data.data.id;

        // Get Mercado Pago access token from environment or database
        // For now, we'll try to get it from a config table
        const config = await DB.prepare(
            "SELECT value FROM app_config WHERE key = 'mercadopago_access_token'"
        ).first<{ value: string }>();

        if (!config?.value) {
            console.error('[MP Webhook] Access token not configured');
            // Still return 200 to acknowledge receipt
            return new Response('OK - Token not configured', { status: 200 });
        }

        // Get payment details
        const payment = await getPaymentDetails(paymentId, config.value);

        if (!payment) {
            return new Response('OK - Payment not found', { status: 200 });
        }

        console.log(`[MP Webhook] Payment ${paymentId} status: ${payment.status}`);

        // Update subscription status
        await updateSubscriptionStatus(DB, paymentId, payment.status, payment.date_approved);

        // If approved, create reseller account
        if (payment.status === 'approved') {
            const subscription = await DB.prepare(
                'SELECT id FROM subscriptions WHERE payment_id = ?'
            ).bind(paymentId).first<{ id: number }>();

            if (subscription) {
                await createResellerFromSubscription(DB, subscription.id);
                console.log(`[MP Webhook] Payment ${paymentId} approved, reseller created`);
            }
        }

        return new Response('OK', { status: 200 });
    } catch (error) {
        console.error('[MP Webhook] Error:', error);
        // Return 200 anyway to prevent Mercado Pago from retrying
        return new Response('OK - Error processed', { status: 200 });
    }
};

// GET - Health check and webhook verification
export const onRequestGet: PagesFunction<Env> = async (context) => {
    return Response.json({
        status: 'active',
        message: 'Mercado Pago Webhook endpoint is ready',
        timestamp: new Date().toISOString(),
    });
};
