-- ============================================
-- CORRIGIR RLS PARA PERMITIR CADASTRO DE USUÁRIOS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. VERIFICAR SE O TRIGGER EXISTE E ESTÁ FUNCIONANDO
-- ============================================

-- Verificar se a função existe
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE proname = 'handle_new_user';

-- ============================================
-- 2. RECRIAR A FUNÇÃO COM SECURITY DEFINER
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. VERIFICAR SE O TRIGGER ESTÁ CONFIGURADO
-- ============================================

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. AJUSTAR POLÍTICAS RLS
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Política: Usuários autenticados podem ver todos os perfis
CREATE POLICY "Enable read access for all users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Permitir inserção via trigger (SECURITY DEFINER)
-- Esta política permite que a função handle_new_user() insira perfis
CREATE POLICY "Enable insert for service role"
  ON public.profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Política alternativa: Permitir inserção para usuários autenticados criando seu próprio perfil
CREATE POLICY "Enable insert for authenticated users only"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Política: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Enable update for users based on id"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 5. VERIFICAR CONFIGURAÇÃO
-- ============================================

-- Verificar se RLS está habilitado
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Se rowsecurity = false, habilitar:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verificar políticas criadas
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
-- 6. COMENTÁRIOS
-- ============================================

-- A função handle_new_user() usa SECURITY DEFINER, o que significa
-- que ela executa com privilégios elevados e pode inserir na tabela
-- profiles mesmo com RLS habilitado. O trigger é executado automaticamente
-- quando um novo usuário é criado em auth.users.

