# Changelog – Agent Modernization 2025

## 2025-11-12
- Auditoria completa (docs/AGENT-AUDIT-REPORT.json, docs/AGENT-STACK-OVERVIEW.md)
- Backup automático (branch `agent/safe-backup-20251112-0000`, `backup-20251112-0000.zip`)
- Novos módulos core
  - Supabase client (`src/lib/supabaseClient.agent.ts`)
  - Drizzle helper (`db/drizzle.agent.ts`)
  - Observabilidade (`src/lib/logger.agent.ts`, `src/lib/observability.agent.ts`)
- Hooks (realtime, edge sync, AI, atalhos, voz, toasts)
- Componentes UI premium (command palette, chart, skeleton, theme switcher, insights card)
- Integração AI + endpoint `api/ai/insights.agent.ts`
- PWA assets (`manifest.agent.json`, `service-worker.agent.js`) e Edge handler
- Scripts/testes (security scan, suites node:test, docs complementares)
