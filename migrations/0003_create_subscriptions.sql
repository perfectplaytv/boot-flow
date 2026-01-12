-- Migration: Create subscriptions table for pending orders
-- Created: 2026-01-12

CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Dados do cliente
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_cpf TEXT,
    customer_whatsapp TEXT,
    -- Dados do plano
    plan_name TEXT NOT NULL,
    plan_price TEXT NOT NULL,
    -- Status do pedido: pending, approved, active, cancelled
    status TEXT DEFAULT 'pending',
    -- ID do pagamento no Mercado Pago (se houver)
    payment_id TEXT,
    -- ID do revendedor criado após aprovação
    reseller_id INTEGER,
    -- Timestamps
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    approved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(customer_email);
