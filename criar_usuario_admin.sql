-- ============================================
-- CRIAR USUÁRIO ADMIN NO SUPABASE
-- ============================================
-- 
-- Execute este script no SQL Editor do Supabase
-- Substitua os valores abaixo pelos seus dados:
--   - 'admin@exemplo.com' → seu email
--   - 'senha123456' → sua senha (mínimo 8 caracteres)
--   - 'Nome do Admin' → seu nome completo
--
-- ============================================

-- IMPORTANTE: Execute este script em duas etapas:

-- ETAPA 1: Criar usuário na tabela auth.users
-- Substitua os valores abaixo pelos seus dados:
DO $$
DECLARE
  new_user_id UUID;
  user_email TEXT := 'admin@exemplo.com';  -- ALTERE AQUI
  user_password TEXT := 'senha123456';       -- ALTERE AQUI
  user_full_name TEXT := 'Nome do Admin';    -- ALTERE AQUI
BEGIN
  -- Criar usuário usando a função do Supabase
  -- NOTA: Não podemos criar usuário diretamente via SQL por questões de segurança
  -- Você precisa criar via Dashboard ou API
  
  RAISE NOTICE 'Para criar o usuário, use uma das opções abaixo:';
  RAISE NOTICE '1. Via Dashboard: Authentication > Users > Add User';
  RAISE NOTICE '2. Via API REST (veja instruções no final do arquivo)';
  RAISE NOTICE '3. Via página de cadastro da aplicação (/cadastro)';
END $$;

-- ============================================
-- ETAPA 2: Após criar o usuário, execute este SQL
-- para torná-lo admin e criar o profile
-- ============================================

-- Substitua 'admin@exemplo.com' pelo email que você usou ao criar o usuário
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Nome do Admin'  -- ALTERE AQUI
WHERE email = 'admin@exemplo.com';  -- ALTERE AQUI

-- Verificar se o profile foi atualizado
SELECT 
  id,
  email,
  role,
  full_name,
  created_at
FROM public.profiles
WHERE email = 'admin@exemplo.com';  -- ALTERE AQUI

-- ============================================
-- ALTERNATIVA: Criar usuário via API REST
-- ============================================
--
-- Você pode criar o usuário usando uma requisição HTTP:
--
-- POST https://mnjivyaztsgxaqihrqec.supabase.co/auth/v1/admin/users
-- Headers:
--   Authorization: Bearer SEU_SERVICE_ROLE_KEY
--   Content-Type: application/json
-- Body:
-- {
--   "email": "admin@exemplo.com",
--   "password": "senha123456",
--   "email_confirm": true,
--   "user_metadata": {
--     "role": "admin",
--     "full_name": "Nome do Admin"
--   }
-- }
--
-- IMPORTANTE: Use a SERVICE_ROLE_KEY (não a ANON_KEY)
-- Você encontra em: Settings > API > service_role (secret)

-- ============================================
-- MÉTODO RECOMENDADO: Via Dashboard do Supabase
-- ============================================
--
-- 1. Acesse: https://app.supabase.com
-- 2. Selecione seu projeto: mnjivyaztsgxaqihrqec
-- 3. Vá em: Authentication > Users > Add User
-- 4. Preencha:
--    - Email: admin@exemplo.com (ou seu email)
--    - Password: uma senha segura (mínimo 8 caracteres)
--    - Auto Confirm User: ✅ (MARQUE ESTA OPÇÃO)
--    - User Metadata (JSON):
--      {
--        "role": "admin",
--        "full_name": "Nome do Admin"
--      }
-- 5. Clique em "Create User"
-- 6. Pronto! O profile será criado automaticamente pelo trigger

-- ============================================
-- Verificar se tudo está funcionando
-- ============================================

-- Ver todos os usuários e seus perfis
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

