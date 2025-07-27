-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - BOOTFLOW
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
-- POLÍTICAS PARA VIEWS
-- =====================================================

-- Política para view user_stats (apenas admins)
CREATE POLICY "Admins can view user stats" ON public.user_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Política para view charge_stats (apenas admins)
CREATE POLICY "Admins can view charge stats" ON public.charge_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.auth_users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    ); 