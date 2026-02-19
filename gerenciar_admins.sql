-- ============================================
-- SCRIPT PARA GERENCIAR ADMINS
-- ============================================
-- Este script contém funções úteis para gerenciar administradores
-- ============================================

-- ============================================
-- 1. TORNAR UM USUÁRIO ADMIN
-- ============================================

-- Tornar um usuário específico admin
UPDATE public.profiles
SET 
  role = 'admin',
  updated_at = NOW()
WHERE email = 'usuario@exemplo.com';  -- ALTERE AQUI

-- Verificar se foi atualizado
SELECT email, role, full_name 
FROM public.profiles 
WHERE email = 'usuario@exemplo.com';

-- ============================================
-- 2. REMOVER ROLE DE ADMIN (Tornar Client)
-- ============================================

-- Remover role de admin de um usuário específico
UPDATE public.profiles
SET 
  role = 'client',
  updated_at = NOW()
WHERE email = 'admin@exemplo.com';  -- ALTERE AQUI

-- Verificar se foi atualizado
SELECT email, role, full_name 
FROM public.profiles 
WHERE email = 'admin@exemplo.com';

-- ============================================
-- 3. ATUALIZAR NOME DE UM ADMIN
-- ============================================

-- Atualizar nome completo de um admin
UPDATE public.profiles
SET 
  full_name = 'Novo Nome do Admin',  -- ALTERE AQUI
  updated_at = NOW()
WHERE email = 'admin@exemplo.com';  -- ALTERE AQUI

-- Verificar se foi atualizado
SELECT email, role, full_name, updated_at
FROM public.profiles 
WHERE email = 'admin@exemplo.com';

-- ============================================
-- 4. CRIAR PERFIL PARA USUÁRIO EXISTENTE
-- ============================================

-- Se um usuário foi criado mas o perfil não foi criado automaticamente
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'role', 'client')::text,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    SPLIT_PART(u.email, '@', 1)
  )
FROM auth.users u
WHERE u.email = 'usuario@exemplo.com'  -- ALTERE AQUI
AND NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- ============================================
-- 5. TORNAR MÚLTIPLOS USUÁRIOS ADMIN DE UMA VEZ
-- ============================================

-- Atualizar múltiplos usuários para admin
UPDATE public.profiles
SET 
  role = 'admin',
  updated_at = NOW()
WHERE email IN (
  'usuario1@exemplo.com',
  'usuario2@exemplo.com',
  'usuario3@exemplo.com'
  -- Adicione mais emails aqui
);

-- Verificar atualização
SELECT email, role, full_name, updated_at
FROM public.profiles
WHERE email IN (
  'usuario1@exemplo.com',
  'usuario2@exemplo.com',
  'usuario3@exemplo.com'
)
ORDER BY email;

-- ============================================
-- 6. REMOVER TODOS OS ADMINS (CUIDADO!)
-- ============================================

-- ⚠️ ATENÇÃO: Isso remove o role de admin de TODOS os usuários!
-- Use apenas se tiver certeza do que está fazendo

/*
UPDATE public.profiles
SET 
  role = 'client',
  updated_at = NOW()
WHERE role = 'admin';
*/

-- ============================================
-- 7. LIMPAR PERFIS DUPLICADOS
-- ============================================

-- Encontrar perfis duplicados
SELECT email, COUNT(*) as quantidade
FROM public.profiles
WHERE role = 'admin'
GROUP BY email
HAVING COUNT(*) > 1;

-- Remover duplicatas (manter apenas o mais recente)
DELETE FROM public.profiles p1
WHERE EXISTS (
  SELECT 1 FROM public.profiles p2
  WHERE p2.email = p1.email
  AND p2.id != p1.id
  AND p2.created_at > p1.created_at
)
AND p1.role = 'admin';

-- ============================================
-- 8. VERIFICAR INTEGRIDADE DOS ADMINS
-- ============================================

-- Verificar se todos os admins têm usuário correspondente
SELECT 
  p.email,
  p.role,
  CASE 
    WHEN u.id IS NULL THEN 'Usuário não encontrado em auth.users'
    WHEN u.email_confirmed_at IS NULL THEN 'Email não confirmado'
    ELSE 'OK'
  END as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
ORDER BY status, p.email;

-- ============================================
-- 9. ESTATÍSTICAS DE ATIVIDADE DOS ADMINS
-- ============================================

-- Resumo de atividade dos admins
SELECT 
  COUNT(*) as total_admins,
  COUNT(CASE WHEN u.email_confirmed_at IS NOT NULL THEN 1 END) as confirmados,
  COUNT(CASE WHEN u.last_sign_in_at IS NOT NULL THEN 1 END) as com_login,
  COUNT(CASE WHEN u.last_sign_in_at >= NOW() - INTERVAL '7 days' THEN 1 END) as ativos_7_dias,
  COUNT(CASE WHEN u.last_sign_in_at >= NOW() - INTERVAL '30 days' THEN 1 END) as ativos_30_dias,
  COUNT(CASE WHEN u.last_sign_in_at IS NULL THEN 1 END) as nunca_logaram,
  ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - u.last_sign_in_at)) / 86400), 2) as media_dias_inativo
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- ============================================
-- FIM DO SCRIPT
-- ============================================

