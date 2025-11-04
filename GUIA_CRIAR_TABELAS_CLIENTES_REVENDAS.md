# 📋 Guia: Criar Tabelas Clientes e Revendas no Supabase

Este guia explica como criar as tabelas `users` (Clientes) e `resellers` (Revendas) no Supabase.

## 🚀 Passo a Passo

### 1. Acessar o SQL Editor no Supabase

1. Acesse https://app.supabase.com
2. Faça login na sua conta
3. Selecione seu projeto
4. No menu lateral, clique em **SQL Editor**
5. Clique em **New Query**

### 2. Executar o Script SQL

1. Abra o arquivo `create_tables_clientes_revendas.sql`
2. Copie todo o conteúdo do arquivo
3. Cole no editor SQL do Supabase
4. Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### 3. Verificar se as Tabelas Foram Criadas

1. No menu lateral, clique em **Table Editor**
2. Você deve ver duas novas tabelas:
   - `users` (Clientes)
   - `resellers` (Revendas)

## 📊 Estrutura das Tabelas

### Tabela `users` (Clientes)

**Campos principais:**
- `id` - ID único do cliente (auto-incremento)
- `name` - Nome do cliente (obrigatório)
- `email` - E-mail único (obrigatório, único)
- `password` - Senha (opcional)
- `status` - Status (padrão: 'Ativo')
- `plan` - Plano contratado
- `expiration_date` - Data de expiração
- `credits` - Créditos disponíveis
- `devices` - Número de dispositivos permitidos
- `m3u_url` - URL do arquivo M3U
- `bouquets` - Pacotes de canais
- `phone`, `telegram`, `whatsapp` - Contatos
- `observations`, `notes` - Observações e notas
- `created_at`, `updated_at` - Timestamps automáticos

### Tabela `resellers` (Revendas)

**Campos principais:**
- `id` - ID único do revendedor (auto-incremento)
- `username` - Nome de usuário único (obrigatório, único)
- `email` - E-mail único (obrigatório, único)
- `password` - Senha (opcional)
- `permission` - Nível de permissão (padrão: 'reseller')
- `status` - Status (padrão: 'Ativo')
- `credits` - Créditos disponíveis (padrão: 10)
- `personal_name` - Nome pessoal
- `force_password_change` - Forçar mudança de senha
- `servers` - Servidores associados
- `master_reseller` - Revendedor master
- `disable_login_days` - Dias de bloqueio de login
- `monthly_reseller` - Revendedor mensal
- `telegram`, `whatsapp` - Contatos
- `observations` - Observações
- `created_at`, `updated_at` - Timestamps automáticos

## 🔒 Segurança (RLS)

As tabelas têm **Row Level Security (RLS)** habilitado com as seguintes políticas:

- ✅ **SELECT**: Qualquer usuário autenticado pode ver todos os registros
- ✅ **INSERT**: Qualquer usuário autenticado pode inserir registros
- ✅ **UPDATE**: Qualquer usuário autenticado pode atualizar registros
- ✅ **DELETE**: Qualquer usuário autenticado pode deletar registros

**⚠️ Nota:** Estas são políticas básicas. Para produção, você deve ajustar as políticas conforme suas necessidades de segurança.

## 🎯 Funcionalidades Incluídas

✅ **Auto-incremento de IDs** - Campos `id` são gerados automaticamente
✅ **Timestamps automáticos** - `created_at` e `updated_at` são atualizados automaticamente
✅ **Índices para performance** - Índices criados em campos frequentemente consultados
✅ **Validação de unicidade** - `email` e `username` são únicos
✅ **Valores padrão** - Vários campos têm valores padrão definidos
✅ **Comentários** - Documentação nas tabelas e colunas

## 🔄 Atualizar Tabelas Existentes

Se as tabelas já existem e você quer atualizar:

1. **Opção 1 - Manter dados existentes:**
   - Execute apenas as partes do script que criam colunas que não existem
   - Use `ALTER TABLE` para adicionar colunas faltantes

2. **Opção 2 - Recriar do zero:**
   - ⚠️ **CUIDADO**: Isso apaga todos os dados!
   - Descomente as linhas `DROP TABLE` no início do script
   - Execute o script completo

## 🐛 Troubleshooting

### Erro: "relation already exists"
- As tabelas já existem. Use `DROP TABLE` se quiser recriar (isso apaga dados!)

### Erro: "permission denied"
- Verifique se você tem permissões de administrador no projeto Supabase

### Erro: "syntax error"
- Verifique se copiou o script completo
- Certifique-se de que não há caracteres especiais

### RLS bloqueando operações
- As políticas RLS podem estar muito restritivas
- Verifique se você está autenticado
- Execute as políticas conforme suas necessidades

## 📝 Próximos Passos

Após criar as tabelas:

1. ✅ Teste inserir dados manualmente pelo Table Editor
2. ✅ Teste fazer queries via SQL Editor
3. ✅ Verifique se a aplicação consegue acessar as tabelas
4. ✅ Ajuste as políticas RLS conforme necessário

## 🔗 Referências

- [Documentação Supabase - SQL Editor](https://supabase.com/docs/guides/database/tables)
- [Documentação Supabase - RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)

