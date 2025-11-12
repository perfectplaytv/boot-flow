# 👥 Guia: Configurar Múltiplas Contas de Admin no Supabase

Este guia explica como criar e gerenciar múltiplas contas de administrador separadas no Supabase.

## 📋 Índice

1. [Criar Admin via Dashboard](#método-1-via-dashboard-do-supabase-recomendado)
2. [Criar Admin via SQL](#método-2-via-sql)
3. [Criar Admin via CLI](#método-3-via-supabase-cli)
4. [Listar Todos os Admins](#listar-todos-os-admins)
5. [Atualizar Role de um Admin](#atualizar-role-de-um-admin)
6. [Remover Admin](#remover-admin)
7. [Boas Práticas](#boas-práticas-de-segurança)

---

## ✅ Método 1: Via Dashboard do Supabase (RECOMENDADO)

### Passo a Passo para Criar Cada Admin:

1. **Acesse o Dashboard do Supabase**
   - Vá em: https://app.supabase.com
   - Selecione seu projeto

2. **Navegue até Authentication**
   - No menu lateral, clique em **Authentication**
   - Depois clique em **Users**
   - Clique no botão **Add User** (ou **+ Add User**)

3. **Preencha os Dados do Primeiro Admin**
   - **Email**: `admin1@exemplo.com` (ou o email do primeiro admin)
   - **Password**: Uma senha segura (mínimo 8 caracteres)
   - ✅ **Auto Confirm User**: MARQUE ESTA OPÇÃO (importante!)
   - **User Metadata** (JSON):
     ```json
     {
       "role": "admin",
       "full_name": "Nome do Admin 1"
     }
     ```

4. **Clique em "Create User"**

5. **Repita o Processo para Cada Admin**
   - Para o segundo admin: `admin2@exemplo.com`
   - Para o terceiro admin: `admin3@exemplo.com`
   - E assim por diante...

### ✅ Vantagens:
- Interface visual e fácil de usar
- Criação automática do perfil na tabela `profiles`
- Validação automática de dados
- Não requer conhecimento de SQL

---

## ✅ Método 2: Via SQL

### Script para Criar Múltiplos Admins

Execute este script no **SQL Editor** do Supabase, substituindo os valores:

```sql
-- ============================================
-- CRIAR MÚLTIPLOS ADMINS NO SUPABASE
-- ============================================
-- 
-- IMPORTANTE: Este script NÃO cria os usuários na tabela auth.users
-- Você precisa criar os usuários primeiro via Dashboard ou CLI
-- Depois execute este script para atualizar os perfis
--
-- ============================================

-- Admin 1
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Nome do Admin 1'  -- ALTERE AQUI
WHERE email = 'admin1@exemplo.com';  -- ALTERE AQUI

-- Admin 2
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Nome do Admin 2'  -- ALTERE AQUI
WHERE email = 'admin2@exemplo.com';  -- ALTERE AQUI

-- Admin 3
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = 'Nome do Admin 3'  -- ALTERE AQUI
WHERE email = 'admin3@exemplo.com';  -- ALTERE AQUI

-- Adicione mais admins conforme necessário...

-- Verificar se os perfis foram atualizados
SELECT 
  id,
  email,
  role,
  full_name,
  created_at,
  updated_at
FROM public.profiles
WHERE role = 'admin'
ORDER BY created_at DESC;
```

### Script Completo (Criar Usuário + Atualizar Perfil)

Se você já criou os usuários via Dashboard, use este script para atualizar todos de uma vez:

```sql
-- ============================================
-- ATUALIZAR MÚLTIPLOS USUÁRIOS PARA ADMIN
-- ============================================

-- Lista de emails que devem ser admins
UPDATE public.profiles
SET 
  role = 'admin',
  full_name = CASE email
    WHEN 'admin1@exemplo.com' THEN 'Nome do Admin 1'
    WHEN 'admin2@exemplo.com' THEN 'Nome do Admin 2'
    WHEN 'admin3@exemplo.com' THEN 'Nome do Admin 3'
    -- Adicione mais casos conforme necessário
    ELSE full_name
  END
WHERE email IN (
  'admin1@exemplo.com',
  'admin2@exemplo.com',
  'admin3@exemplo.com'
  -- Adicione mais emails conforme necessário
);

-- Verificar resultado
SELECT 
  email,
  role,
  full_name,
  created_at
FROM public.profiles
WHERE email IN (
  'admin1@exemplo.com',
  'admin2@exemplo.com',
  'admin3@exemplo.com'
)
ORDER BY email;
```

---

## ✅ Método 3: Via Supabase CLI

### Instalar Supabase CLI (se ainda não tiver)

```bash
npm install -g supabase
```

### Autenticar no Supabase

```bash
supabase login
```

### Criar Múltiplos Admins via CLI

```bash
# Admin 1
supabase auth admin create-user \
  --email admin1@exemplo.com \
  --password senha123456 \
  --user-metadata '{"role":"admin","full_name":"Nome do Admin 1"}' \
  --email-confirm

# Admin 2
supabase auth admin create-user \
  --email admin2@exemplo.com \
  --password senha123456 \
  --user-metadata '{"role":"admin","full_name":"Nome do Admin 2"}' \
  --email-confirm

# Admin 3
supabase auth admin create-user \
  --email admin3@exemplo.com \
  --password senha123456 \
  --user-metadata '{"role":"admin","full_name":"Nome do Admin 3"}' \
  --email-confirm
```

### Script Bash para Criar Múltiplos Admins

Crie um arquivo `criar_admins.sh`:

```bash
#!/bin/bash

# Array de admins (email:senha:nome)
declare -a admins=(
  "admin1@exemplo.com:senha123456:Nome do Admin 1"
  "admin2@exemplo.com:senha123456:Nome do Admin 2"
  "admin3@exemplo.com:senha123456:Nome do Admin 3"
)

# Loop para criar cada admin
for admin in "${admins[@]}"; do
  IFS=':' read -r email password name <<< "$admin"
  
  echo "Criando admin: $email"
  
  supabase auth admin create-user \
    --email "$email" \
    --password "$password" \
    --user-metadata "{\"role\":\"admin\",\"full_name\":\"$name\"}" \
    --email-confirm
  
  echo "Admin $email criado com sucesso!"
  echo ""
done

echo "Todos os admins foram criados!"
```

Torne o script executável e execute:

```bash
chmod +x criar_admins.sh
./criar_admins.sh
```

---

## 📋 Listar Todos os Admins

### Query SQL para Listar Todos os Admins

```sql
-- ============================================
-- LISTAR TODOS OS ADMINS
-- ============================================

SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.avatar_url,
  p.created_at,
  p.updated_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
ORDER BY p.created_at DESC;
```

### Query para Contar Admins

```sql
-- Contar total de admins
SELECT 
  COUNT(*) as total_admins,
  COUNT(CASE WHEN u.email_confirmed_at IS NOT NULL THEN 1 END) as admins_confirmados,
  COUNT(CASE WHEN u.last_sign_in_at IS NOT NULL THEN 1 END) as admins_ativos
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
```

---

## 🔄 Atualizar Role de um Admin

### Tornar um Usuário Admin

```sql
-- Tornar um usuário específico admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'usuario@exemplo.com';
```

### Remover Role de Admin (Tornar Client)

```sql
-- Remover role de admin (tornar client)
UPDATE public.profiles
SET role = 'client'
WHERE email = 'admin@exemplo.com';
```

### Atualizar Nome de um Admin

```sql
-- Atualizar nome de um admin
UPDATE public.profiles
SET 
  full_name = 'Novo Nome do Admin',
  updated_at = NOW()
WHERE email = 'admin@exemplo.com';
```

---

## 🗑️ Remover Admin

### Opção 1: Remover Role de Admin (Manter Usuário)

```sql
-- Remove apenas o role de admin, mantém o usuário como client
UPDATE public.profiles
SET role = 'client'
WHERE email = 'admin@exemplo.com';
```

### Opção 2: Deletar Usuário Completamente

**⚠️ ATENÇÃO: Isso deleta o usuário permanentemente!**

```sql
-- Primeiro, deletar o perfil
DELETE FROM public.profiles
WHERE email = 'admin@exemplo.com';

-- Depois, deletar o usuário da autenticação
-- NOTA: Isso deve ser feito via Dashboard ou API Admin
-- Vá em: Authentication > Users > [Selecione o usuário] > Delete
```

### Via Dashboard:

1. Vá em **Authentication** → **Users**
2. Encontre o usuário que deseja deletar
3. Clique nos três pontos (...) ao lado do usuário
4. Selecione **Delete User**
5. Confirme a exclusão

---

## 🔒 Boas Práticas de Segurança

### 1. Senhas Fortes

- Use senhas com no mínimo 12 caracteres
- Combine letras maiúsculas, minúsculas, números e símbolos
- Não reutilize senhas entre contas

### 2. Limitar Número de Admins

- Mantenha apenas o número necessário de admins
- Revise periodicamente quem tem acesso admin
- Remova admins que não precisam mais de acesso

### 3. Auditoria

Execute periodicamente esta query para verificar atividade:

```sql
-- Verificar última atividade dos admins
SELECT 
  p.email,
  p.full_name,
  u.last_sign_in_at,
  u.created_at,
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN 'Nunca logou'
    WHEN u.last_sign_in_at < NOW() - INTERVAL '30 days' THEN 'Inativo há mais de 30 dias'
    ELSE 'Ativo'
  END as status
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin'
ORDER BY u.last_sign_in_at DESC NULLS LAST;
```

### 4. Políticas RLS

Certifique-se de que as políticas RLS estão configuradas corretamente:

```sql
-- Verificar políticas RLS da tabela profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';
```

### 5. Backup Regular

- Faça backup regular da tabela `profiles`
- Documente quem são os admins e suas responsabilidades

---

## 📝 Exemplo Completo: Criar 3 Admins

### Passo 1: Criar Usuários via Dashboard

1. **Admin 1:**
   - Email: `admin1@exemplo.com`
   - Password: `SenhaSegura123!@#`
   - Auto Confirm: ✅
   - User Metadata: `{"role":"admin","full_name":"João Silva"}`

2. **Admin 2:**
   - Email: `admin2@exemplo.com`
   - Password: `SenhaSegura456!@#`
   - Auto Confirm: ✅
   - User Metadata: `{"role":"admin","full_name":"Maria Santos"}`

3. **Admin 3:**
   - Email: `admin3@exemplo.com`
   - Password: `SenhaSegura789!@#`
   - Auto Confirm: ✅
   - User Metadata: `{"role":"admin","full_name":"Pedro Oliveira"}`

### Passo 2: Verificar Criação

Execute este SQL:

```sql
SELECT 
  email,
  role,
  full_name,
  created_at
FROM public.profiles
WHERE role = 'admin'
ORDER BY created_at DESC;
```

### Passo 3: Testar Login

1. Acesse: `http://localhost:3000/login`
2. Teste login com cada admin
3. Verifique se são redirecionados para `/admin`

---

## 🆘 Solução de Problemas

### Problema: Perfil não foi criado automaticamente

**Solução:**
```sql
-- Criar perfil manualmente para um usuário existente
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
  id,
  email,
  'admin',
  COALESCE(raw_user_meta_data->>'full_name', 'Admin')
FROM auth.users
WHERE email = 'admin@exemplo.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.users.id
);
```

### Problema: Role não está sendo atualizado

**Solução:**
```sql
-- Verificar se o usuário existe
SELECT id, email FROM auth.users WHERE email = 'admin@exemplo.com';

-- Verificar se o perfil existe
SELECT id, email, role FROM public.profiles WHERE email = 'admin@exemplo.com';

-- Atualizar role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@exemplo.com';

-- Verificar atualização
SELECT email, role FROM public.profiles WHERE email = 'admin@exemplo.com';
```

### Problema: Múltiplos perfis para o mesmo usuário

**Solução:**
```sql
-- Encontrar duplicatas
SELECT email, COUNT(*) as count
FROM public.profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- Remover duplicatas (manter apenas o mais recente)
DELETE FROM public.profiles p1
WHERE EXISTS (
  SELECT 1 FROM public.profiles p2
  WHERE p2.email = p1.email
  AND p2.created_at > p1.created_at
);
```

---

## ✅ Checklist para Criar Múltiplos Admins

- [ ] Definir lista de emails dos admins
- [ ] Criar senhas seguras para cada admin
- [ ] Criar usuários via Dashboard, SQL ou CLI
- [ ] Verificar se os perfis foram criados automaticamente
- [ ] Atualizar roles para 'admin' se necessário
- [ ] Verificar se todos os admins podem fazer login
- [ ] Documentar quem são os admins e suas responsabilidades
- [ ] Configurar políticas de segurança
- [ ] Fazer backup da tabela profiles

---

## 🔗 Links Úteis

- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase CLI](https://supabase.com/docs/reference/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Pronto!** Agora você sabe como criar e gerenciar múltiplas contas de admin no Supabase. 🎉

