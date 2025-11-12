-- ============================================
-- ADICIONAR COLUNA admin_id NA TABELA users
-- ============================================
-- Este script adiciona a coluna admin_id para associar cada cliente a um admin
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- PASSO 1: Adicionar coluna admin_id
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

-- Adiciona coluna admin_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'admin_id'
  ) THEN
    -- Adiciona coluna admin_id como UUID (referência para auth.users.id)
    ALTER TABLE public.users
    ADD COLUMN admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

    COMMENT ON COLUMN public.users.admin_id IS 'ID do admin responsável por este cliente. NULL significa que o cliente não está associado a nenhum admin.';

    RAISE NOTICE 'Coluna admin_id adicionada com sucesso na tabela users!';
  ELSE
    RAISE NOTICE 'Coluna admin_id já existe na tabela users.';
  END IF;
END $$;

-- ============================================
-- PASSO 2: Criar índice para melhor performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_admin_id ON public.users(admin_id) WHERE admin_id IS NOT NULL;

-- ============================================
-- PASSO 3: Atualizar políticas RLS
-- ============================================

-- Verificar se RLS está habilitado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'users'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS habilitado na tabela users.';
  ELSE
    RAISE NOTICE 'RLS já está habilitado na tabela users.';
  END IF;
END $$;

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can delete own data" ON public.users;

-- Política para SELECT: Admins veem apenas seus próprios clientes
CREATE POLICY "Admins can view their own clients"
  ON public.users
  FOR SELECT
  USING (
    -- Verificar se o usuário logado é admin
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
    AND
    (
      -- Se admin_id for NULL, qualquer admin pode ver (clientes não associados)
      admin_id IS NULL
      OR
      -- Ou se o admin_id corresponde ao usuário logado
      admin_id = auth.uid()
    )
  );

-- Política para INSERT: Admins podem criar clientes associados a eles
CREATE POLICY "Admins can insert clients"
  ON public.users
  FOR INSERT
  WITH CHECK (
    -- O admin_id deve ser o ID do usuário logado (ou NULL)
    (admin_id IS NULL OR admin_id = auth.uid())
    AND
    -- O usuário logado deve ser admin
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Política para UPDATE: Admins podem atualizar apenas seus próprios clientes
CREATE POLICY "Admins can update their own clients"
  ON public.users
  FOR UPDATE
  USING (
    -- Pode atualizar se o cliente não está associado a nenhum admin
    admin_id IS NULL
    OR
    -- Ou se o cliente está associado ao admin logado
    admin_id = auth.uid()
  )
  WITH CHECK (
    -- Ao atualizar, o admin_id não pode ser alterado para outro admin
    (admin_id IS NULL OR admin_id = auth.uid())
  );

-- Política para DELETE: Admins podem deletar apenas seus próprios clientes
CREATE POLICY "Admins can delete their own clients"
  ON public.users
  FOR DELETE
  USING (
    -- Pode deletar se o cliente não está associado a nenhum admin
    admin_id IS NULL
    OR
    -- Ou se o cliente está associado ao admin logado
    admin_id = auth.uid()
  );

RAISE NOTICE 'Políticas RLS configuradas com sucesso!';

-- ============================================
-- PASSO 4: Migrar dados existentes (OPCIONAL)
-- ============================================
-- Se você já tem clientes cadastrados e quer associá-los a um admin específico,
-- execute este bloco substituindo 'admin@exemplo.com' pelo email do admin

/*
-- Associar todos os clientes existentes a um admin específico
UPDATE public.users
SET admin_id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@exemplo.com'  -- ALTERE AQUI
  LIMIT 1
)
WHERE admin_id IS NULL;
*/

-- ============================================
-- PASSO 5: Verificação
-- ============================================

-- Verificar se a coluna foi criada
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
AND column_name = 'admin_id';

-- Verificar estatísticas
SELECT 
  COUNT(*) as total_clientes,
  COUNT(admin_id) as clientes_com_admin,
  COUNT(*) - COUNT(admin_id) as clientes_sem_admin
FROM public.users;

-- Listar clientes por admin
SELECT 
  p.email as admin_email,
  p.full_name as admin_nome,
  COUNT(u.id) as total_clientes
FROM public.profiles p
LEFT JOIN public.users u ON u.admin_id = p.id
WHERE p.role = 'admin'
GROUP BY p.id, p.email, p.full_name
ORDER BY total_clientes DESC;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

