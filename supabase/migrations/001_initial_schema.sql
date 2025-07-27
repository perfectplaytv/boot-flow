-- =====================================================
-- MIGRAÇÃO INICIAL - SCHEMA BOOTFLOW
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: users (Usuários/Clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    m3u_url TEXT,
    bouquets TEXT,
    expiration_date TIMESTAMP WITH TIME ZONE,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para a tabela users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_expiration_date ON public.users(expiration_date);

-- =====================================================
-- TABELA: resellers (Revendedores)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.resellers (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    permission TEXT DEFAULT 'reseller',
    credits INTEGER DEFAULT 0,
    personal_name TEXT,
    status TEXT DEFAULT 'Ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    force_password_change TEXT,
    servers TEXT,
    master_reseller TEXT,
    disable_login_days INTEGER DEFAULT 0,
    monthly_reseller BOOLEAN DEFAULT false,
    telegram TEXT,
    whatsapp TEXT,
    observations TEXT
);

-- Índices para a tabela resellers
CREATE INDEX IF NOT EXISTS idx_resellers_email ON public.resellers(email);
CREATE INDEX IF NOT EXISTS idx_resellers_username ON public.resellers(username);
CREATE INDEX IF NOT EXISTS idx_resellers_status ON public.resellers(status);
CREATE INDEX IF NOT EXISTS idx_resellers_created_at ON public.resellers(created_at);

-- =====================================================
-- TABELA: cobrancas (Cobranças)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cobrancas (
    id BIGSERIAL PRIMARY KEY,
    cliente TEXT NOT NULL,
    email TEXT,
    descricao TEXT,
    valor DECIMAL(10,2),
    vencimento TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Pendente',
    tipo TEXT,
    gateway TEXT,
    formapagamento TEXT,
    tentativas INTEGER DEFAULT 0,
    ultimatentativa TIMESTAMP WITH TIME ZONE,
    proximatentativa TIMESTAMP WITH TIME ZONE,
    observacoes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para a tabela cobrancas
CREATE INDEX IF NOT EXISTS idx_cobrancas_cliente ON public.cobrancas(cliente);
CREATE INDEX IF NOT EXISTS idx_cobrancas_email ON public.cobrancas(email);
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON public.cobrancas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_vencimento ON public.cobrancas(vencimento);
CREATE INDEX IF NOT EXISTS idx_cobrancas_created_at ON public.cobrancas(created_at);

-- =====================================================
-- TABELA: auth_users (Usuários de Autenticação)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.auth_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'user',
    profile_completed BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para a tabela auth_users
CREATE INDEX IF NOT EXISTS idx_auth_users_role ON public.auth_users(role);
CREATE INDEX IF NOT EXISTS idx_auth_users_last_login ON public.auth_users(last_login);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resellers_updated_at 
    BEFORE UPDATE ON public.resellers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cobrancas_updated_at 
    BEFORE UPDATE ON public.cobrancas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auth_users_updated_at 
    BEFORE UPDATE ON public.auth_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA CRIAR USUÁRIO DE AUTENTICAÇÃO AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.auth_users (id, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'role', 'user'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar registro em auth_users quando um usuário se registra
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para estatísticas de usuários
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN expiration_date > NOW() THEN 1 END) as active_users,
    COUNT(CASE WHEN expiration_date <= NOW() THEN 1 END) as expired_users,
    COUNT(CASE WHEN expiration_date IS NULL THEN 1 END) as users_without_expiration
FROM public.users;

-- View para estatísticas de cobranças
CREATE OR REPLACE VIEW public.charge_stats AS
SELECT 
    COUNT(*) as total_charges,
    COUNT(CASE WHEN status = 'Pago' THEN 1 END) as paid_charges,
    COUNT(CASE WHEN status = 'Pendente' THEN 1 END) as pending_charges,
    COUNT(CASE WHEN status = 'Vencido' THEN 1 END) as overdue_charges,
    SUM(CASE WHEN status = 'Pago' THEN valor ELSE 0 END) as total_paid_amount,
    SUM(CASE WHEN status = 'Pendente' THEN valor ELSE 0 END) as total_pending_amount
FROM public.cobrancas; 