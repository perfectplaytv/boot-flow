-- ============================================
-- SCRIPT PARA CRIAR MÚLTIPLOS ADMINS
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Primeiro, crie os usuários via Dashboard do Supabase:
--    - Authentication > Users > Add User
--    - Para cada admin, preencha email, senha e marque "Auto Confirm User"
--    - Adicione User Metadata: {"role":"admin","full_name":"Nome do Admin"}
--
-- 2. Depois, execute este script para atualizar os perfis
--    (ou se os perfis já foram criados automaticamente, este script garante que estão como admin)
--
-- 3. Substitua os valores abaixo pelos dados reais dos seus admins
--
-- ============================================

-- ============================================
-- CONFIGURAÇÃO DOS ADMINS
-- ============================================
-- Edite a lista abaixo com os emails e nomes dos seus admins

-- Admin 1
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = COALESCE(full_name, 'Admin 1'),
  updated_at = NOW()
WHERE email = 'admin1@exemplo.com';  -- ALTERE AQUI

-- Admin 2
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = COALESCE(full_name, 'Admin 2'),
  updated_at = NOW()
WHERE email = 'admin2@exemplo.com';  -- ALTERE AQUI

-- Admin 3
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = COALESCE(full_name, 'Admin 3'),
  updated_at = NOW()
WHERE email = 'admin3@exemplo.com';  -- ALTERE AQUI

-- Adicione mais admins conforme necessário...
-- Copie e cole o bloco acima, alterando o email e nome

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Listar todos os admins criados
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.created_at,
  p.updated_at,
  u.email_confirmed_at,
  u.last_sign_in_at,
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN 'Nunca logou'
    WHEN u.last_sign_in_at < NOW() - INTERVAL '30 days' THEN 'Inativo'
    ELSE 'Ativo'
  END as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
ORDER BY p.created_at DESC;

-- Contar total de admins
SELECT 
  COUNT(*) as total_admins,
  COUNT(CASE WHEN u.email_confirmed_at IS NOT NULL THEN 1 END) as confirmados,
  COUNT(CASE WHEN u.last_sign_in_at IS NOT NULL THEN 1 END) as com_login
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- ============================================
-- ALTERNATIVA: Atualizar múltiplos de uma vez
-- ============================================
-- Use este método se você tem uma lista de emails

/*
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = CASE email
    WHEN 'admin1@exemplo.com' THEN 'Nome do Admin 1'
    WHEN 'admin2@exemplo.com' THEN 'Nome do Admin 2'
    WHEN 'admin3@exemplo.com' THEN 'Nome do Admin 3'
    ELSE full_name
  END,
  updated_at = NOW()
WHERE email IN (
  'admin1@exemplo.com',
  'admin2@exemplo.com',
  'admin3@exemplo.com'
  -- Adicione mais emails aqui
);
*/

-- ============================================
-- CRIAR PERFIS PARA USUÁRIOS QUE NÃO TÊM PERFIL
-- ============================================
-- Execute este bloco se algum usuário foi criado mas o perfil não foi criado automaticamente

/*
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  u.id,
  u.email,
  'admin',
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    SPLIT_PART(u.email, '@', 1)
  )
FROM auth.users u
WHERE u.email IN (
  'admin1@exemplo.com',
  'admin2@exemplo.com',
  'admin3@exemplo.com'
  -- Adicione mais emails aqui
)
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
*/

-- ============================================
-- FIM DO SCRIPT
-- ============================================

