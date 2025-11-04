# 👤 Como Criar o Primeiro Usuário Admin no Supabase

## 🚨 Erro: "Invalid login credentials"

Este erro significa que você está tentando fazer login com credenciais que **não existem** no Supabase. Você precisa criar um usuário primeiro.

---

## ✅ Método 1: Via Dashboard do Supabase (MAIS FÁCIL)

### Passo a Passo:

1. **Acesse o Dashboard do Supabase**
   - Vá em: https://app.supabase.com
   - Selecione seu projeto: **mnjivyaztsgxaqihrqec**

2. **Navegue até Authentication**
   - No menu lateral, clique em **Authentication**
   - Depois clique em **Users**

3. **Criar Novo Usuário**
   - Clique no botão **Add User** (ou **+ Add User**)

4. **Preencha os Dados**
   - **Email**: `admin@exemplo.com` (ou seu email)
   - **Password**: Uma senha segura (mínimo 8 caracteres)
   - ✅ **Auto Confirm User**: MARQUE ESTA OPÇÃO (importante!)
   - **User Metadata** (JSON):
     ```json
     {
       "role": "admin",
       "full_name": "Seu Nome Completo"
     }
     ```

5. **Clique em "Create User"**

6. **Pronto!** O profile será criado automaticamente pelo trigger.

---

## ✅ Método 2: Via Página de Cadastro da Aplicação

1. **Acesse a página de cadastro**
   - Vá em: `http://localhost:3000/cadastro`

2. **Crie uma conta**
   - Preencha email e senha
   - Clique em "Cadastrar"

3. **Tornar Admin (Opcional)**
   - Após criar, execute este SQL no Supabase:
     ```sql
     UPDATE public.profiles
     SET role = 'admin'
     WHERE email = 'seu-email@exemplo.com';
     ```

---

## ✅ Método 3: Via SQL (Avançado)

Se você já criou um usuário e quer torná-lo admin:

```sql
-- Substitua pelo email do usuário que você criou
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

---

## 🔍 Verificar se o Usuário Foi Criado

Execute este SQL no Supabase SQL Editor:

```sql
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

Você deve ver seu usuário listado com `role = 'admin'`.

---

## ⚠️ Checklist Antes de Fazer Login

- [ ] Executou o script `setup_auth_supabase.sql`? (cria a tabela profiles)
- [ ] Executou o script `criar_todas_tabelas.sql`? (cria tabelas users, resellers, cobrancas)
- [ ] Criou o primeiro usuário admin?
- [ ] Marcou "Auto Confirm User" ao criar?
- [ ] Adicionou o User Metadata com `role: "admin"`?
- [ ] O modo demo está desabilitado? (`VITE_DEMO_MODE=false` no `.env`)

---

## 🧪 Testar o Login

1. **Acesse**: `http://localhost:3000/login`
2. **Use as credenciais** que você criou no Supabase
3. **Não use** as credenciais demo (`admin@demo.com`)
4. **Verifique** se você é redirecionado para o dashboard admin

---

## 🐛 Problemas Comuns

### "Email not confirmed"
- Vá em **Authentication** → **Users**
- Encontre seu usuário
- Clique nos três pontos (`...`) → **Confirm User**

### "User has no role"
- Execute o SQL acima para atualizar o role para `admin`

### "Profile not found"
- Verifique se executou o script `setup_auth_supabase.sql`
- O trigger deve criar o profile automaticamente

---

## 📝 Arquivo SQL Completo

Veja o arquivo `criar_usuario_admin.sql` para instruções detalhadas e scripts SQL completos.

---

## ✅ Próximos Passos

Após criar o usuário e fazer login:

1. ✅ Verifique se você está no dashboard admin
2. ✅ Teste criar um cliente
3. ✅ Teste criar um revendedor
4. ✅ Verifique se os dados aparecem no Supabase

---

**Dúvidas?** Veja também:
- `GUIA_CONFIGURACAO_AUTH_SUPABASE.md` - Guia completo de autenticação
- `setup_auth_supabase.sql` - Script SQL para configuração inicial

