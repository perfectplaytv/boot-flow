-- ============================================
-- Script SQL para CONFIGURAR RLS (Row Level Security)
-- para permitir atualização da coluna 'pago'
-- na tabela users
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Execute este script APÓS executar add_pago_column_users.sql
-- 2. Este script garante que as políticas RLS permitam atualizar a coluna pago
-- 3. Se você não usa RLS, pode pular este script
--
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
    RAISE NOTICE 'RLS está habilitado na tabela users';
  ELSE
    RAISE NOTICE 'RLS NÃO está habilitado na tabela users';
  END IF;
END $$;

-- ============================================
-- OPÇÃO 1: Desabilitar RLS (mais simples, menos seguro)
-- ============================================
-- Use esta opção se você não precisa de RLS ou se está tendo problemas
-- ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- OPÇÃO 2: Criar/Atualizar Políticas RLS (mais seguro)
-- ============================================

-- Remover políticas antigas que podem estar bloqueando
DROP POLICY IF EXISTS "Users can update pago" ON public.users;
DROP POLICY IF EXISTS "Allow update pago" ON public.users;
DROP POLICY IF EXISTS "Update users pago" ON public.users;

-- Política para permitir atualização da coluna pago para usuários autenticados
-- Ajuste conforme suas necessidades de segurança
CREATE POLICY "Allow update pago column"
ON public.users
FOR UPDATE
USING (true)  -- Permite atualização para todos os usuários autenticados
WITH CHECK (true);

-- Política alternativa (mais restritiva): apenas admins podem atualizar
-- Descomente se quiser usar esta política mais restritiva:
-- CREATE POLICY "Only admins can update pago"
-- ON public.users
-- FOR UPDATE
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE profiles.id = auth.uid()
--     AND profiles.role = 'admin'
--   )
-- )
-- WITH CHECK (true);

-- Política para permitir leitura (se ainda não existir)
DROP POLICY IF EXISTS "Allow select users" ON public.users;
CREATE POLICY "Allow select users"
ON public.users
FOR SELECT
USING (true);  -- Permite leitura para todos os usuários autenticados

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute esta query para verificar as políticas RLS:
-- SELECT 
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE schemaname = 'public' 
-- AND tablename = 'users';
-- ============================================

-- ============================================
-- TESTE DE PERMISSÃO
-- ============================================
-- Após executar este script, teste se consegue atualizar:
-- UPDATE public.users 
-- SET pago = true 
-- WHERE id = 1;  -- Substitua 1 pelo ID de um usuário de teste
-- ============================================

