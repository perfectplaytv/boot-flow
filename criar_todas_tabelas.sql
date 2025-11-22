-- ============================================
-- SCRIPT COMPLETO: TODAS AS TABELAS NECESSÁRIAS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- NOTE: This script targets PostgreSQL (Supabase). Do not run on
-- Microsoft SQL Server or other non-Postgres engines.

-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- ============================================
-- 1. TABELA: users (Clientes)
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  server VARCHAR(100),
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('Mensal', 'Trimestral', 'Semestral', 'Anual')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Suspenso', 'Pendente')),
  expiration_date DATE NOT NULL,
  devices INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 0,
  password VARCHAR(255),
  bouquets TEXT,
  real_name VARCHAR(255),
  whatsapp VARCHAR(20),
  telegram VARCHAR(100),
  observations TEXT,
  notes TEXT,
  m3u_url TEXT,
  renewal_date DATE,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

-- ============================================
-- 2. TABELA: resellers (Revendas)
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_resellers_email ON public.resellers(email);
CREATE INDEX IF NOT EXISTS idx_resellers_username ON public.resellers(username);
CREATE INDEX IF NOT EXISTS idx_resellers_status ON public.resellers(status);

-- ============================================
-- 3. TABELA: cobrancas (Cobranças)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cobrancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id VARCHAR(255),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cobrancas_cliente_id ON public.cobrancas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON public.cobrancas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_data_vencimento ON public.cobrancas(data_vencimento);

-- ============================================
-- 4. VIEWS: clientes e revendas (para compatibilidade)
-- ============================================
CREATE OR REPLACE VIEW public.clientes AS SELECT * FROM public.users;
CREATE OR REPLACE VIEW public.revendas AS SELECT * FROM public.resellers;

-- ============================================
-- 5. FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_resellers ON public.resellers;
CREATE TRIGGER set_updated_at_resellers
  BEFORE UPDATE ON public.resellers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_cobrancas ON public.cobrancas;
CREATE TRIGGER set_updated_at_cobrancas
  BEFORE UPDATE ON public.cobrancas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. CONFIGURAR RLS (Row Level Security)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. POLÍTICAS RLS PARA users
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
-- 8. POLÍTICAS RLS PARA resellers
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

-- Permitir inserção por service role (usando checagem via auth.role())
DROP POLICY IF EXISTS "Enable insert for service role resellers" ON public.resellers;
CREATE POLICY "Enable insert for service role resellers"
  ON public.resellers FOR INSERT
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Resellers can update all"
  ON public.resellers FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Resellers can delete all"
  ON public.resellers FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- 9. POLÍTICAS RLS PARA cobrancas
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
-- FIM DO SCRIPT
-- ============================================

