# Telegram Member Extractor Service

Serviço Python para extrair membros de grupos do Telegram usando a API MTProto (Telethon).

## 🚀 Deploy no Railway

### 1. Obter Credenciais do Telegram

1. Acesse [my.telegram.org](https://my.telegram.org)
2. Faça login com seu número de telefone
3. Clique em **"API Development Tools"**
4. Crie um novo aplicativo:
   - App title: `BootFlow Telegram`
   - Short name: `bootflow`
5. Anote o **API_ID** e **API_HASH**

### 2. Deploy no Railway

1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha seu repositório `boot-flow`
5. Na configuração, defina:
   - **Root Directory**: `telegram-service`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```
TELEGRAM_API_ID=seu_api_id_aqui
TELEGRAM_API_HASH=seu_api_hash_aqui
```

### 4. Obter URL do Serviço

Após o deploy, o Railway fornecerá uma URL como:
```
https://telegram-service-production-xxxx.up.railway.app
```

### 5. Configurar no BootFlow

Adicione a URL do Railway no seu `.env`:
```
VITE_TELEGRAM_API_URL=https://telegram-service-production-xxxx.up.railway.app
```

---

## 📡 Endpoints da API

### GET /
Informações do serviço.

### GET /health
Health check.

### GET /session-status
Verifica se há uma sessão ativa.

### POST /login
Inicia o processo de login.
```json
{
  "phone": "+5511999999999"
}
```

### POST /verify
Verifica o código recebido.
```json
{
  "code": "12345"
}
```

### POST /extract-members
Extrai membros de um grupo.
```json
{
  "group_link": "https://t.me/meugrupo"
}
```

**Resposta:**
```json
{
  "success": true,
  "group": "meugrupo",
  "total_members": 150,
  "members": [
    {
      "id": "123456789",
      "username": "joao123",
      "first_name": "João",
      "last_name": "Silva",
      "phone": "+5511999999999",
      "is_bot": false
    }
  ]
}
```

### POST /logout
Encerra a sessão.

---

## ⚠️ Importante

1. **Primeira vez**: Você precisa fazer login via `/login` e `/verify`
2. **Sessão persistente**: Após o primeiro login, a sessão fica salva
3. **Rate limits**: O Telegram pode limitar requisições frequentes
4. **Grupos privados**: Você precisa ser membro do grupo para extrair
5. **Permissões**: Alguns grupos só permitem admins verem a lista completa

---

## 🧪 Testar Localmente

```bash
cd telegram-service
pip install -r requirements.txt

# Criar arquivo .env
echo "TELEGRAM_API_ID=seu_id" > .env
echo "TELEGRAM_API_HASH=seu_hash" >> .env

# Rodar
python main.py
```

Acesse: http://localhost:8000
