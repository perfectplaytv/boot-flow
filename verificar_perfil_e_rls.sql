-- ============================================
-- VERIFICAR E CORRIGIR POLÍTICAS RLS DO PROFILES
-- Execute este script se o login não estiver funcionando
-- ============================================

-- ============================================
-- 1. VERIFICAR SE O PERFIL EXISTE
-- ============================================
SELECT 
  id,
  email,
  role,
  full_name,
  created_at
FROM public.profiles
WHERE email = 'pontonois@gmail.com';

-- Se não existir, criar:
-- INSERT INTO public.profiles (id, email, role, full_name)
-- SELECT id, email, 'admin', 'Seu Nome'
-- FROM auth.users
-- WHERE email = 'pontonois@gmail.com';

-- ============================================
-- 2. VERIFICAR POLÍTICAS RLS ATUAIS
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- 3. REMOVER E RECRIAR POLÍTICAS CORRETAS
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Criar política para SELECT (leitura)
-- IMPORTANTE: Permite que usuários autenticados leiam qualquer perfil
CREATE POLICY "Enable read access for all users"
  ON public.profiles FOR SELECT
  TO public
  USING (auth.role() = 'authenticated');

-- Criar política para INSERT (inserção)
-- IMPORTANTE: Permite que usuários autenticados criem perfis
CREATE POLICY "Enable insert for authenticated users only"
  ON public.profiles FOR INSERT
  TO public
  WITH CHECK (auth.role() = 'authenticated');

-- Criar política para UPDATE (atualização)
-- IMPORTANTE: Permite que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Enable update for users based on id"
  ON public.profiles FOR UPDATE
  TO public
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 4. VERIFICAR SE RLS ESTÁ HABILITADO
-- ============================================
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Se rowsecurity = false, habilitar:
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. VERIFICAR SE O PERFIL FOI CRIADO CORRETAMENTE
-- ============================================
-- Execute após fazer login novamente:
SELECT 
  u.id as auth_user_id,
  u.email as auth_email,
  p.id as profile_id,
  p.email as profile_email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'pontonois@gmail.com';

