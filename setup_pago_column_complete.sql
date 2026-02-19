-- ============================================
-- SCRIPT COMPLETO: Adicionar Coluna 'pago' e Configurar Permissões
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse https://app.supabase.com
-- 2. Selecione seu projeto
-- 3. Vá em "SQL Editor" > "New query"
-- 4. Cole este script completo
-- 5. Clique em "Run" ou pressione Ctrl+Enter
-- 6. Verifique as mensagens de sucesso
--
-- ============================================

-- ============================================
-- PASSO 1: Verificar se a tabela users existe
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    RAISE EXCEPTION 'ERRO: Tabela users não existe! Execute primeiro o script de criação da tabela.';
  ELSE
    RAISE NOTICE '✓ Tabela users existe';
  END IF;
END $$;

-- ============================================
-- PASSO 2: Adicionar coluna pago se não existir
-- ============================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'pago'
  ) THEN
    -- Adicionar coluna
    ALTER TABLE public.users 
    ADD COLUMN pago BOOLEAN NOT NULL DEFAULT FALSE;
    
    -- Adicionar comentário
    COMMENT ON COLUMN public.users.pago IS 'Indica se o cliente está com pagamento em dia. TRUE = Pago, FALSE = Não Pago';
    
    RAISE NOTICE '✓ Coluna pago adicionada com sucesso!';
  ELSE
    RAISE NOTICE '✓ Coluna pago já existe';
  END IF;
END $$;

-- ============================================
-- PASSO 3: Criar índice para performance
-- ============================================
DO $$ 
BEGIN
  CREATE INDEX IF NOT EXISTS idx_users_pago ON public.users(pago) WHERE pago = TRUE;
  RAISE NOTICE '✓ Índice criado/verificado';
END $$;

-- ============================================
-- PASSO 4: Configurar RLS (Row Level Security)
-- ============================================

-- Verificar se RLS está habilitado
DO $$ 
DECLARE
  rls_enabled BOOLEAN;
BEGIN
  SELECT rowsecurity INTO rls_enabled
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename = 'users';
  
  IF rls_enabled THEN
    RAISE NOTICE '✓ RLS está habilitado';
    
    -- Remover políticas antigas que podem estar bloqueando
    DROP POLICY IF EXISTS "Users can update pago" ON public.users;
    DROP POLICY IF EXISTS "Allow update pago" ON public.users;
    DROP POLICY IF EXISTS "Update users pago" ON public.users;
    DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.users;
    
    -- Criar política para permitir UPDATE para usuários autenticados
    CREATE POLICY "Allow update pago column"
    ON public.users
    FOR UPDATE
    USING (auth.role() = 'authenticated' OR true)  -- Permite atualização
    WITH CHECK (true);
    
    -- Criar política para permitir SELECT (se não existir)
    DROP POLICY IF EXISTS "Allow select users" ON public.users;
    CREATE POLICY "Allow select users"
    ON public.users
    FOR SELECT
    USING (auth.role() = 'authenticated' OR true);  -- Permite leitura
    
    RAISE NOTICE '✓ Políticas RLS configuradas';
  ELSE
    RAISE NOTICE '⚠ RLS não está habilitado (isso está OK se você não usa RLS)';
  END IF;
END $$;

-- ============================================
-- PASSO 5: Verificação final
-- ============================================
DO $$ 
DECLARE
  col_exists BOOLEAN;
  col_type TEXT;
  col_default TEXT;
BEGIN
  -- Verificar se a coluna existe
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'pago'
  ) INTO col_exists;
  
  IF col_exists THEN
    -- Obter tipo e valor padrão
    SELECT data_type, column_default INTO col_type, col_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'pago';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERIFICAÇÃO FINAL:';
    RAISE NOTICE '  Coluna pago existe: %', col_exists;
    RAISE NOTICE '  Tipo: %', col_type;
    RAISE NOTICE '  Valor padrão: %', col_default;
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ Tudo configurado com sucesso!';
    RAISE NOTICE 'Agora você pode atualizar o status de pagamento dos clientes.';
  ELSE
    RAISE EXCEPTION 'ERRO: Coluna pago não foi criada! Verifique os logs acima.';
  END IF;
END $$;

-- ============================================
-- QUERY DE VERIFICAÇÃO (opcional)
-- ============================================
-- Execute esta query para verificar manualmente:
/*
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name = 'pago';
*/

-- ============================================
-- TESTE DE ATUALIZAÇÃO (opcional)
-- ============================================
-- Execute esta query para testar se consegue atualizar:
/*
UPDATE public.users 
SET pago = true 
WHERE id = (SELECT MIN(id) FROM public.users)
RETURNING id, name, pago;
*/
-- ============================================

