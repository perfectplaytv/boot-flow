-- ============================================
-- DIAGNÓSTICO DE LOGIN - Execute este SQL
-- ============================================

-- 1. Verificar se o usuário existe no auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'pontonois@gmail.com';

-- 2. Verificar se o perfil existe na tabela profiles
SELECT 
  id,
  email,
  role,
  full_name,
  created_at
FROM public.profiles
WHERE email = 'pontonois@gmail.com';

-- 3. Se o perfil não existir, CRIAR:
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  id, 
  email, 
  'admin'::text, 
  'Admin'::text
FROM auth.users
WHERE email = 'pontonois@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', full_name = COALESCE(profiles.full_name, 'Admin');

-- 4. Verificar políticas RLS da tabela profiles
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles';

-- 5. Verificar se RLS está habilitado
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

