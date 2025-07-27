-- =====================================================
-- DADOS DE EXEMPLO - BOOTFLOW
-- =====================================================

-- Inserir usuários de exemplo
INSERT INTO public.users (name, email, password, m3u_url, bouquets, expiration_date, observations) VALUES
('João Silva', 'joao@example.com', 'password123', 'http://example.com/playlist1.m3u', 'Premium, Sports', '2024-12-31 23:59:59+00', 'Cliente fiel, sempre pontual'),
('Maria Santos', 'maria@example.com', 'password123', 'http://example.com/playlist2.m3u', 'Basic, Movies', '2024-11-30 23:59:59+00', 'Cliente nova, muito ativa'),
('Pedro Costa', 'pedro@example.com', 'password123', 'http://example.com/playlist3.m3u', 'Premium, Kids', '2024-10-31 23:59:59+00', 'Cliente experiente'),
('Ana Oliveira', 'ana@example.com', 'password123', 'http://example.com/playlist4.m3u', 'Basic', '2024-09-30 23:59:59+00', 'Cliente satisfeita'),
('Carlos Ferreira', 'carlos@example.com', 'password123', 'http://example.com/playlist5.m3u', 'Premium, Sports, Movies', '2024-08-31 23:59:59+00', 'Cliente VIP');

-- Inserir revendedores de exemplo
INSERT INTO public.resellers (username, email, password, permission, credits, personal_name, status, telegram, whatsapp, observations) VALUES
('revendedor1', 'rev1@example.com', 'password123', 'reseller', 1000, 'Revendedor Principal', 'Ativo', '@revendedor1', '+5511999999999', 'Revendedor principal da região'),
('revendedor2', 'rev2@example.com', 'password123', 'reseller', 500, 'Revendedor Secundário', 'Ativo', '@revendedor2', '+5511888888888', 'Revendedor secundário'),
('revendedor3', 'rev3@example.com', 'password123', 'reseller', 750, 'Revendedor Terciário', 'Ativo', '@revendedor3', '+5511777777777', 'Revendedor terciário'),
('master_rev', 'master@example.com', 'password123', 'master', 2000, 'Revendedor Mestre', 'Ativo', '@master_rev', '+5511666666666', 'Revendedor mestre com privilégios especiais');

-- Inserir cobranças de exemplo
INSERT INTO public.cobrancas (cliente, email, descricao, valor, vencimento, status, tipo, gateway, formapagamento, tentativas, observacoes, tags) VALUES
('João Silva', 'joao@example.com', 'Mensalidade Premium', 29.90, '2024-01-15 23:59:59+00', 'Pago', 'Mensal', 'Pix', 'Pix', 1, 'Pagamento realizado no prazo', ARRAY['premium', 'mensal']),
('Maria Santos', 'maria@example.com', 'Mensalidade Basic', 19.90, '2024-01-20 23:59:59+00', 'Pendente', 'Mensal', 'Cartão', 'Crédito', 0, 'Aguardando pagamento', ARRAY['basic', 'mensal']),
('Pedro Costa', 'pedro@example.com', 'Mensalidade Premium', 29.90, '2024-01-10 23:59:59+00', 'Vencido', 'Mensal', 'Boleto', 'Boleto', 2, 'Pagamento em atraso', ARRAY['premium', 'mensal', 'vencido']),
('Ana Oliveira', 'ana@example.com', 'Mensalidade Basic', 19.90, '2024-01-25 23:59:59+00', 'Pendente', 'Mensal', 'Pix', 'Pix', 0, 'Aguardando pagamento', ARRAY['basic', 'mensal']),
('Carlos Ferreira', 'carlos@example.com', 'Mensalidade Premium', 29.90, '2024-01-05 23:59:59+00', 'Pago', 'Mensal', 'Cartão', 'Débito', 1, 'Pagamento realizado', ARRAY['premium', 'mensal']),
('João Silva', 'joao@example.com', 'Mensalidade Premium', 29.90, '2024-02-15 23:59:59+00', 'Pendente', 'Mensal', 'Pix', 'Pix', 0, 'Próxima mensalidade', ARRAY['premium', 'mensal']),
('Maria Santos', 'maria@example.com', 'Mensalidade Basic', 19.90, '2024-02-20 23:59:59+00', 'Pendente', 'Mensal', 'Cartão', 'Crédito', 0, 'Próxima mensalidade', ARRAY['basic', 'mensal']);

-- Comentários sobre os dados inseridos
COMMENT ON TABLE public.users IS 'Dados de exemplo inseridos para teste';
COMMENT ON TABLE public.resellers IS 'Dados de exemplo inseridos para teste';
COMMENT ON TABLE public.cobrancas IS 'Dados de exemplo inseridos para teste';

-- Verificar os dados inseridos
SELECT 'Users count:' as info, COUNT(*) as count FROM public.users
UNION ALL
SELECT 'Resellers count:', COUNT(*) FROM public.resellers
UNION ALL
SELECT 'Charges count:', COUNT(*) FROM public.cobrancas; 