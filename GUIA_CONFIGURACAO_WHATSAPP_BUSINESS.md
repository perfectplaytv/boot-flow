# 📱 Guia de Configuração - WhatsApp Business API Brasil

## 📋 Dados da API Necessários

Para conectar o WhatsApp Business através da API Brasil, você precisa dos seguintes dados:

### 1. **Bearer Token** (Token de Autenticação)
- **O que é**: Token JWT (JSON Web Token) fornecido pela API Brasil para autenticar suas requisições
- **Formato**: String que começa com `eyJ...` (exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- **Onde obter**: 
  - Acesse o painel da API Brasil (https://apibrasil.io)
  - Faça login na sua conta
  - Vá em **Configurações** > **API** > **Tokens**
  - Gere um novo token ou copie um token existente
- **Importante**: 
  - Mantenha este token seguro e não compartilhe
  - O token expira após um período determinado (verifique no painel)
  - Se o token expirar, gere um novo e atualize na configuração

### 2. **Profile ID** (ID do Perfil)
- **O que é**: Identificador único do seu perfil WhatsApp Business na API Brasil
- **Formato**: String alfanumérica (exemplo: `profile-123456` ou `123456`)
- **Onde obter**:
  - Acesse o painel da API Brasil
  - Vá em **WhatsApp** > **Perfis** ou **Profiles**
  - Selecione o perfil que deseja usar
  - Copie o **Profile ID** ou **ID do Perfil**
- **Importante**:
  - Cada perfil tem um ID único
  - Certifique-se de usar o ID correto do perfil que deseja conectar

## 🔧 Como Configurar

### Passo 1: Obter as Credenciais
1. Acesse https://apibrasil.io
2. Faça login na sua conta
3. Obtenha o **Bearer Token** em **Configurações** > **API** > **Tokens**
4. Obtenha o **Profile ID** em **WhatsApp** > **Perfis**

### Passo 2: Configurar no Sistema
1. Acesse a página **WhatsApp Business** no sistema
2. Clique no botão **Configurar**
3. No pop-up "Configurar WhatsApp Business":
   - Cole o **Bearer Token** no campo "Bearer Token"
   - Cole o **Profile ID** no campo "Profile ID"
4. Clique em **Salvar Configurações**

### Passo 3: Conectar o WhatsApp
1. Após salvar as credenciais, o QR Code será gerado automaticamente
2. Abra o WhatsApp no seu celular
3. Toque em **Menu** (☰) ou **Configurações**
4. Selecione **Dispositivos conectados**
5. Toque em **Conectar dispositivo**
6. Escaneie o QR Code exibido na tela
7. Aguarde a confirmação de conexão

## 🔄 Endpoints da API Utilizados

O sistema utiliza os seguintes endpoints da API Brasil:

### 1. **Verificar Status da Conexão**
```
GET https://gateway.apibrasil.io/api/v2/whatsapp/status
Headers:
  - Authorization: Bearer {seu_token}
  - profile-id: {seu_profile_id}
  - Content-Type: application/json
```

**Resposta de Sucesso:**
```json
{
  "connected": true,
  "status": "connected"
}
```

### 2. **Gerar QR Code**
```
POST https://gateway.apibrasil.io/api/v2/whatsapp/qr-code
Headers:
  - Authorization: Bearer {seu_token}
  - profile-id: {seu_profile_id}
  - Content-Type: application/json
Body:
{
  "type": "temporary"
}
```

**Resposta de Sucesso:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "timeout": 30000
}
```

### 3. **Enviar Mensagem**
```
POST https://gateway.apibrasil.io/api/v2/whatsapp/send-message
Headers:
  - Authorization: Bearer {seu_token}
  - profile-id: {seu_profile_id}
  - Content-Type: application/json
Body:
{
  "profileId": "{seu_profile_id}",
  "phoneNumber": "5511999999999",
  "message": "Sua mensagem aqui"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "messageId": "msg_123456",
  "status": "sent"
}
```

## ⚠️ Troubleshooting

### QR Code não aparece
- Verifique se o Bearer Token e Profile ID estão corretos
- Certifique-se de que o token não expirou
- Tente clicar em "Recarregar QR" para gerar um novo código

### WhatsApp não conecta
- Verifique se o WhatsApp no celular está atualizado
- Certifique-se de que está usando a mesma conta do WhatsApp Business
- Tente desconectar e reconectar o dispositivo
- Verifique se há conexão com a internet

### Erro de autenticação
- Verifique se o Bearer Token está correto e não expirou
- Certifique-se de que o token tem permissões para acessar a API do WhatsApp
- Gere um novo token se necessário

### Erro ao enviar mensagens
- Verifique se o WhatsApp está conectado (status "Conectado")
- Certifique-se de que o número de telefone está no formato correto (55 + DDD + número)
- Verifique se o perfil tem permissões para enviar mensagens

## 📞 Suporte

Se você tiver problemas com a configuração:

1. **API Brasil**: 
   - Documentação: https://docs.apibrasil.io
   - Suporte: suporte@apibrasil.io
   - Painel: https://apibrasil.io

2. **Sistema**:
   - Verifique os logs no console do navegador (F12)
   - Entre em contato com o suporte técnico

## 🔒 Segurança

- **Nunca compartilhe** seu Bearer Token ou Profile ID
- **Não exponha** essas credenciais em código público
- **Renove** o token periodicamente conforme recomendado pela API Brasil
- **Use HTTPS** sempre que possível para proteger as comunicações

## 📝 Notas Importantes

- O QR Code expira após um período (geralmente 30 segundos)
- Se o QR Code expirar, clique em "Recarregar QR" para gerar um novo
- A conexão é mantida enquanto o WhatsApp estiver ativo no celular
- Se desconectar o WhatsApp do celular, será necessário escanear o QR Code novamente
- O sistema verifica automaticamente o status da conexão a cada 30 segundos

