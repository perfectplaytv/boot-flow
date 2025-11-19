# 📧 Guia de Configuração do Formspree

## 🎯 O que é o Formspree?

O [Formspree](https://formspree.io/) é um serviço gratuito que permite enviar emails diretamente do seu site sem precisar de backend ou servidor. É perfeito para formulários de contato.

---

## 📋 Passo a Passo Completo

### 1️⃣ Criar Conta no Formspree

1. Acesse: https://formspree.io/
2. Clique em **"Get started"** (canto superior direito)
3. Crie uma conta gratuita (pode usar Google, GitHub ou email)

### 2️⃣ Criar um Novo Formulário

1. Após fazer login, você verá o dashboard
2. Clique em **"New Form"** ou **"Create Form"**
3. Preencha:
   - **Form Name**: `BootFlow - Formulário de Contato` (ou qualquer nome)
   - **Email to receive submissions**: `suporte@bootflow.com.br`
   - Clique em **"Create Form"**

### 3️⃣ Obter o Form ID

1. Após criar o formulário, você verá uma página com o código HTML
2. Procure por algo assim:
   ```
   https://formspree.io/f/xxxxxxxxxx
   ```
3. O **Form ID** é a parte após `/f/` (exemplo: `mknqwerty`)

### 4️⃣ Configurar o Formulário

1. No dashboard do Formspree, clique no formulário criado
2. Vá em **"Settings"** ou **"Configurações"**
3. Configure:
   - ✅ **Email Notifications**: Ativado
   - ✅ **Auto-responder**: Opcional (pode ativar se quiser)
   - ✅ **Spam Protection**: Ativado (recomendado)

### 5️⃣ Configurar no Projeto

1. Crie um arquivo `.env` na raiz do projeto (se não existir)
2. Adicione a seguinte linha:
   ```env
   VITE_FORMSPREE_ID=seu_form_id_aqui
   ```
   
   **Exemplo:**
   ```env
   VITE_FORMSPREE_ID=mknqwerty
   ```

3. **Importante**: Reinicie o servidor de desenvolvimento após criar/editar o `.env`:
   ```bash
   # Pare o servidor (Ctrl+C) e inicie novamente
   npm run dev
   ```

### 6️⃣ Testar o Formulário

1. Preencha o formulário na landing page
2. Clique em "Enviar"
3. Verifique:
   - ✅ O email deve chegar em `suporte@bootflow.com.br`
   - ✅ Você verá a submissão no dashboard do Formspree
   - ✅ Não deve abrir o cliente de email

---

## 🔧 Configurações Avançadas (Opcional)

### Personalizar Email de Notificação

1. No Formspree, vá em **"Settings"** → **"Email Notifications"**
2. Clique em **"Customize Email Template"**
3. Personalize o template conforme necessário

### Adicionar Auto-responder

1. Vá em **"Settings"** → **"Auto-responder"**
2. Ative o auto-responder
3. Escreva uma mensagem de confirmação para o usuário

### Configurar Integrações

O Formspree permite integrar com:
- Google Sheets
- Slack
- Zapier
- Webhooks
- E muitos outros

Acesse **"Settings"** → **"Integrations"** para configurar.

---

## 📊 Limites do Plano Gratuito

- ✅ **50 submissões por mês** (suficiente para começar)
- ✅ Email notifications
- ✅ Spam protection
- ✅ Formspree Inbox (visualizar submissões)
- ❌ Sem webhooks
- ❌ Sem integrações avançadas

**Para mais submissões**, considere o plano pago.

---

## 🐛 Solução de Problemas

### Erro: "Form ID não encontrado"
- Verifique se o `VITE_FORMSPREE_ID` está correto no `.env`
- Certifique-se de reiniciar o servidor após editar o `.env`

### Email não está chegando
- Verifique a pasta de spam
- Confirme que o email está correto nas configurações do Formspree
- Verifique os logs no dashboard do Formspree

### Erro de CORS
- O Formspree já está configurado para aceitar requisições do seu domínio
- Se estiver em desenvolvimento local, não deve haver problemas

---

## ✅ Checklist de Configuração

- [ ] Conta criada no Formspree
- [ ] Formulário criado
- [ ] Form ID copiado
- [ ] Variável `VITE_FORMSPREE_ID` adicionada no `.env`
- [ ] Servidor reiniciado
- [ ] Formulário testado
- [ ] Email recebido com sucesso

---

## 📝 Exemplo de Arquivo .env

```env
# Formspree Configuration
VITE_FORMSPREE_ID=mknqwerty

# Outras variáveis (se houver)
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_key_aqui
```

---

## 🔗 Links Úteis

- **Formspree Dashboard**: https://formspree.io/forms
- **Documentação**: https://formspree.io/guides
- **Status do Serviço**: https://status.formspree.io/

---

## 💡 Dica

Se você quiser usar um email diferente do `suporte@bootflow.com.br`, basta alterar nas configurações do Formspree. O código já está preparado para enviar para qualquer email configurado no Formspree.

