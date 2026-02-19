# Feature Set 2025 – Bootflow Agent

| Categoria | Entrega |
|-----------|---------|
| Infra Supabase | `supabaseClient.agent.ts`, hook realtime + edge cache |
| ORM | `db/drizzle.agent.ts` com logging e connection pooling |
| IA | Cliente 2025 (`aiClient.agent.ts`), hook `useAIInsights`, componente `AIInsightsCard` |
| UI/UX | Palette de comandos, realtime chart, theme switcher, skeletons |
| Observabilidade | Logger modular, integração passiva Vercel Analytics + Tinybird |
| PWA | Manifesto dedicado + service worker offline |
| Segurança | Security scan script, documentação e logs dedicados |
| Testes | Suites `node:test` para Supabase, CRUD e renderização |

## Estrutura Criada
```
api/
  ai/insights.agent.ts
  edge-cache.agent.ts
components/agent/
  AIInsightsCard.agent.tsx
  CommandPalette.agent.tsx
  LoadingSkeleton.agent.tsx
  RealtimeChart.agent.tsx
  ThemeSwitcher.agent.tsx
hooks/
  useAIInsights.agent.ts
  useEdgeSync.agent.ts
  useKeyboardShortcuts.agent.ts
  useRealtime.agent.ts
  useToastFeedback.agent.ts
  useVoiceCommands.agent.ts
lib/
  aiClient.agent.ts
  logger.agent.ts
  observability.agent.ts
  supabaseClient.agent.ts
public/
  manifest.agent.json
  service-worker.agent.js
scripts/agent/security-scan.js
tests/agent/*.mjs
logs/agent/
```

## Requisitos de Configuração
- Preencher `.env.agent.template` (manual) com chaves Supabase, OpenAI, Tinybird
- Registrar novos assets no `index.html` (service worker / manifest) quando for ativar em produção
- Instalar opcionalmente `@vercel/analytics` para rastreamento real

## Compatibilidade
Todos os arquivos são opcionais, não alteram código existente e podem ser removidos sem efeitos colaterais.
