-- ============================================
-- ATUALIZAR POLÍTICAS RLS (Remove e Recria)
-- ============================================
-- Execute este script se receber erro de "policy already exists"

-- ============================================
-- 1. POLÍTICAS RLS PARA users
-- ============================================
DROP POLICY IF EXISTS "Users can view all" ON public.users;
DROP POLICY IF EXISTS "Users can insert all" ON public.users;
DROP POLICY IF EXISTS "Users can update all" ON public.users;
DROP POLICY IF EXISTS "Users can delete all" ON public.users;

CREATE POLICY "Users can view all"
  ON public.users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert all"
  ON public.users FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update all"
  ON public.users FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete all"
  ON public.users FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 2. POLÍTICAS RLS PARA resellers
-- ============================================
DROP POLICY IF EXISTS "Resellers can view all" ON public.resellers;
DROP POLICY IF EXISTS "Resellers can insert all" ON public.resellers;
DROP POLICY IF EXISTS "Resellers can update all" ON public.resellers;
DROP POLICY IF EXISTS "Resellers can delete all" ON public.resellers;

CREATE POLICY "Resellers can view all"
  ON public.resellers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Resellers can insert all"
  ON public.resellers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Resellers can update all"
  ON public.resellers FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Resellers can delete all"
  ON public.resellers FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 3. POLÍTICAS RLS PARA cobrancas
-- ============================================
DROP POLICY IF EXISTS "Cobrancas can view all" ON public.cobrancas;
DROP POLICY IF EXISTS "Cobrancas can insert all" ON public.cobrancas;
DROP POLICY IF EXISTS "Cobrancas can update all" ON public.cobrancas;
DROP POLICY IF EXISTS "Cobrancas can delete all" ON public.cobrancas;

CREATE POLICY "Cobrancas can view all"
  ON public.cobrancas FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Cobrancas can insert all"
  ON public.cobrancas FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cobrancas can update all"
  ON public.cobrancas FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Cobrancas can delete all"
  ON public.cobrancas FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 4. VERIFICAR SE RLS ESTÁ HABILITADO
-- ============================================
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'resellers', 'cobrancas');

-- ============================================
-- 5. VERIFICAR POLÍTICAS CRIADAS
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'resellers', 'cobrancas')
ORDER BY tablename, policyname;

