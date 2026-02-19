# 🔗 WhatsApp Link Shortener - Cloudflare Worker

Sistema de links curtos em domínio próprio que redirecionam para WhatsApp com mensagens personalizadas.

## 📋 Rotas Disponíveis

| Rota | Descrição | Campanha |
|------|-----------|----------|
| `/teste` | Solicitar teste do sistema | teste-gratis |
| `/valores` | Consultar valores | consulta-precos |
| `/planos` | Conhecer planos | conhecer-planos |
| `/duvidas` | Tirar dúvidas | suporte |
| `/suporte` | Suporte técnico | suporte-tecnico |
| `/indicacao` | Indicação de amigo | programa-indicacao |
| `/promo` | Promoção ativa | promocao-ativa |

### Aliases (atalhos)
- `/t` → `/teste`
- `/v` → `/valores`
- `/p` → `/planos`

---

## 🚀 Deploy

### 1. Instalar dependências
```bash
cd workers/whatsapp-links
npm install
```

### 2. Login no Cloudflare
```bash
npx wrangler login
```

### 3. Deploy do Worker
```bash
# Desenvolvimento
npm run dev

# Produção
npm run deploy
```

---

## 🌐 Configurar Domínio

### Opção A: Subdomínio (Recomendado)

1. Acesse o **Cloudflare Dashboard** → Seu domínio → **DNS**
2. Crie um registro:
   - Tipo: `AAAA`
   - Nome: `link` (para `link.seudominio.com`)
   - IPv6: `100::`
   - Proxy: ✅ Ativado (nuvem laranja)

3. Vá em **Workers Routes** e adicione:
   - Route: `link.seudominio.com/*`
   - Worker: `whatsapp-links`

### Opção B: Custom Domain

1. No Cloudflare Dashboard → **Workers & Pages**
2. Selecione o worker `whatsapp-links`
3. Vá em **Settings** → **Triggers** → **Custom Domains**
4. Adicione: `link.seudominio.com`

---

## 🔧 Personalização

### Adicionar Nova Rota

Edite `src/index.ts` e adicione ao objeto `ROUTES`:

```typescript
"/nova-rota": {
  message: "Sua mensagem personalizada aqui",
  source: "origem",       // telegram, site, ads, etc
  campaign: "nome-campanha"
},
```

### Alterar Número do WhatsApp

No `src/index.ts`, modifique o `CONFIG`:

```typescript
const CONFIG = {
  phone: "5527996467244", // ← Altere aqui
  ...
};
```

---

## 📊 Tracking (Opcional)

### Com Cloudflare KV

1. Crie um namespace KV no dashboard
2. Descomente as linhas de KV no `wrangler.toml`
3. Descomente a função `logClick` no `src/index.ts`

### Com Analytics Engine

1. Crie um dataset no Cloudflare Analytics
2. Descomente as linhas de analytics no `wrangler.toml`
3. Descomente a função `logClick` no `src/index.ts`

---

## 📱 QR Codes

Use os links para gerar QR Codes personalizados:

- [QR Code Generator](https://www.qrcode-monkey.com/)
- Exemplo: `https://link.seudominio.com/teste`

---

## 🧪 Testar Localmente

```bash
npm run dev
```

Acesse: `http://localhost:8787/teste`

---

## 📁 Estrutura

```
workers/whatsapp-links/
├── src/
│   └── index.ts      # Código principal do Worker
├── package.json      # Dependências
├── tsconfig.json     # Config TypeScript
├── wrangler.toml     # Config Cloudflare
└── README.md         # Documentação
```

---

## 🔒 Licença

MIT © BootFlow
