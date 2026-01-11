-- Criação da tabela de planos
CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT DEFAULT '/mês',
  description TEXT,
  clients_limit TEXT,
  is_popular BOOLEAN DEFAULT 0,
  highlight TEXT,
  features TEXT, -- JSON array
  active BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0
);

-- Limpar tabela (opcional, para evitar duplicatas se rodar 2x)
DELETE FROM plans;

-- Inserir Planos Atuais
INSERT INTO plans (name, price, period, description, clients_limit, is_popular, highlight, display_order, features) VALUES 
('Essencial', 'R$ 0', '/mês', 'Para quem está começando e quer organizar o jogo', '5 clientes', 0, 'Entrada perfeita para testar e já faturar. Zero desculpa.', 1, 
'[{"text": "5 clientes", "icon": "Users"}, {"text": "Gestor Bot", "icon": "Bot"}, {"text": "Link WhatsApp", "icon": "Link"}, {"text": "WhatsAPI própria (envios ilimitados)", "icon": "MessageSquare"}, {"text": "Campanhas WhatsApp", "icon": "Zap"}, {"text": "Envio de e-mail", "icon": "Mail"}, {"text": "Emite cobranças", "icon": "FileText"}, {"text": "Link de pagamento", "icon": "CreditCard"}, {"text": "Financeiro completo", "icon": "DollarSign"}, {"text": "Faturas de clientes", "icon": "FileText"}, {"text": "Área do cliente", "icon": "Users"}, {"text": "Exportar dados financeiros", "icon": "Download"}, {"text": "Integração Mercado Pago", "icon": "ShoppingCart"}, {"text": "Envio de produtos digitais", "icon": "ArrowRightCircle"}]'),

('Profissional', 'R$ 29,90', '/mês', 'Para quem já tem fluxo e precisa escalar com estrutura', '50 clientes', 1, 'Ideal para pequenos negócios começarem a automatizar pra valer.', 2,
'[{"text": "50 clientes", "icon": "Users"}, {"text": "Tudo do Essencial", "icon": "Check"}, {"text": "Prioridade no suporte", "icon": "Headphones"}]'),

('Business', 'R$ 39,90', '/mês', 'Para quem está crescendo firme e quer automação séria', '100 clientes', 0, 'Aqui você começa a rodar como empresa de verdade.', 3,
'[{"text": "100 clientes", "icon": "Users"}, {"text": "Tudo do Profissional", "icon": "Check"}, {"text": "Recursos avançados de automação", "icon": "BarChart"}]'),

('Elite', 'R$ 59,90', '/mês', 'Para quem quer jogar no nível alto e dominar o mercado', '1.000 clientes', 0, 'Esse é para quem pensa grande e não aceita travar o crescimento.', 4,
'[{"text": "1.000 clientes", "icon": "Users"}, {"text": "Tudo do Business", "icon": "Check"}, {"text": "Suporte VIP", "icon": "Crown"}, {"text": "Migração assistida", "icon": "ArrowRightCircle"}, {"text": "Auditoria rápida do funil", "icon": "BarChart"}]');
