# 🚀 Configuração Completa do Supabase - Bootflow

Este guia completo explica como configurar o Supabase para o projeto Bootflow, incluindo criação das tabelas, políticas de segurança e dados de exemplo.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Criação do Projeto Supabase](#criação-do-projeto-supabase)
3. [Execução das Migrações](#execução-das-migrações)
4. [Configuração das Políticas RLS](#configuração-das-políticas-rls)
5. [Inserção de Dados de Exemplo](#inserção-de-dados-de-exemplo)
6. [Configuração da Aplicação](#configuração-da-aplicação)
7. [Testes e Validação](#testes-e-validação)

## 🔧 Pré-requisitos

- Conta no Supabase ([supabase.com](https://supabase.com))
- Projeto Supabase criado
- Acesso ao SQL Editor do Supabase

## 🏗️ Criação do Projeto Supabase

### 1. Criar Novo Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Escolha sua organização
4. Digite um nome para o projeto (ex: "bootflow")
5. Digite uma senha forte para o banco de dados
6. Escolha uma região próxima
7. Clique em **"Create new project"**

### 2. Aguardar Configuração
- O projeto levará alguns minutos para ser configurado
- Aguarde até que o status fique verde

## 📊 Execução das Migrações

### Passo 1: Executar Schema Inicial

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **"New Query"**
3. Copie e cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
4. Clique em **"Run"**

**Resultado esperado:**
- ✅ 4 tabelas criadas (users, resellers, cobrancas, auth_users)
- ✅ Índices criados
- ✅ Triggers configurados
- ✅ Views criadas

### Passo 2: Executar Políticas RLS

1. Crie uma nova query no SQL Editor
2. Copie e cole o conteúdo do arquivo `supabase/migrations/002_rls_policies.sql`
3. Clique em **"Run"**

**Resultado esperado:**
- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas de segurança criadas
- ✅ Controle de acesso configurado

## 🔒 Configuração das Políticas RLS

As políticas criadas garantem:

### **Usuários (users)**
- Usuários veem apenas seus próprios dados
- Admins veem e gerenciam todos os usuários

### **Revendedores (resellers)**
- Revendedores veem apenas seus próprios dados
- Admins gerenciam todos os revendedores

### **Cobranças (cobrancas)**
- Usuários veem cobranças relacionadas ao seu email
- Admins gerenciam todas as cobranças

### **Usuários de Autenticação (auth_users)**
- Usuários veem apenas seus próprios dados
- Admins gerenciam todos os dados

## 📝 Inserção de Dados de Exemplo

### Passo 3: Inserir Dados de Teste

1. Crie uma nova query no SQL Editor
2. Copie e cole o conteúdo do arquivo `supabase/seed_data.sql`
3. Clique em **"Run"**

**Dados inseridos:**
- ✅ 5 usuários de exemplo
- ✅ 4 revendedores de exemplo
- ✅ 7 cobranças de exemplo

## ⚙️ Configuração da Aplicação

### 1. Obter Credenciais do Supabase

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie as seguintes informações:
   - **Project URL**
   - **anon public** (chave anônima)

### 2. Configurar Variáveis de Ambiente

No Vercel ou seu ambiente de desenvolvimento, configure:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Atualizar Tipos TypeScript

Execute no terminal do projeto:

```bash
npx supabase gen types typescript --project-id seu_project_id > src/integrations/supabase/types.ts
```

## 👤 Criar Usuário Admin

### Passo 4: Configurar Primeiro Admin

1. **Registre um usuário** através da interface da aplicação (`/auth`)
2. **Execute o SQL** para torná-lo admin:

```sql
-- Substitua 'EMAIL_DO_USUARIO' pelo email registrado
UPDATE public.auth_users 
SET role = 'admin' 
WHERE id = (
    SELECT id FROM auth.users 
    WHERE email = 'EMAIL_DO_USUARIO'
);
```

## 🧪 Testes e Validação

### 1. Testar Autenticação

1. Acesse `/auth` na aplicação
2. Registre um novo usuário
3. Faça login/logout
4. Verifique se a sessão persiste

### 2. Testar Operações CRUD

1. **Usuários:**
   - Listar usuários (apenas admin)
   - Adicionar usuário
   - Editar usuário
   - Deletar usuário

2. **Cobranças:**
   - Listar cobranças
   - Adicionar cobrança
   - Editar cobrança
   - Deletar cobrança

3. **Revendedores:**
   - Listar revendedores
   - Adicionar revendedor
   - Editar revendedor
   - Deletar revendedor

### 3. Testar Políticas de Segurança

1. **Login como usuário comum:**
   - Deve ver apenas seus próprios dados
   - Não deve acessar dados de outros usuários

2. **Login como admin:**
   - Deve ver todos os dados
   - Deve poder gerenciar todos os registros

## 📊 Verificar Views e Estatísticas

Execute no SQL Editor para verificar as views:

```sql
-- Estatísticas de usuários
SELECT * FROM public.user_stats;

-- Estatísticas de cobranças
SELECT * FROM public.charge_stats;
```

## 🔍 Troubleshooting

### **Erro: "relation already exists"**
```sql
-- Remover tabelas existentes (CUIDADO!)
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.resellers CASCADE;
DROP TABLE IF EXISTS public.cobrancas CASCADE;
DROP TABLE IF EXISTS public.auth_users CASCADE;
```

### **Erro: "policy already exists"**
```sql
-- Remover políticas existentes
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
-- Repetir para outras políticas...
```

### **Erro de conexão**
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique se a URL e chave estão corretas

### **Erro de permissão**
- Verifique se o usuário tem papel de admin
- Confirme se as políticas RLS estão ativas
- Verifique se está logado corretamente

## 📈 Monitoramento

### 1. Dashboard do Supabase
- **Database:** Monitore consultas e performance
- **Auth:** Acompanhe registros e logins
- **Logs:** Verifique erros e atividades

### 2. Métricas Importantes
- Número de usuários ativos
- Taxa de conversão de pagamentos
- Performance das consultas
- Erros de autenticação

## 🎯 Próximos Passos

### 1. Configurações Avançadas
- [ ] Configurar autenticação social (Google, Facebook)
- [ ] Implementar notificações em tempo real
- [ ] Configurar backup automático
- [ ] Implementar rate limiting

### 2. Funcionalidades Adicionais
- [ ] Upload de arquivos com Supabase Storage
- [ ] Notificações push
- [ ] Relatórios avançados
- [ ] Integração com gateways de pagamento

### 3. Segurança
- [ ] Configurar 2FA
- [ ] Implementar auditoria de logs
- [ ] Configurar backup de segurança
- [ ] Implementar monitoramento de segurança

## 📞 Suporte

Se encontrar problemas:

1. **Verifique os logs** no dashboard do Supabase
2. **Consulte a documentação** oficial do Supabase
3. **Teste em ambiente de desenvolvimento** primeiro
4. **Faça backup** antes de alterações em produção

## ✅ Checklist de Configuração

- [ ] Projeto Supabase criado
- [ ] Schema inicial executado
- [ ] Políticas RLS configuradas
- [ ] Dados de exemplo inseridos
- [ ] Variáveis de ambiente configuradas
- [ ] Usuário admin criado
- [ ] Autenticação testada
- [ ] Operações CRUD testadas
- [ ] Políticas de segurança validadas
- [ ] Views e estatísticas funcionando

**🎉 Parabéns! Seu Supabase está configurado e pronto para uso!** 