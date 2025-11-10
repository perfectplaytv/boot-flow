-- ============================================
-- Script SQL para ADICIONAR coluna 'pago'
-- na tabela users do Supabase
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em "SQL Editor"
-- 3. Cole este script completo
-- 4. Clique em "Run" ou pressione Ctrl+Enter
-- 5. Verifique se a coluna foi criada com sucesso
--
-- ============================================

-- Verificar se a tabela users existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    RAISE EXCEPTION 'Tabela users não existe! Execute primeiro o script de criação da tabela.';
  END IF;
END $$;

-- Adiciona coluna pago se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'pago'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN pago BOOLEAN NOT NULL DEFAULT FALSE;
    
    COMMENT ON COLUMN public.users.pago IS 'Indica se o cliente está com pagamento em dia. TRUE = Pago, FALSE = Não Pago';
    
    RAISE NOTICE 'Coluna pago adicionada com sucesso na tabela users!';
  ELSE
    RAISE NOTICE 'Coluna pago já existe na tabela users.';
  END IF;
END $$;

-- Cria índice para melhor performance em buscas por status de pagamento
CREATE INDEX IF NOT EXISTS idx_users_pago ON public.users(pago) WHERE pago = TRUE;

-- Verificar se a coluna foi criada corretamente
DO $$ 
DECLARE
  col_exists BOOLEAN;
  col_type TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'pago'
  ) INTO col_exists;
  
  IF col_exists THEN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'pago';
    
    RAISE NOTICE 'Coluna pago verificada: Tipo = %, Existe = %', col_type, col_exists;
  ELSE
    RAISE EXCEPTION 'Erro: Coluna pago não foi criada!';
  END IF;
END $$;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
-- Execute esta query para verificar se a coluna existe:
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
-- AND table_name = 'users' 
-- AND column_name = 'pago';
-- ============================================

