-- Migration: Add plan columns to resellers table
-- Created: 2026-01-12

-- Adicionar colunas de plano
ALTER TABLE resellers ADD COLUMN plan_name TEXT DEFAULT 'Essencial';
ALTER TABLE resellers ADD COLUMN plan_price TEXT DEFAULT 'R$ 0';
ALTER TABLE resellers ADD COLUMN max_clients INTEGER DEFAULT 5;
ALTER TABLE resellers ADD COLUMN subscription_date TEXT;
