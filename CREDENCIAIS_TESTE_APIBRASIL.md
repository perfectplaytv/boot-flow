# 🔑 Credenciais de Teste - API Brasil (Mock)

## 📋 Credenciais Fictícias para Testes

Este documento contém credenciais **fictícias** criadas para permitir testes locais sem precisar de credenciais reais da API Brasil.

### ⚠️ **IMPORTANTE**
- ✅ Estas credenciais funcionam **apenas em modo de teste/mock**
- ❌ **NÃO funcionam** com a API real da API Brasil
- 🧪 Use apenas para desenvolvimento e testes locais
- 🔒 Para produção, você precisa de credenciais reais da API Brasil

---

## 🔑 Credenciais de Teste

### **Bearer Token (Token de Autenticação)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQnJhc2lsIC0gTW9jayIsInVzZXJJZCI6InRlc3QtdXNlci0xMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.MOCK_TOKEN_FOR_TESTING_ONLY
```

### **Profile ID (ID do Perfil)**
```
profile-test-123456
```

### **Device Token (Opcional)**
```
mock-device-token-12345
```

### **Device Password (Opcional)**
```
mock-password-123
```

### **Phone Number (Número de Teste)**
```
+5511999999999
```

---

## 🚀 Como Usar

### **Opção 1: Ativar Modo Mock via Variável de Ambiente**

1. Crie ou edite o arquivo `.env` na raiz do projeto:
```env
# Ativar modo mock da API Brasil
VITE_USE_API_MOCK=true

# Credenciais de teste (opcional - já estão no código)
VITE_APIBRASIL_BEARER_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQnJhc2lsIC0gTW9jayIsInVzZXJJZCI6InRlc3QtdXNlci0xMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.MOCK_TOKEN_FOR_TESTING_ONLY
VITE_APIBRASIL_PROFILE_ID=profile-test-123456
```

2. Reinicie o servidor:
```bash
npm run dev
```

### **Opção 2: Ativar Modo Mock via LocalStorage**

1. Abra o console do navegador (F12)
2. Execute:
```javascript
localStorage.setItem('useApiBrasilMock', 'true');
```
3. Recarregue a página (F5)

### **Opção 3: Usar no Sistema**

1. Acesse a página **"WhatsApp Business"**
2. Clique em **"Configurar"**
3. Cole as credenciais de teste:
   - **Bearer Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQnJhc2lsIC0gTW9jayIsInVzZXJJZCI6InRlc3QtdXNlci0xMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.MOCK_TOKEN_FOR_TESTING_ONLY`
   - **Profile ID**: `profile-test-123456`
4. Clique em **"Salvar Configurações"**

---

## 🧪 O Que Funciona no Modo Mock

### ✅ **Funcionalidades Simuladas:**

1. **Verificar Status de Conexão**
   - ✅ Retorna status simulado
   - ✅ Pode simular conexão conectada/desconectada

2. **Gerar QR Code**
   - ✅ Gera um QR Code fictício (imagem 1x1 pixel)
   - ✅ Simula timeout de 60 segundos

3. **Enviar Mensagem**
   - ✅ Simula envio de mensagem
   - ✅ Retorna sucesso (mas não envia mensagem real)
   - ✅ Loga no console para debug

4. **Conectar WhatsApp**
   - ✅ Simula conexão bem-sucedida
   - ✅ Atualiza status para "conectado"

5. **Desconectar WhatsApp**
   - ✅ Simula desconexão
   - ✅ Atualiza status para "desconectado"

6. **Enviar Template**
   - ✅ Simula envio de template
   - ✅ Retorna sucesso

---

## 🔍 Como Verificar se Está em Modo Mock

### **No Console do Navegador:**

1. Abra o console (F12)
2. Procure por mensagens:
   - `⚠️ [MODO TESTE] API Brasil está sendo simulada`
   - `📱 [MOCK] Mensagem enviada:`
   - `💡 Para usar a API real, desative o modo mock`

### **Verificar Variáveis:**

```javascript
// Verificar se modo mock está ativo
console.log('Modo Mock:', localStorage.getItem('useApiBrasilMock'));
console.log('Env Mock:', import.meta.env.VITE_USE_API_MOCK);
```

---

## 🚫 Desativar Modo Mock

### **Para Usar API Real:**

1. **Remova ou desative no `.env`:**
```env
VITE_USE_API_MOCK=false
```

2. **Ou remova do localStorage:**
```javascript
localStorage.removeItem('useApiBrasilMock');
```

3. **Use credenciais reais da API Brasil:**
   - Obtenha no site: https://apibrasil.com.br
   - Veja: `GUIA_CREDENCIAIS_TESTE_APIBRASIL.md`

---

## 📝 Exemplo de Uso

### **1. Configurar no Sistema:**

```
Bearer Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQnJhc2lsIC0gTW9jayIsInVzZXJJZCI6InRlc3QtdXNlci0xMjM0NTYiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OX0.MOCK_TOKEN_FOR_TESTING_ONLY

Profile ID: profile-test-123456
```

### **2. Testar Funcionalidades:**

- ✅ Verificar status → Retorna status simulado
- ✅ Gerar QR Code → Gera QR Code fictício
- ✅ Enviar mensagem → Simula envio (não envia real)
- ✅ Conectar → Simula conexão

---

## ⚠️ Limitações do Modo Mock

### **O que NÃO funciona:**

- ❌ Não envia mensagens reais
- ❌ Não conecta WhatsApp real
- ❌ Não gera QR Code real
- ❌ Não verifica status real
- ❌ Não tem limite de requisições
- ❌ Não tem custo

### **O que funciona:**

- ✅ Testa a interface do sistema
- ✅ Testa o fluxo de integração
- ✅ Testa tratamento de erros
- ✅ Testa validações
- ✅ Desenvolvimento sem custo

---

## 🔐 Segurança

### **⚠️ NUNCA:**

- ❌ Usar credenciais de teste em produção
- ❌ Commitar credenciais reais no Git
- ❌ Compartilhar credenciais reais

### **✅ SEMPRE:**

- ✅ Usar modo mock apenas para desenvolvimento
- ✅ Usar credenciais reais apenas em produção
- ✅ Manter credenciais reais em variáveis de ambiente seguras

---

## 📚 Arquivos Relacionados

- `src/services/apiBrasilMockService.ts` - Serviço mock
- `src/services/apiBrasilService.ts` - Serviço real
- `GUIA_CREDENCIAIS_TESTE_APIBRASIL.md` - Como obter credenciais reais

---

## 🆘 Problemas Comuns

### **Modo mock não está funcionando:**

1. Verifique se ativou corretamente:
   ```javascript
   localStorage.setItem('useApiBrasilMock', 'true');
   ```

2. Verifique o console para erros

3. Reinicie o servidor se mudou o `.env`

### **Quer usar API real mas está em modo mock:**

1. Desative o modo mock:
   ```javascript
   localStorage.removeItem('useApiBrasilMock');
   ```

2. Configure credenciais reais no sistema

---

**Última atualização**: 2025-01-15

**Lembre-se**: Estas credenciais são apenas para testes locais!

