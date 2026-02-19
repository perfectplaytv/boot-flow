# AGENT TEST REPORT

_Data:_ 12 Nov 2025

## Suites Criadas
1. `tests/agent/supabase.test.agent.mjs` – valida disponibilidade da URL Supabase e teste de HEAD (ignorado sem env)
2. `tests/agent/crud.test.agent.mjs` – verifica endpoint CRUD configurável via `AGENT_CRUD_ENDPOINT`
3. `tests/agent/ui-render.test.agent.mjs` – renderização SSR do componente `AIInsightsCard` (skip quando bundle SSR não disponível)

## Execução
Executar com:
```bash
node --test tests/agent/*.mjs
```

Adaptação em pipeline: criar script `npm run agent:test` apontando para comando acima (não aplicado automaticamente para manter política de não sobrescrever arquivos).

## Observações
- Testes não falham em ambientes sem acesso supabase/tinybird (marcados como skip)
- Logs detalhados gravados via `scripts/agent/security-scan.js`
