-- ============================================
-- SCRIPT PARA LISTAR TODOS OS ADMINS
-- ============================================
-- Execute este script para ver todos os administradores do sistema
-- ============================================

-- Lista completa de admins com informações detalhadas
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.avatar_url,
  p.created_at as perfil_criado_em,
  p.updated_at as perfil_atualizado_em,
  u.email_confirmed_at as email_confirmado_em,
  u.last_sign_in_at as ultimo_login_em,
  u.created_at as usuario_criado_em,
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN 'Nunca logou'
    WHEN u.last_sign_in_at < NOW() - INTERVAL '30 days' THEN 'Inativo há mais de 30 dias'
    WHEN u.last_sign_in_at < NOW() - INTERVAL '7 days' THEN 'Inativo há mais de 7 dias'
    ELSE 'Ativo'
  END as status,
  EXTRACT(EPOCH FROM (NOW() - u.last_sign_in_at)) / 86400 as dias_desde_ultimo_login
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
ORDER BY 
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN 0
    ELSE 1
  END,
  u.last_sign_in_at DESC NULLS LAST;

-- ============================================
-- ESTATÍSTICAS DOS ADMINS
-- ============================================

-- Contagem geral
SELECT 
  COUNT(*) as total_admins,
  COUNT(CASE WHEN u.email_confirmed_at IS NOT NULL THEN 1 END) as admins_com_email_confirmado,
  COUNT(CASE WHEN u.last_sign_in_at IS NOT NULL THEN 1 END) as admins_com_login,
  COUNT(CASE WHEN u.last_sign_in_at >= NOW() - INTERVAL '7 days' THEN 1 END) as admins_ativos_7_dias,
  COUNT(CASE WHEN u.last_sign_in_at >= NOW() - INTERVAL '30 days' THEN 1 END) as admins_ativos_30_dias,
  COUNT(CASE WHEN u.last_sign_in_at IS NULL THEN 1 END) as admins_nunca_logaram
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';

-- ============================================
-- ADMINS INATIVOS
-- ============================================

-- Listar admins que não fizeram login há mais de 30 dias
SELECT 
  p.email,
  p.full_name,
  u.last_sign_in_at,
  EXTRACT(EPOCH FROM (NOW() - u.last_sign_in_at)) / 86400 as dias_inativo
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
AND (
  u.last_sign_in_at IS NULL 
  OR u.last_sign_in_at < NOW() - INTERVAL '30 days'
)
ORDER BY u.last_sign_in_at DESC NULLS LAST;

-- ============================================
-- ADMINS RECÉM CRIADOS
-- ============================================

-- Listar admins criados nos últimos 7 dias
SELECT 
  p.email,
  p.full_name,
  p.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
AND p.created_at >= NOW() - INTERVAL '7 days'
ORDER BY p.created_at DESC;

-- ============================================
-- VERIFICAR DUPLICATAS
-- ============================================

-- Verificar se há emails duplicados
SELECT 
  email,
  COUNT(*) as quantidade,
  STRING_AGG(id::text, ', ') as ids
FROM public.profiles
WHERE role = 'admin'
GROUP BY email
HAVING COUNT(*) > 1;

-- ============================================
-- VERIFICAR USUÁRIOS SEM PERFIL
-- ============================================

-- Verificar se há usuários na auth.users que não têm perfil
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.raw_user_meta_data->>'role' as role_metadata,
  u.raw_user_meta_data->>'full_name' as nome_metadata
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
AND u.raw_user_meta_data->>'role' = 'admin';

-- ============================================
-- FIM DO SCRIPT
-- ============================================

