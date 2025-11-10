# 📋 Instruções para Adicionar Coluna 'pago' no Supabase

## 🎯 Objetivo
Adicionar a coluna `pago` (BOOLEAN) na tabela `users` para controlar o status de pagamento dos clientes.

## 📝 Passo a Passo

### 1. Acessar o Supabase Dashboard
- Acesse https://app.supabase.com
- Faça login na sua conta
- Selecione o projeto desejado

### 2. Abrir o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova query

### 3. Executar o Script SQL
- Abra o arquivo `add_pago_column_users.sql`
- Copie TODO o conteúdo do arquivo
- Cole no SQL Editor do Supabase
- Clique em **"Run"** ou pressione **Ctrl+Enter** (Windows/Linux) ou **Cmd+Enter** (Mac)

### 4. Verificar se Funcionou
Após executar o script, você deve ver mensagens de sucesso no console.

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

### Erro: "column already exists"
- Isso significa que a coluna já existe
- Você pode pular este passo

### Erro: "table does not exist"
- Execute primeiro o script de criação da tabela `users`
- Verifique o nome da tabela (deve ser `users` e não `clientes`)

## ✅ Após Executar o Script

1. **Teste no Frontend**: Tente marcar um cliente como pago na página "Gerenciamento de Usuários"
2. **Verifique o Console**: Abra o console do navegador (F12) e verifique se não há mais erros
3. **Verifique o Dashboard**: Confirme que a receita total está sendo calculada corretamente

## 🔗 Scripts Relacionados

- `add_pago_column_users.sql` - Este script (adiciona coluna pago)
- `criar_todas_tabelas.sql` - Cria todas as tabelas necessárias
- `create_tables_clientes_revendas.sql` - Cria tabelas de clientes e revendas
- `add_price_column_users.sql` - Adiciona coluna price (se necessário)

## 📞 Suporte

Se você continuar tendo problemas:
1. Verifique os logs no console do navegador
2. Verifique os logs no Supabase Dashboard > Logs
3. Certifique-se de que está usando o projeto correto do Supabase
4. Verifique se as credenciais do Supabase estão corretas no arquivo `.env`

