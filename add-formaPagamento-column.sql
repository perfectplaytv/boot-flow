-- Script para adicionar a coluna formaPagamento à tabela cobrancas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Adicionar a coluna formaPagamento
ALTER TABLE cobrancas 
ADD COLUMN IF NOT EXISTS formaPagamento VARCHAR(50);

-- 2. Adicionar outras colunas que podem estar faltando
ALTER TABLE cobrancas 
ADD COLUMN IF NOT EXISTS gateway VARCHAR(50),
ADD COLUMN IF NOT EXISTS tentativas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ultimaTentativa TIMESTAMP,
ADD COLUMN IF NOT EXISTS proximaTentativa TIMESTAMP,
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 3. Verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cobrancas' 
ORDER BY ordinal_position;

-- 4. Atualizar registros existentes com valores padrão para formaPagamento
UPDATE cobrancas 
SET formaPagamento = 'PIX' 
WHERE formaPagamento IS NULL;

-- 5. Verificar se a coluna foi adicionada corretamente
SELECT * FROM cobrancas LIMIT 5; 