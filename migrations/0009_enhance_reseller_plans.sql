-- Migration: Add detailed plan limits and feature flags to resellers
-- Created: 2026-01-22

-- Limites numéricos (default = Essencial values where applicable, or minimal safe defaults)
-- Limites numéricos (default = Essencial values where applicable, or minimal safe defaults)
-- ALTER TABLE resellers ADD COLUMN max_resellers INTEGER DEFAULT 5;
-- ALTER TABLE resellers ADD COLUMN max_apps INTEGER DEFAULT 5;
-- ALTER TABLE resellers ADD COLUMN max_servers INTEGER DEFAULT 5;
-- ALTER TABLE resellers ADD COLUMN max_charges INTEGER DEFAULT 5;
-- ALTER TABLE resellers ADD COLUMN max_whatsapp_connections INTEGER DEFAULT 1;
-- ALTER TABLE resellers ADD COLUMN max_whatsapp_notifications INTEGER DEFAULT 5;
-- ALTER TABLE resellers ADD COLUMN max_payment_gateways INTEGER DEFAULT 4;
-- ALTER TABLE resellers ADD COLUMN max_pricing_plans INTEGER DEFAULT 0; -- 0 means default/not editable or basic

-- Features (Flags) - 0 = false, 1 = true
-- ALTER TABLE resellers ADD COLUMN feature_analytics BOOLEAN DEFAULT 0;
-- ALTER TABLE resellers ADD COLUMN feature_automation BOOLEAN DEFAULT 0;
-- ALTER TABLE resellers ADD COLUMN feature_botgram BOOLEAN DEFAULT 0;

-- Suporte level
-- ALTER TABLE resellers ADD COLUMN support_level TEXT DEFAULT 'standard'; -- standard, priority, vip

-- Configuração de Tema (opcional, para override manual futuro)
-- ALTER TABLE resellers ADD COLUMN theme_override_color TEXT DEFAULT NULL;
