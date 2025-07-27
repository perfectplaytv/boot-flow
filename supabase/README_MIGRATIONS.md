# Migrações do Supabase - Bootflow

Este documento explica como executar as migrações SQL no Supabase para configurar o banco de dados do projeto Bootflow.

## 📁 Estrutura dos Arquivos

```
supabase/
├── schema.sql                    # Schema completo (avançado)
├── migrations/
│   ├── 001_initial_schema.sql    # Migração inicial (recomendado)
│   └── 002_rls_policies.sql      # Políticas RLS
└── README_MIGRATIONS.md          # Este arquivo
```

## 🚀 Como Executar as Migrações

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. **Acesse o Dashboard do Supabase**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login e selecione seu projeto

2. **Execute a Migração Inicial**
   - Vá para **SQL Editor**
   - Clique em **New Query**
   - Copie e cole o conteúdo de `001_initial_schema.sql`
   - Clique em **Run**

3. **Execute as Políticas RLS**
   - Crie uma nova query
   - Copie e cole o conteúdo de `002_rls_policies.sql`
   - Clique em **Run**

### Opção 2: Via Supabase CLI

1. **Instale o Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Faça login**
   ```bash
   supabase login
   ```

3. **Execute as migrações**
   ```bash
   supabase db push
   ```

## 📋 Tabelas Criadas

### 1. **users** - Usuários/Clientes
- `id` - ID único (BIGSERIAL)
- `name` - Nome completo (TEXT, NOT NULL)
- `email` - Email único (TEXT, NOT NULL, UNIQUE)
- `password` - Senha (TEXT)
- `m3u_url` - URL da playlist M3U (TEXT)
- `bouquets` - Pacotes/bouquets (TEXT)
- `expiration_date` - Data de expiração (TIMESTAMP)
- `observations` - Observações (TEXT)
- `created_at` - Data de criação (TIMESTAMP)
- `updated_at` - Data de atualização (TIMESTAMP)

### 2. **resellers** - Revendedores
- `id` - ID único (BIGSERIAL)
- `username` - Nome de usuário único (TEXT, UNIQUE)
- `email` - Email único (TEXT, UNIQUE)
- `password` - Senha (TEXT)
- `permission` - Nível de permissão (TEXT, DEFAULT 'reseller')
- `credits` - Créditos disponíveis (INTEGER, DEFAULT 0)
- `personal_name` - Nome pessoal (TEXT)
- `status` - Status (TEXT, DEFAULT 'Ativo')
- `created_at` - Data de criação (TIMESTAMP)
- `updated_at` - Data de atualização (TIMESTAMP)
- `force_password_change` - Forçar mudança de senha (TEXT)
- `servers` - Servidores (TEXT)
- `master_reseller` - Revendedor mestre (TEXT)
- `disable_login_days` - Dias de bloqueio (INTEGER, DEFAULT 0)
- `monthly_reseller` - Revendedor mensal (BOOLEAN, DEFAULT false)
- `telegram` - Telegram (TEXT)
- `whatsapp` - WhatsApp (TEXT)
- `observations` - Observações (TEXT)

### 3. **cobrancas** - Cobranças
- `id` - ID único (BIGSERIAL)
- `cliente` - Nome do cliente (TEXT, NOT NULL)
- `email` - Email do cliente (TEXT)
- `descricao` - Descrição (TEXT)
- `valor` - Valor (DECIMAL(10,2))
- `vencimento` - Data de vencimento (TIMESTAMP)
- `status` - Status (TEXT, DEFAULT 'Pendente')
- `tipo` - Tipo de cobrança (TEXT)
- `gateway` - Gateway de pagamento (TEXT)
- `formapagamento` - Forma de pagamento (TEXT)
- `tentativas` - Número de tentativas (INTEGER, DEFAULT 0)
- `ultimatentativa` - Última tentativa (TIMESTAMP)
- `proximatentativa` - Próxima tentativa (TIMESTAMP)
- `observacoes` - Observações (TEXT)
- `tags` - Tags (TEXT[])
- `created_at` - Data de criação (TIMESTAMP)
- `updated_at` - Data de atualização (TIMESTAMP)

