# 🔑 Guia: Como Obter Credenciais de Teste - API Brasil

## 📍 Onde Encontrar as Credenciais

### ⚠️ **IMPORTANTE**: 
O repositório [apigratis-exemplos](https://github.com/APIBrasil/apigratis-exemplos) **NÃO contém credenciais de teste**. Ele apenas mostra **exemplos de código** de como usar a API.

As credenciais precisam ser obtidas diretamente no site oficial da API Brasil.

---

## 🚀 Passo a Passo para Obter Credenciais

### **1. Criar Conta na API Brasil**

1. Acesse o site oficial: **https://apibrasil.com.br**
2. Clique em **"Cadastrar"** ou **"Criar Conta"**
3. Preencha os dados necessários:
   - Email
   - Senha
   - Nome completo
   - Outros dados solicitados

### **2. Fazer Login no Painel**

1. Após criar a conta, faça login em: **https://apibrasil.io** ou **https://apibrasil.com.br**
2. Você será redirecionado para o **Painel de Controle**

### **3. Obter o Bearer Token**

1. No painel, vá em:
   - **Configurações** → **API** → **Tokens**
   - Ou **API** → **Tokens**
   - Ou **Developer** → **API Keys**

2. Você verá opções para:
   - **Gerar novo token**
   - **Ver tokens existentes**
   - **Copiar token**

3. O token terá formato similar a:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaml2eWF6dHNneGFxaWhycWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzk1MzIsImV4cCI6MjA3Nzg1NTUzMn0.TDtX3vbrQXtECUqsyrUiGN81fUOYpAK7WRpOEk1acR8
   ```

4. **Copie o token** e guarde em local seguro

### **4. Obter o Profile ID (Para WhatsApp)**

1. No painel, vá em:
   - **WhatsApp** → **Perfis**
   - Ou **WhatsApp** → **Profiles**
   - Ou **Integrações** → **WhatsApp**

2. Você verá uma lista de perfis ou opção para criar um novo perfil

3. Se não tiver perfil:
   - Clique em **"Criar Perfil"** ou **"Novo Perfil"**
   - Preencha os dados necessários
   - Aguarde a criação

4. Após criar/selecionar o perfil:
   - Você verá o **Profile ID** (exemplo: `profile-123456` ou `123456`)
   - **Copie o Profile ID**

---

## 🧪 Credenciais de Teste vs Produção

### **Ambiente de Teste (Sandbox)**

Algumas APIs oferecem ambiente de teste. Para a API Brasil:

1. **Verifique no painel** se há opção de **"Modo Teste"** ou **"Sandbox"**
2. Algumas APIs têm:
   - **Credenciais de Teste** (limitadas, sem custo)
   - **Credenciais de Produção** (com custo por uso)

3. **Se houver ambiente de teste:**
   - Use as credenciais de teste para desenvolvimento
   - Use as credenciais de produção apenas quando estiver pronto

### **Limites de Teste**

- ⚠️ Credenciais de teste geralmente têm:
  - Limite de requisições por dia/mês
  - Funcionalidades limitadas
  - Dados fictícios ou de exemplo

---

## 📚 Exemplos de Código

O repositório [apigratis-exemplos](https://github.com/APIBrasil/apigratis-exemplos) contém exemplos em várias linguagens:

### **Estrutura do Repositório:**

```
apigratis-exemplos/
├── whatsapp/          # Exemplos para WhatsApp
├── python/            # Exemplos em Python
├── javascript/        # Exemplos em JavaScript/Node.js
├── php/              # Exemplos em PHP
└── ...
```

### **Exemplo de Uso (JavaScript/TypeScript):**

```typescript
// Substitua pelas suas credenciais reais
const BEARER_TOKEN = 'seu_token_aqui';
const PROFILE_ID = 'seu_profile_id_aqui';

// Exemplo de requisição
const response = await fetch('https://gateway.apibrasil.io/api/v2/whatsapp/status', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'profile-id': PROFILE_ID,
    'Content-Type': 'application/json',
  },
});
```

---

## 🔍 Onde Procurar no Repositório

### **1. README.md**
- 📄 Local: Raiz do repositório
- 📝 Contém: Links para exemplos e instruções gerais
- ⚠️ **NÃO contém credenciais**

### **2. Pasta `/whatsapp`**
- 📁 Local: `apigratis-exemplos/whatsapp/`
- 📝 Contém: Exemplos específicos para WhatsApp
- ⚠️ **NÃO contém credenciais**, apenas código de exemplo

### **3. Arquivos de Configuração**
- Alguns exemplos podem ter arquivos `.env.example` ou `config.example`
- Estes mostram **onde** colocar as credenciais, mas **não as credenciais em si**

---

## 🆘 Não Encontrou as Credenciais?

### **Soluções:**

1. **Verifique seu Email:**
   - Após criar a conta, verifique se recebeu email com instruções
   - Algumas APIs enviam credenciais por email

2. **Contate o Suporte:**
   - Email: Verifique no site da API Brasil
   - WhatsApp: Pode haver grupo de suporte
   - Telegram: Pode haver canal de suporte

3. **Documentação Oficial:**
   - Acesse: https://apibrasil.com.br/docs (se disponível)
   - Procure por "Getting Started" ou "Primeiros Passos"

4. **Grupos de Comunidade:**
   - O README menciona grupos no WhatsApp e Telegram
   - Participe e peça ajuda lá

---

## ✅ Checklist de Verificação

Antes de usar as credenciais, verifique:

- [ ] Conta criada na API Brasil
- [ ] Login realizado com sucesso
- [ ] Bearer Token obtido e copiado
- [ ] Profile ID obtido (se usar WhatsApp)
- [ ] Credenciais testadas em ambiente de desenvolvimento
- [ ] Credenciais guardadas em local seguro (não commitar no Git!)

---

## 🔐 Segurança das Credenciais

### **⚠️ NUNCA:**

- ❌ Commitar credenciais no Git
- ❌ Compartilhar credenciais publicamente
- ❌ Enviar credenciais por email não criptografado
- ❌ Deixar credenciais em código fonte público

### **✅ SEMPRE:**

- ✅ Usar variáveis de ambiente (`.env`)
- ✅ Adicionar `.env` ao `.gitignore`
- ✅ Usar credenciais diferentes para teste e produção
- ✅ Rotacionar tokens periodicamente
- ✅ Revogar tokens não utilizados

---

## 📝 Exemplo de `.env` para o Projeto

Crie um arquivo `.env` na raiz do projeto:

```env
# API Brasil - WhatsApp
VITE_APIBRASIL_BEARER_TOKEN=seu_bearer_token_aqui
VITE_APIBRASIL_PROFILE_ID=seu_profile_id_aqui
VITE_APIBRASIL_URL=https://gateway.apibrasil.io/api/v2/whatsapp

# Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_supabase
```

**⚠️ IMPORTANTE**: Adicione `.env` ao `.gitignore` para não commitar!

---

## 🔗 Links Úteis

- **Site Oficial**: https://apibrasil.com.br
- **Painel de Controle**: https://apibrasil.io
- **Repositório de Exemplos**: https://github.com/APIBrasil/apigratis-exemplos
- **Documentação**: Verifique no site oficial

---

## 📞 Suporte

Se precisar de ajuda:

1. **Grupos de Comunidade** (mencionados no README):
   - WhatsApp Group
   - Telegram Group

2. **Suporte Oficial**:
   - Verifique no site da API Brasil
   - Procure por "Contato" ou "Suporte"

---

**Última atualização**: 2025-01-15

**Lembre-se**: As credenciais são pessoais e confidenciais. Não as compartilhe!

