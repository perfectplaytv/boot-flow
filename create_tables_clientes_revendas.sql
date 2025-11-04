-- ============================================
-- Script SQL para criar tabelas no Supabase
-- Clientes (users) e Revendas (resellers)
-- ============================================

-- ============================================
-- OBSERVAÇÃO IMPORTANTE:
-- O código usa tanto 'users' quanto 'clientes' para se referir a clientes.
-- Este script cria a tabela 'users' que é usada pelo hook useClientes.
-- Se você precisar da tabela 'clientes' separada, veja o final do script.
-- ============================================

-- ============================================
-- TABELA: users (Clientes)
-- ============================================

-- Remove a tabela se já existir (CUIDADO: Isso apaga todos os dados!)
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Cria a tabela users (clientes)
-- Campos baseados no formulário de cadastro de clientes
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  -- Informações Básicas (obrigatórias *)
  server VARCHAR(100),
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('Mensal', 'Trimestral', 'Semestral', 'Anual')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Suspenso', 'Pendente')),
  expiration_date DATE NOT NULL,
  -- Configuração de Serviço
  devices INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 0,
  password VARCHAR(255),
  bouquets TEXT,
  -- Informações Adicionais
  real_name VARCHAR(255),
  whatsapp VARCHAR(20),
  telegram VARCHAR(100),
  observations TEXT,
  notes TEXT,
  -- Extração M3U
  m3u_url TEXT,
  -- Outros campos
  renewal_date DATE,
  phone VARCHAR(20),
  -- Timestamps automáticos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cria índice para melhor performance em buscas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Cria índice para melhor performance em buscas por status
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- Cria trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplica o trigger à tabela users
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: resellers (Revendas)
-- ============================================

-- Remove a tabela se já existir (CUIDADO: Isso apaga todos os dados!)
-- DROP TABLE IF EXISTS public.resellers CASCADE;

-- Cria a tabela resellers (revendas)
CREATE TABLE IF NOT EXISTS public.resellers (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  permission VARCHAR(50) DEFAULT 'reseller',
  credits INTEGER DEFAULT 10,
  personal_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Ativo',
  force_password_change BOOLEAN DEFAULT false,
  servers TEXT,
  master_reseller VARCHAR(100),
  disable_login_days INTEGER DEFAULT 0,
  monthly_reseller BOOLEAN DEFAULT false,
  telegram VARCHAR(100),
  whatsapp VARCHAR(20),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cria índice para melhor performance em buscas por email
CREATE INDEX IF NOT EXISTS idx_resellers_email ON public.resellers(email);

-- Cria índice para melhor performance em buscas por username
CREATE INDEX IF NOT EXISTS idx_resellers_username ON public.resellers(username);

-- Cria índice para melhor performance em buscas por status
CREATE INDEX IF NOT EXISTS idx_resellers_status ON public.resellers(status);

-- Aplica o trigger à tabela resellers
DROP TRIGGER IF EXISTS set_updated_at_resellers ON public.resellers;
CREATE TRIGGER set_updated_at_resellers
  BEFORE UPDATE ON public.resellers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CONFIGURAÇÃO RLS (Row Level Security)
-- ============================================

-- Habilita RLS nas tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS PARA TABELA users
-- ============================================

-- Remove políticas existentes se houver
DROP POLICY IF EXISTS "Users can view all" ON public.users;
DROP POLICY IF EXISTS "Users can insert all" ON public.users;
DROP POLICY IF EXISTS "Users can update all" ON public.users;
DROP POLICY IF EXISTS "Users can delete all" ON public.users;

-- Política para SELECT: Usuários autenticados podem ver todos os clientes
CREATE POLICY "Users can view all"
  ON public.users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política para INSERT: Usuários autenticados podem inserir clientes
CREATE POLICY "Users can insert all"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE: Usuários autenticados podem atualizar clientes
CREATE POLICY "Users can update all"
  ON public.users
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política para DELETE: Usuários autenticados podem deletar clientes
CREATE POLICY "Users can delete all"
  ON public.users
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- POLÍTICAS RLS PARA TABELA resellers
-- ============================================

-- Remove políticas existentes se houver
DROP POLICY IF EXISTS "Resellers can view all" ON public.resellers;
DROP POLICY IF EXISTS "Resellers can insert all" ON public.resellers;
DROP POLICY IF EXISTS "Resellers can update all" ON public.resellers;
DROP POLICY IF EXISTS "Resellers can delete all" ON public.resellers;

-- Política para SELECT: Usuários autenticados podem ver todos os revendedores
CREATE POLICY "Resellers can view all"
  ON public.resellers
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política para INSERT: Usuários autenticados podem inserir revendedores
CREATE POLICY "Resellers can insert all"
  ON public.resellers
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE: Usuários autenticados podem atualizar revendedores
CREATE POLICY "Resellers can update all"
  ON public.resellers
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política para DELETE: Usuários autenticados podem deletar revendedores
CREATE POLICY "Resellers can delete all"
  ON public.resellers
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- COMENTÁRIOS NAS TABELAS E COLUNAS
-- ============================================

COMMENT ON TABLE public.users IS 'Tabela de clientes/usuários do sistema';
COMMENT ON COLUMN public.users.name IS 'Nome do cliente';
COMMENT ON COLUMN public.users.email IS 'E-mail único do cliente';
COMMENT ON COLUMN public.users.status IS 'Status do cliente: Ativo, Inativo, Suspenso, etc.';
COMMENT ON COLUMN public.users.expiration_date IS 'Data de expiração do serviço';
COMMENT ON COLUMN public.users.plan IS 'Plano contratado pelo cliente';
COMMENT ON COLUMN public.users.credits IS 'Créditos disponíveis do cliente';
COMMENT ON COLUMN public.users.devices IS 'Número de dispositivos permitidos';

COMMENT ON TABLE public.resellers IS 'Tabela de revendedores do sistema';
COMMENT ON COLUMN public.resellers.username IS 'Nome de usuário único do revendedor';
COMMENT ON COLUMN public.resellers.email IS 'E-mail único do revendedor';
COMMENT ON COLUMN public.resellers.permission IS 'Nível de permissão do revendedor';
COMMENT ON COLUMN public.resellers.credits IS 'Créditos disponíveis do revendedor';
COMMENT ON COLUMN public.resellers.status IS 'Status do revendedor: Ativo, Inativo, Suspenso, etc.';
COMMENT ON COLUMN public.resellers.master_reseller IS 'Revendedor master associado';
COMMENT ON COLUMN public.resellers.monthly_reseller IS 'Indica se é um revendedor mensal';

-- ============================================
-- OPCIONAL: Criar tabela 'clientes' separada
-- ============================================
-- Se o código também precisa da tabela 'clientes' separada (usada por useRealtimeClientes),
-- execute também o script: create_table_clientes.sql
-- 
-- Ou crie uma VIEW que aponta para 'users':
-- CREATE OR REPLACE VIEW public.clientes AS SELECT * FROM public.users;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