### 4. **auth_users** - Usuários de Autenticação
- `id` - ID único (UUID, referência para auth.users)
- `role` - Papel do usuário (TEXT, DEFAULT 'user')
- `profile_completed` - Perfil completo (BOOLEAN, DEFAULT false)
- `last_login` - Último login (TIMESTAMP)
- `created_at` - Data de criação (TIMESTAMP)
- `updated_at` - Data de atualização (TIMESTAMP)

## 🔒 Políticas RLS (Row Level Security)

### **Usuários (users)**
- Usuários podem ver apenas seus próprios dados
- Admins podem ver, inserir, atualizar e deletar todos os usuários

### **Revendedores (resellers)**
- Revendedores podem ver apenas seus próprios dados
- Admins podem gerenciar todos os revendedores

### **Cobranças (cobrancas)**
- Usuários podem ver cobranças relacionadas ao seu email
- Admins podem gerenciar todas as cobranças

### **Usuários de Autenticação (auth_users)**
- Usuários podem ver apenas seus próprios dados
- Admins podem gerenciar todos os dados de autenticação

## 📊 Views Criadas

### **user_stats** - Estatísticas de Usuários
- `total_users` - Total de usuários
- `active_users` - Usuários ativos
- `expired_users` - Usuários expirados
- `users_without_expiration` - Usuários sem expiração

### **charge_stats** - Estatísticas de Cobranças
- `total_charges` - Total de cobranças
- `paid_charges` - Cobranças pagas
- `pending_charges` - Cobranças pendentes
- `overdue_charges` - Cobranças vencidas
- `total_paid_amount` - Valor total pago
- `total_pending_amount` - Valor total pendente

## ⚙️ Funcionalidades Automáticas

### **Triggers**
- `update_updated_at_column()` - Atualiza automaticamente o campo `updated_at`
- `handle_new_user()` - Cria registro em `auth_users` quando um usuário se registra

### **Índices**
- Índices criados automaticamente para melhor performance
- Índices em campos frequentemente consultados (email, status, datas)

## 🔧 Configuração Pós-Migração

### 1. **Criar Usuário Admin**
Após executar as migrações, você precisa criar um usuário admin:

1. Registre um usuário através da interface de autenticação
2. Execute o seguinte SQL para torná-lo admin:

```sql
UPDATE public.auth_users 
SET role = 'admin' 
WHERE id = 'ID_DO_USUARIO_REGISTRADO';
```

### 2. **Verificar Configurações**
- Confirme que as políticas RLS estão ativas
- Teste as permissões de acesso
- Verifique se os triggers estão funcionando

### 3. **Testar Funcionalidades**
- Teste o registro de usuários
- Teste o login/logout
- Teste as operações CRUD nas tabelas
- Verifique se as views estão funcionando

## 🐛 Troubleshooting

### **Erro: "relation already exists"**
- Use `CREATE TABLE IF NOT EXISTS` (já incluído no script)
- Ou execute `DROP TABLE IF EXISTS` antes de criar

### **Erro: "function already exists"**
- Use `CREATE OR REPLACE FUNCTION` (já incluído no script)

### **Erro: "policy already exists"**
- Execute `DROP POLICY IF EXISTS` antes de criar as políticas

### **Erro de permissão**
- Verifique se você tem permissões de administrador no projeto
- Confirme que está executando no schema correto

## 📝 Notas Importantes

1. **Backup**: Sempre faça backup antes de executar migrações em produção
2. **Teste**: Teste as migrações em ambiente de desenvolvimento primeiro
3. **Ordem**: Execute as migrações na ordem correta (001 antes de 002)
4. **Dados**: As migrações não incluem dados de exemplo, apenas estrutura
5. **Segurança**: As políticas RLS garantem que apenas usuários autorizados acessem os dados

## 🎯 Próximos Passos

Após executar as migrações:

1. Configure as variáveis de ambiente no Vercel
2. Teste a aplicação
3. Crie usuários de teste
4. Configure autenticação social (opcional)
5. Implemente funcionalidades adicionais conforme necessário 