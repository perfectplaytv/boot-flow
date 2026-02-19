import { AgentAIClient, defaultAIClient } from '@/lib/aiClient.agent';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface MetricsData {
  totalUsers?: number;
  totalRevenue?: number;
  activeClients?: number;
  pendingBills?: number;
  recentActivities?: Array<{ type: string; description: string; timestamp: string }>;
}

export class BootFlowSummaryAgent {
  private client: AgentAIClient;

  constructor(client?: AgentAIClient) {
    this.client = client ?? defaultAIClient;
  }

  async generateMetricsSummary(metrics: MetricsData): Promise<string> {
    try {
      const prompt = `Analise as seguintes métricas da plataforma Boot Flow e gere um resumo executivo em português:

- Total de Usuários: ${metrics.totalUsers || 0}
- Receita Total: R$ ${metrics.totalRevenue?.toLocaleString('pt-BR') || '0'}
- Clientes Ativos: ${metrics.activeClients || 0}
- Cobranças Pendentes: ${metrics.pendingBills || 0}
- Atividades Recentes: ${metrics.recentActivities?.length || 0} eventos

Gere um resumo de 2-3 parágrafos destacando pontos principais, tendências e recomendações.`;

      const insight = await this.client.createInsight(prompt, metrics);
      return insight.summary;
    } catch (error) {
      logger.error('Erro ao gerar resumo de métricas', { error: (error as Error).message });
      return 'Não foi possível gerar o resumo das métricas no momento.';
    }
  }

  async generateActivitySummary(activities: MetricsData['recentActivities'] = []): Promise<string> {
    if (activities.length === 0) {
      return 'Nenhuma atividade recente registrada.';
    }

    try {
      const activitiesText = activities
        .slice(0, 20)
        .map((a) => `[${a.timestamp}] ${a.type}: ${a.description}`)
        .join('\n');

      const prompt = `Resuma as seguintes atividades recentes da plataforma Boot Flow em português, destacando padrões e eventos importantes:

${activitiesText}

Gere um resumo conciso de 1-2 parágrafos.`;

      const insight = await this.client.createInsight(prompt, { activities });
      return insight.summary;
    } catch (error) {
      logger.error('Erro ao gerar resumo de atividades', { error: (error as Error).message });
      return 'Não foi possível gerar o resumo das atividades no momento.';
    }
  }
}

export const bootFlowSummaryAgent = new BootFlowSummaryAgent();

