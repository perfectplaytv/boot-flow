# 👥 Guia: Separar Clientes por Admin no Supabase

Este guia explica como configurar o sistema para que cada admin veja apenas seus próprios clientes.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração no Banco de Dados](#configuração-no-banco-de-dados)
3. [Como Funciona](#como-funciona)
4. [Migração de Dados Existentes](#migração-de-dados-existentes)
5. [Testando a Separação](#testando-a-separação)
6. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

Com esta configuração:
- ✅ Cada admin vê apenas os clientes que ele criou
- ✅ Ao criar um novo cliente, ele é automaticamente associado ao admin logado
- ✅ Admins não podem ver ou modificar clientes de outros admins
- ✅ Políticas RLS garantem segurança no nível do banco de dados

---

## 🔧 Configuração no Banco de Dados

### Passo 1: Executar o Script SQL

1. **Acesse o Supabase Dashboard**
   - Vá em: https://app.supabase.com
   - Selecione seu projeto
   - Vá em **SQL Editor**

2. **Execute o Script**
   - Abra o arquivo `adicionar_admin_id_usuarios.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **Run** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

3. **Verificar Execução**
   - O script deve executar sem erros
   - Você verá mensagens de sucesso no console

### O que o Script Faz:

1. ✅ Adiciona a coluna `admin_id` na tabela `users`
2. ✅ Cria um índice para melhor performance
3. ✅ Configura políticas RLS (Row Level Security)
4. ✅ Garante que cada admin veja apenas seus clientes

---

## 🔍 Como Funciona

### 1. Estrutura da Tabela

A tabela `users` agora tem uma coluna `admin_id`:

```sql
CREATE TABLE public.users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  -- ... outros campos ...
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);
```

### 2. Políticas RLS

As políticas RLS garantem que:

- **SELECT**: Admins veem apenas clientes onde `admin_id = auth.uid()` ou `admin_id IS NULL`
- **INSERT**: Ao criar um cliente, o `admin_id` é automaticamente definido como o ID do admin logado
- **UPDATE**: Admins podem atualizar apenas seus próprios clientes
- **DELETE**: Admins podem deletar apenas seus próprios clientes

### 3. Código Frontend

O hook `useClientes` foi modificado para:

- ✅ Filtrar clientes pelo `admin_id` do admin logado
- ✅ Associar automaticamente novos clientes ao admin logado
- ✅ Recarregar clientes quando o admin mudar

---

## 📊 Migração de Dados Existentes

Se você já tem clientes cadastrados e quer associá-los a um admin específico:

### Opção 1: Associar Todos os Clientes a um Admin

Execute este SQL no Supabase SQL Editor:

```sql
-- Substitua 'admin@exemplo.com' pelo email do admin
UPDATE public.users
SET admin_id = (
  SELECT id FROM auth.users
  WHERE email = 'admin@exemplo.com'  -- ALTERE AQUI
  LIMIT 1
)
WHERE admin_id IS NULL;
```

### Opção 2: Distribuir Clientes Entre Admins

Execute este SQL para distribuir clientes existentes entre múltiplos admins:

```sql
-- Associar clientes alternadamente entre dois admins
UPDATE public.users
SET admin_id = (
  SELECT id FROM auth.users
  WHERE email = CASE 
    WHEN (id % 2) = 0 THEN 'admin1@exemplo.com'  -- ALTERE AQUI
    ELSE 'admin2@exemplo.com'  -- ALTERE AQUI
  END
  LIMIT 1
)
WHERE admin_id IS NULL;
```

### Opção 3: Associar Clientes Manualmente

Você pode associar clientes manualmente no Supabase:

1. Vá em **Table Editor** → **users**
2. Edite cada cliente
3. Defina o `admin_id` para o ID do admin responsável

---

## 🧪 Testando a Separação

### Teste 1: Criar Cliente como Admin 1

1. **Faça login como Admin 1**
   - Acesse: `http://localhost:3000/login`
   - Entre com as credenciais do Admin 1

2. **Crie um novo cliente**
   - Vá em **Gerenciamento de Usuários**
   - Clique em **Adicionar Cliente**
   - Preencha os dados e salve

3. **Verificar no Banco**
   - Execute este SQL:
   ```sql
   SELECT id, name, email, admin_id
   FROM public.users
   ORDER BY created_at DESC
   LIMIT 1;
   ```
   - O `admin_id` deve ser o ID do Admin 1

### Teste 2: Ver Clientes como Admin 2

1. **Faça logout e login como Admin 2**
   - Saia da conta do Admin 1
   - Entre com as credenciais do Admin 2

2. **Verificar Lista de Clientes**
   - Vá em **Gerenciamento de Usuários**
   - Você deve ver apenas os clientes criados pelo Admin 2
   - O cliente criado pelo Admin 1 não deve aparecer

### Teste 3: Tentar Editar Cliente de Outro Admin

1. **Como Admin 2, tente editar um cliente do Admin 1**
   - Se as políticas RLS estiverem corretas, você não conseguirá editar
   - O sistema deve retornar um erro de permissão

---

## 🔍 Verificar Configuração

### Query 1: Ver Clientes por Admin

```sql
SELECT 
  p.email as admin_email,
  p.full_name as admin_nome,
  COUNT(u.id) as total_clientes
FROM public.profiles p
LEFT JOIN public.users u ON u.admin_id = p.id
WHERE p.role = 'admin'
GROUP BY p.id, p.email, p.full_name
ORDER BY total_clientes DESC;
```

### Query 2: Ver Clientes Sem Admin

```sql
SELECT 
  id,
  name,
  email,
  created_at
FROM public.users
WHERE admin_id IS NULL
ORDER BY created_at DESC;
```

### Query 3: Verificar Políticas RLS

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'users'
ORDER BY policyname;
```

---

## ⚠️ Solução de Problemas

### Problema: Admin vê todos os clientes

**Causa**: Políticas RLS não estão configuradas corretamente.

**Solução**:
1. Execute novamente o script `adicionar_admin_id_usuarios.sql`
2. Verifique se as políticas foram criadas:
   ```sql
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'users';
   ```
3. Se as políticas não existirem, execute a seção "PASSO 3" do script novamente

### Problema: Não consigo criar cliente

**Causa**: Política de INSERT não permite ou `admin_id` não está sendo definido.

**Solução**:
1. Verifique se você está logado como admin
2. Verifique se o `admin_id` está sendo definido automaticamente
3. Execute este SQL para verificar:
   ```sql
   SELECT id, email, role 
   FROM public.profiles 
   WHERE id = auth.uid();
   ```

### Problema: Cliente criado sem admin_id

**Causa**: O código frontend não está associando o cliente ao admin.

**Solução**:
1. Verifique se o hook `useClientes` está usando `useAuth()` corretamente
2. Verifique se o `admin_id` está sendo adicionado ao criar o cliente
3. Verifique os logs do console do navegador

### Problema: Erro "permission denied"

**Causa**: Políticas RLS estão bloqueando a operação.

**Solução**:
1. Verifique se você está logado como admin
2. Verifique se o `admin_id` do cliente corresponde ao seu ID
3. Execute este SQL para verificar suas permissões:
   ```sql
   SELECT 
     id,
     email,
     role
   FROM public.profiles
   WHERE id = auth.uid();
   ```

---

## 📝 Notas Importantes

1. **Clientes Sem Admin**: Clientes com `admin_id = NULL` podem ser vistos por todos os admins. Isso é útil para migração de dados, mas você pode querer associá-los a um admin específico.

2. **Deletar Admin**: Se um admin for deletado, os clientes associados a ele terão `admin_id = NULL` (devido ao `ON DELETE SET NULL`). Você pode querer reassociá-los a outro admin.

3. **Performance**: O índice em `admin_id` garante que as queries sejam rápidas mesmo com muitos clientes.

4. **Segurança**: As políticas RLS garantem segurança no nível do banco de dados, mesmo que alguém tente acessar diretamente a API.

---

## ✅ Checklist de Configuração

- [ ] Script SQL executado com sucesso
- [ ] Coluna `admin_id` adicionada na tabela `users`
- [ ] Índice criado em `admin_id`
- [ ] Políticas RLS configuradas
- [ ] Código frontend atualizado (hook `useClientes`)
- [ ] Testado criação de cliente como Admin 1
- [ ] Testado visualização de clientes como Admin 2
- [ ] Verificado que admins não veem clientes de outros admins
- [ ] Dados existentes migrados (se necessário)

---

## 🔗 Arquivos Relacionados

- `adicionar_admin_id_usuarios.sql` - Script SQL para configurar o banco
- `src/hooks/useClientes.ts` - Hook modificado para filtrar por admin
- `GUIA_CONFIGURAR_MULTIPLOS_ADMINS.md` - Guia para criar múltiplos admins

---

**Pronto!** Agora cada admin vê apenas seus próprios clientes. 🎉

