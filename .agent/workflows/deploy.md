---
description: Deploy manual para o Cloudflare Pages
---

# Deploy Manual Cloudflare

Este workflow realiza o build e o deploy manual da aplicação para o Cloudflare Pages.
Útil quando a integração automática com o Git não está funcionando.

## Passos

1. Build da aplicação:
```bash
npm run build
```

2. Deploy para o Cloudflare:
```bash
npx wrangler pages deploy dist --project-name=bootflow
```

**Comando combinado (Turbo):**
// turbo
```bash
npm run build && npx wrangler pages deploy dist --project-name=bootflow
```
