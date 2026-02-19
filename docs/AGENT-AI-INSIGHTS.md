# AI Insights Playbook

## Fluxo
1. `src/lib/aiClient.agent.ts` centraliza chamadas à OpenAI Assist 2025
2. `useAIInsights.agent.ts` consome cliente e entrega estado React (dados, loading, refresh)
3. `AIInsightsCard.agent.tsx` exibe recomendações com confiança + lista de ações
4. Endpoint opcional `api/ai/insights.agent.ts` expõe insights via HTTP para automações externas

## Configuração Necessária
- Variáveis: `VITE_OPENAI_API_KEY`, `VITE_OPENAI_ASSISTANT_ID`, `VITE_OPENAI_BASE_URL`
- Ambiente sem chave roda automaticamente em modo mock

## Extensões Sugeridas
- Persistir insights no banco via Drizzle
- Vincular feedback do usuário (aceitou/ignorou ação) com `emitAnalyticsEvent`
- Automatizar disparo após fechamento de ciclo no dashboard (cron/serverless)

## Quick Start
```ts
import { useAIInsights } from '@/hooks/useAIInsights.agent';

const { data, isLoading, refresh } = useAIInsights({
  prompt: 'Avalie a saúde da base de clientes',
  context: { clientes ativos: 1200, churn: 0.03 },
});
```
