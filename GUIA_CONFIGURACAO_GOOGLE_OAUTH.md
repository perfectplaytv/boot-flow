# Guia de Configuração: Login com Google (OAuth)

Este guia explica como configurar o login com Google usando OAuth no Supabase.

## 📋 Pré-requisitos

1. Conta no Google Cloud Platform (GCP)
2. Projeto Supabase configurado
3. Acesso ao painel do Supabase

## 🔧 Passo 1: Criar Credenciais OAuth no Google Cloud Platform

### 1.1 Acessar o Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione ou crie um projeto
3. Vá em **APIs & Services** → **Credentials**

### 1.2 Criar OAuth 2.0 Client ID

1. Clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Se ainda não tiver configurado a tela de consentimento OAuth:
   - Clique em **CONFIGURE CONSENT SCREEN**
   - Selecione **External** (ou Internal se usar Google Workspace)
   - Preencha as informações obrigatórias:
     - **App name**: Nome da sua aplicação
     - **User support email**: Seu email
     - **Developer contact information**: Seu email
   - Clique em **SAVE AND CONTINUE**
   - Nas **Scopes**, clique em **SAVE AND CONTINUE**
   - Adicione usuários de teste (se necessário) e clique em **SAVE AND CONTINUE**
   - Revise e clique em **BACK TO DASHBOARD**

3. Volte para **Credentials** e clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Configure:
   - **Application type**: Web application
   - **Name**: Nome descritivo (ex: "Bootflow Web App")
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://localhost:5173
     https://seu-dominio.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://[SEU-PROJETO-ID].supabase.co/auth/v1/callback
     ```
     > **Importante**: Substitua `[SEU-PROJETO-ID]` pelo ID do seu projeto Supabase. Você encontra isso na URL do seu projeto Supabase (ex: `https://mnjivyaztsgxaqihrqec.supabase.co`)

5. Clique em **CREATE**
6. **Copie o Client ID e Client Secret** (você precisará deles no próximo passo)

## 🔧 Passo 2: Configurar Google OAuth no Supabase

### 2.1 Acessar Configurações de Autenticação

1. Acesse: https://app.supabase.com/
2. Selecione seu projeto
3. Vá em **Authentication** → **Providers**

### 2.2 Habilitar Google Provider

1. Role até encontrar **Google** na lista de providers
2. Clique no toggle para **habilitar** o Google provider
3. Preencha os campos:
   - **Client ID (for OAuth)**: Cole o Client ID copiado do Google Cloud Console
   - **Client Secret (for OAuth)**: Cole o Client Secret copiado do Google Cloud Console
4. (Opcional) Configure **Authorized Client IDs** se necessário
5. Clique em **Save**

### 2.3 Configurar URL de Redirecionamento

1. No Supabase, vá em **Authentication** → **URL Configuration**
2. Adicione as URLs permitidas:
   - **Site URL**: `http://localhost:3000` (ou sua URL de produção)
   - **Redirect URLs**: 
     ```
     http://localhost:3000/auth/callback
     https://seu-dominio.com/auth/callback
     ```

## 🔧 Passo 3: Verificar Configuração no Código

O código já está configurado para usar o Google OAuth. Verifique se:

1. ✅ A função `signInWithGoogle` está implementada no `AuthContext.tsx`
2. ✅ O botão "Entrar com Google" está conectado no `Login.tsx`
3. ✅ A rota `/auth/callback` está configurada no `App.tsx`
4. ✅ A página `AuthCallback.tsx` existe e processa o callback

## 🧪 Testar o Login com Google

### 3.1 Teste Local

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse: http://localhost:3000/login

3. Clique no botão **"Entrar com Google"**

4. Você será redirecionado para o Google para autorizar

5. Após autorizar, será redirecionado de volta para `/auth/callback`

6. O sistema criará automaticamente um perfil para o usuário (se for o primeiro login)

### 3.2 Verificar no Supabase

1. Acesse: **Authentication** → **Users**
2. Você deve ver o novo usuário criado via Google OAuth
3. Verifique se o perfil foi criado em **Table Editor** → **profiles**

## ⚠️ Solução de Problemas

### Erro: "redirect_uri_mismatch"

**Causa**: A URL de redirecionamento no Google Cloud Console não corresponde à URL configurada no Supabase.

**Solução**:
1. Verifique a URL de redirecionamento no Google Cloud Console:
   ```
   https://[SEU-PROJETO-ID].supabase.co/auth/v1/callback
   ```
2. Certifique-se de que está exatamente igual (sem barra no final, sem espaços)

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos no Supabase.

**Solução**:
1. Verifique se copiou corretamente o Client ID e Client Secret do Google Cloud Console
2. Certifique-se de que não há espaços extras ao colar
3. Salve novamente no Supabase

### Erro: "OAuth provider not enabled"

**Causa**: O provider Google não está habilitado no Supabase.

**Solução**:
1. Vá em **Authentication** → **Providers**
2. Certifique-se de que o toggle do Google está **habilitado**
3. Salve as configurações

### Usuário não é redirecionado após login

**Causa**: Problema com a rota de callback ou com o `onAuthStateChange`.

**Solução**:
1. Verifique se a rota `/auth/callback` está configurada no `App.tsx`
2. Verifique os logs do console do navegador
3. Verifique se o `AuthContext` está processando o evento `SIGNED_IN` corretamente

### Perfil não é criado automaticamente

**Causa**: Erro ao criar o perfil na tabela `profiles`.

**Solução**:
1. Verifique se a tabela `profiles` existe no Supabase
2. Verifique as políticas RLS (Row Level Security) da tabela `profiles`
3. Certifique-se de que usuários autenticados podem inserir na tabela `profiles`

## 📝 Notas Importantes

1. **Primeiro Login**: Quando um usuário faz login com Google pela primeira vez, o sistema cria automaticamente um perfil com role `'client'`. Você pode atualizar o role manualmente no Supabase se necessário.

2. **URLs de Produção**: Quando fizer deploy em produção, certifique-se de:
   - Adicionar a URL de produção no Google Cloud Console
   - Adicionar a URL de produção no Supabase (URL Configuration)
   - Atualizar a variável `redirectTo` no código se necessário

3. **Segurança**: 
   - Nunca exponha o Client Secret no código frontend
   - Use variáveis de ambiente para configurações sensíveis
   - Mantenha as URLs de redirecionamento atualizadas

## 🔗 Links Úteis

- [Documentação Supabase OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## ✅ Checklist Final

- [ ] Credenciais OAuth criadas no Google Cloud Console
- [ ] URLs de redirecionamento configuradas no Google Cloud Console
- [ ] Google provider habilitado no Supabase
- [ ] Client ID e Client Secret configurados no Supabase
- [ ] URLs de redirecionamento configuradas no Supabase
- [ ] Rota `/auth/callback` configurada no App.tsx
- [ ] Teste de login com Google funcionando
- [ ] Perfil sendo criado automaticamente para novos usuários

---

**Pronto!** Agora você pode usar o login com Google na sua aplicação. 🎉

