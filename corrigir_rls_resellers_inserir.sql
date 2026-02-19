-- ============================================
-- Script SQL para CORRIGIR RLS e PERMITIR INSERÇÕES
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. DESABILITAR RLS TEMPORARIAMENTE (para permitir inserções)
ALTER TABLE public.resellers DISABLE ROW LEVEL SECURITY;

-- 2. Verificar se o RLS foi desabilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity as rls_habilitado
FROM pg_tables 
WHERE tablename = 'resellers' 
AND schemaname = 'public';

-- 3. Se quiser manter RLS mas com políticas permissivas, execute:
-- ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Resellers can insert all" ON public.resellers;
-- CREATE POLICY "Resellers can insert all"
--   ON public.resellers FOR INSERT
--   WITH CHECK (true);  -- Permite inserção para todos
--
-- DROP POLICY IF EXISTS "Resellers can view all" ON public.resellers;
-- CREATE POLICY "Resellers can view all"
--   ON public.resellers FOR SELECT
--   USING (true);  -- Permite visualização para todos

-- ============================================
-- FIM DO SCRIPT
-- ============================================

