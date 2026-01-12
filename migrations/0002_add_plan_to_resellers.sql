-- Migration: Add plan column to resellers table
-- Created: 2026-01-12

-- Adicionar coluna para armazenar o plano contratado
ALTER TABLE resellers ADD COLUMN plan_name TEXT DEFAULT '';
ALTER TABLE resellers ADD COLUMN plan_price TEXT DEFAULT '';
