-- =====================================================
-- SCHEMA DO SUPABASE PARA O PROJETO BOOTFLOW
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
-- TABELA: auth_users (Usuários de Autenticação - Extensão da auth.users do Supabase)
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
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA TABELA users
-- =====================================================

-- Política: Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid()::text = email);

-- Política: Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem inserir usuários
CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem atualizar usuários
CREATE POLICY "Admins can update users" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem deletar usuários
CREATE POLICY "Admins can delete users" ON public.users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS PARA TABELA resellers
-- =====================================================

-- Política: Revendedores podem ver apenas seus próprios dados
CREATE POLICY "Resellers can view own data" ON public.resellers
    FOR SELECT USING (auth.uid()::text = email);

-- Política: Admins podem ver todos os revendedores
CREATE POLICY "Admins can view all resellers" ON public.resellers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem gerenciar revendedores
CREATE POLICY "Admins can manage resellers" ON public.resellers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS PARA TABELA cobrancas
-- =====================================================

-- Política: Usuários podem ver cobranças relacionadas ao seu email
CREATE POLICY "Users can view own charges" ON public.cobrancas
    FOR SELECT USING (auth.uid()::text = email);

-- Política: Admins podem ver todas as cobranças
CREATE POLICY "Admins can view all charges" ON public.cobrancas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem gerenciar cobranças
CREATE POLICY "Admins can manage charges" ON public.cobrancas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS PARA TABELA auth_users
-- =====================================================

-- Política: Usuários podem ver apenas seus próprios dados de autenticação
CREATE POLICY "Users can view own auth data" ON public.auth_users
    FOR SELECT USING (id = auth.uid());

-- Política: Admins podem ver todos os dados de autenticação
CREATE POLICY "Admins can view all auth data" ON public.auth_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política: Admins podem gerenciar dados de autenticação
CREATE POLICY "Admins can manage auth data" ON public.auth_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir usuário admin padrão (senha: admin123)
-- NOTA: Este usuário deve ser criado através da interface de autenticação do Supabase
-- e depois ter seu papel alterado para 'admin' na tabela auth_users

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

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para buscar usuários por status
CREATE OR REPLACE FUNCTION public.get_users_by_status(user_status TEXT)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    email TEXT,
    expiration_date TIMESTAMP WITH TIME ZONE,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.name,
        u.email,
        u.expiration_date,
        CASE 
            WHEN u.expiration_date > NOW() THEN 'Ativo'
            WHEN u.expiration_date <= NOW() THEN 'Expirado'
            ELSE 'Sem Expiração'
        END as status
    FROM public.users u
    WHERE CASE 
        WHEN user_status = 'Ativo' THEN u.expiration_date > NOW()
        WHEN user_status = 'Expirado' THEN u.expiration_date <= NOW()
        WHEN user_status = 'Sem Expiração' THEN u.expiration_date IS NULL
        ELSE true
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para buscar cobranças por período
CREATE OR REPLACE FUNCTION public.get_charges_by_period(start_date DATE, end_date DATE)
RETURNS TABLE (
    id BIGINT,
    cliente TEXT,
    valor DECIMAL(10,2),
    status TEXT,
    vencimento TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.cliente,
        c.valor,
        c.status,
        c.vencimento
    FROM public.cobrancas c
    WHERE DATE(c.vencimento) BETWEEN start_date AND end_date
    ORDER BY c.vencimento;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE public.users IS 'Tabela de usuários/clientes do sistema';
COMMENT ON TABLE public.resellers IS 'Tabela de revendedores do sistema';
COMMENT ON TABLE public.cobrancas IS 'Tabela de cobranças do sistema';
COMMENT ON TABLE public.auth_users IS 'Extensão da tabela auth.users do Supabase com roles personalizados';

COMMENT ON COLUMN public.users.id IS 'ID único do usuário';
COMMENT ON COLUMN public.users.name IS 'Nome completo do usuário';
COMMENT ON COLUMN public.users.email IS 'Email único do usuário';
COMMENT ON COLUMN public.users.password IS 'Senha do usuário (hash)';
COMMENT ON COLUMN public.users.m3u_url IS 'URL da playlist M3U do usuário';
COMMENT ON COLUMN public.users.bouquets IS 'Pacotes/bouquets do usuário';
COMMENT ON COLUMN public.users.expiration_date IS 'Data de expiração da conta';
COMMENT ON COLUMN public.users.observations IS 'Observações sobre o usuário';

COMMENT ON COLUMN public.resellers.id IS 'ID único do revendedor';
COMMENT ON COLUMN public.resellers.username IS 'Nome de usuário único do revendedor';
COMMENT ON COLUMN public.resellers.email IS 'Email único do revendedor';
COMMENT ON COLUMN public.resellers.permission IS 'Nível de permissão do revendedor';
COMMENT ON COLUMN public.resellers.credits IS 'Créditos disponíveis do revendedor';
COMMENT ON COLUMN public.resellers.status IS 'Status do revendedor (Ativo/Inativo)';

COMMENT ON COLUMN public.cobrancas.id IS 'ID único da cobrança';
COMMENT ON COLUMN public.cobrancas.cliente IS 'Nome do cliente';
COMMENT ON COLUMN public.cobrancas.valor IS 'Valor da cobrança';
COMMENT ON COLUMN public.cobrancas.status IS 'Status da cobrança (Pendente/Pago/Vencido)';
COMMENT ON COLUMN public.cobrancas.vencimento IS 'Data de vencimento da cobrança';
COMMENT ON COLUMN public.cobrancas.gateway IS 'Gateway de pagamento utilizado';
COMMENT ON COLUMN public.cobrancas.tentativas IS 'Número de tentativas de cobrança';

-- =====================================================
-- FIM DO SCHEMA
-- ===================================================== 