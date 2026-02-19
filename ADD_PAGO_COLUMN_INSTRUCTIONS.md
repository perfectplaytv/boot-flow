# 📋 Instruções para Adicionar Coluna 'pago' no Supabase

## 🎯 Objetivo
Adicionar a coluna `pago` (BOOLEAN) na tabela `users` para controlar o status de pagamento dos clientes.

## ⚡ Método Rápido (Recomendado)

### Use o Script Completo
1. Abra o arquivo **`setup_pago_column_complete.sql`**
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Execute (Run ou Ctrl+Enter)
5. Pronto! ✅

Este script faz tudo automaticamente:
- ✅ Verifica se a tabela existe
- ✅ Adiciona a coluna `pago`
- ✅ Cria índice para performance
- ✅ Configura políticas RLS
- ✅ Verifica se tudo está correto

## 📝 Passo a Passo Detalhado

### 1. Acessar o Supabase Dashboard
- Acesse https://app.supabase.com
- Faça login na sua conta
- Selecione o projeto desejado

### 2. Abrir o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova query

### 3. Executar o Script SQL

**Opção A: Script Completo (Recomendado) ⭐**
- Abra o arquivo **`setup_pago_column_complete.sql`**
- Copie TODO o conteúdo do arquivo
- Cole no SQL Editor do Supabase
- Clique em **"Run"** ou pressione **Ctrl+Enter** (Windows/Linux) ou **Cmd+Enter** (Mac)

**Opção B: Script Simples**
- Abra o arquivo **`add_pago_column_users.sql`**
- Copie TODO o conteúdo do arquivo
- Cole no SQL Editor do Supabase
- Clique em **"Run"**
- Se tiver problemas com RLS, execute também **`fix_rls_pago_column.sql`**

### 4. Verificar se Funcionou
Após executar o script, você deve ver mensagens de sucesso no console:
- `✓ Tabela users existe`
- `✓ Coluna pago adicionada com sucesso!`
- `✓ Índice criado/verificado`
- `✓ Políticas RLS configuradas`
- `✓ Tudo configurado com sucesso!`

Para verificar manualmente, execute esta query:
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name = 'pago';
```

Você deve ver:
- `column_name`: pago
- `data_type`: boolean
- `is_nullable`: NO
- `column_default`: false

## 🔍 Verificar se a Tabela Existe

Se você receber um erro dizendo que a tabela `users` não existe, execute primeiro o script de criação da tabela:

```sql
-- Verificar se a tabela users existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
```

Se a tabela não existir, execute o script `criar_todas_tabelas.sql` ou `create_tables_clientes_revendas.sql` primeiro.

## ⚠️ Solução de Problemas

### Erro: "permission denied"
- Verifique se você tem permissão de administrador no projeto
- Verifique se as políticas RLS não estão bloqueando
- Execute o script `fix_rls_pago_column.sql` para configurar as políticas

### Erro: "column already exists"
- Isso significa que a coluna já existe
- Você pode pular este passo
- O script não vai dar erro, apenas mostrar uma mensagem informando que já existe

### Erro: "table does not exist"
- Execute primeiro o script de criação da tabela `users`
- Verifique o nome da tabela (deve ser `users` e não `clientes`)
- Execute `criar_todas_tabelas.sql` primeiro

### Erro: "RLS policy violation"
- Execute o script `fix_rls_pago_column.sql` para configurar as políticas RLS
- Ou desabilite RLS temporariamente (não recomendado para produção):
  ```sql
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
  ```

### Erro: "authentication required"
- Verifique se você está logado no Supabase
- Verifique se você tem permissões de administrador no projeto
- Verifique se as credenciais do projeto estão corretas

## ✅ Após Executar o Script

1. **Teste no Frontend**: 
   - Acesse a página "Gerenciamento de Usuários"
   - Clique no botão "Pago" de um cliente
   - Confirme no pop-up
   - O botão deve ficar verde

2. **Verifique o Console**: 
   - Abra o console do navegador (F12)
   - Verifique se não há mais erros
   - Procure por mensagens de sucesso

3. **Verifique o Dashboard**: 
   - Acesse o "Dashboard Admin"
   - Confirme que a "Receita Total" está sendo calculada corretamente
   - Quando marcar um cliente como pago, a receita deve aumentar

## 🔗 Scripts Disponíveis

- **`setup_pago_column_complete.sql`** ⭐ - Script completo (recomendado)
- **`add_pago_column_users.sql`** - Script simples para adicionar a coluna
- **`fix_rls_pago_column.sql`** - Script para configurar políticas RLS
- **`criar_todas_tabelas.sql`** - Cria todas as tabelas necessárias
- **`create_tables_clientes_revendas.sql`** - Cria tabelas de clientes e revendas
- **`add_price_column_users.sql`** - Adiciona coluna price (se necessário)

## 📞 Suporte

Se você continuar tendo problemas:

1. **Verifique os logs no console do navegador** (F12)
   - Procure por mensagens de erro
   - Procure por logs do tipo `🔄 [useClientes]` ou `❌ [AdminUsers]`

2. **Verifique os logs no Supabase Dashboard**
   - Vá em "Logs" > "Postgres Logs"
   - Procure por erros relacionados à tabela `users`

3. **Verifique as credenciais**
   - Certifique-se de que está usando o projeto correto do Supabase
   - Verifique se as credenciais do Supabase estão corretas no arquivo `.env`
   - Verifique se as variáveis de ambiente estão configuradas corretamente

4. **Teste a conexão**
   - Execute uma query simples no SQL Editor:
     ```sql
     SELECT COUNT(*) FROM public.users;
     ```
   - Se esta query funcionar, a conexão está OK

## 🎉 Pronto!

Após executar o script com sucesso, você poderá:
- ✅ Marcar clientes como pagos
- ✅ Ver o status de pagamento na lista de usuários
- ✅ Ver a receita total no Dashboard Admin
- ✅ Sincronizar o status de pagamento em todas as páginas
