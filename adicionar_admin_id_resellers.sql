-- ============================================
-- Script SQL para ADICIONAR coluna admin_id
-- na tabela resellers (sem recriar a tabela)
-- ============================================
-- Execute este script no SQL Editor do Supabase

-- Adiciona coluna admin_id se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'admin_id') THEN
    ALTER TABLE public.resellers ADD COLUMN admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_resellers_admin_id ON public.resellers(admin_id);
    COMMENT ON COLUMN public.resellers.admin_id IS 'ID do admin responsável por este revenda';
    RAISE NOTICE 'Coluna admin_id adicionada com sucesso à tabela resellers';
  ELSE
    RAISE NOTICE 'Coluna admin_id já existe na tabela resellers';
  END IF;
END $$;

-- ============================================
-- Atualizar políticas RLS para resellers
-- ============================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Admins podem ver seus próprios revendas" ON public.resellers;
DROP POLICY IF EXISTS "Admins podem inserir revendas com seu admin_id" ON public.resellers;
DROP POLICY IF EXISTS "Admins podem atualizar seus próprios revendas" ON public.resellers;
DROP POLICY IF EXISTS "Admins podem deletar seus próprios revendas" ON public.resellers;

-- Habilitar RLS na tabela resellers (se ainda não estiver habilitado)
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Admins veem apenas seus próprios revendas ou revendas sem admin (NULL)
CREATE POLICY "Admins podem ver seus próprios revendas"
ON public.resellers
FOR SELECT
USING (
  auth.uid()::text = admin_id::text 
  OR admin_id IS NULL
);

-- Política INSERT: Ao criar um revenda, o admin_id é automaticamente definido como o ID do admin logado
CREATE POLICY "Admins podem inserir revendas com seu admin_id"
ON public.resellers
FOR INSERT
WITH CHECK (
  auth.uid()::text = admin_id::text
);

-- Política UPDATE: Admins podem atualizar apenas seus próprios revendas
CREATE POLICY "Admins podem atualizar seus próprios revendas"
ON public.resellers
FOR UPDATE
USING (
  auth.uid()::text = admin_id::text
)
WITH CHECK (
  auth.uid()::text = admin_id::text
);

-- Política DELETE: Admins podem deletar apenas seus próprios revendas
CREATE POLICY "Admins podem deletar seus próprios revendas"
ON public.resellers
FOR DELETE
USING (
  auth.uid()::text = admin_id::text
);

-- ============================================
-- Verificação
-- ============================================

-- Verificar se a coluna foi criada
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'resellers'
AND column_name = 'admin_id';

-- Verificar estatísticas
SELECT 
  COUNT(*) as total_revendas,
  COUNT(admin_id) as revendas_com_admin,
  COUNT(*) - COUNT(admin_id) as revendas_sem_admin
FROM public.resellers;

-- Listar revendas por admin
SELECT 
  p.email as admin_email,
  p.full_name as admin_nome,
  COUNT(r.id) as total_revendas
FROM public.profiles p
LEFT JOIN public.resellers r ON r.admin_id::text = p.id::text
WHERE p.role = 'admin'
GROUP BY p.id, p.email, p.full_name
ORDER BY total_revendas DESC;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

