import { AgentAIClient, defaultAIClient } from '@/lib/aiClient.agent';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface UserHistory {
  userId: string;
  role: 'admin' | 'reseller' | 'client';
  recentActions?: Array<{ action: string; timestamp: string; result?: string }>;
  preferences?: Record<string, unknown>;
  metrics?: {
    clientsCreated?: number;
    billsGenerated?: number;
    revenueGenerated?: number;
  };
}

export interface Suggestion {
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category: 'optimization' | 'growth' | 'maintenance' | 'security';
}

export class BootFlowSuggestionAgent {
  private client: AgentAIClient;

  constructor(client?: AgentAIClient) {
    this.client = client ?? defaultAIClient;
  }

  async generateSuggestions(history: UserHistory): Promise<Suggestion[]> {
    try {
      const prompt = `Com base no histórico do usuário ${history.userId} (role: ${history.role}), gere sugestões inteligentes de ações para melhorar a produtividade e resultados na plataforma Boot Flow.

Métricas do usuário:
- Clientes criados: ${history.metrics?.clientsCreated || 0}
- Cobranças geradas: ${history.metrics?.billsGenerated || 0}
- Receita gerada: R$ ${history.metrics?.revenueGenerated?.toLocaleString('pt-BR') || '0'}

Ações recentes: ${history.recentActions?.length || 0}

Gere 3-5 sugestões práticas e acionáveis, priorizando ações que podem aumentar receita, melhorar eficiência ou prevenir problemas.`;

      const insight = await this.client.createInsight(prompt, history);

      const suggestions: Suggestion[] = insight.actions.map((action, index) => {
        const priority = index < 2 ? 'high' : index < 4 ? 'medium' : 'low';
        const category = this.categorizeSuggestion(action);

        return {
          title: `Sugestão ${index + 1}`,
          description: action,
          action: action.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          priority,
          category,
        };
      });

      return suggestions;
    } catch (error) {
      logger.error('Erro ao gerar sugestões', { error: (error as Error).message });
      return this.getDefaultSuggestions(history.role);
    }
  }

  private categorizeSuggestion(action: string): Suggestion['category'] {
    const lower = action.toLowerCase();
    if (lower.includes('segurança') || lower.includes('backup') || lower.includes('senha')) {
      return 'security';
    }
    if (lower.includes('crescimento') || lower.includes('novo') || lower.includes('expandir')) {
      return 'growth';
    }
    if (lower.includes('otimizar') || lower.includes('melhorar') || lower.includes('eficiente')) {
      return 'optimization';
    }
    return 'maintenance';
  }

  private getDefaultSuggestions(role: string): Suggestion[] {
    const base: Suggestion[] = [
      {
        title: 'Revisar clientes inativos',
        description: 'Analise clientes sem atividade recente e considere reativá-los ou arquivá-los.',
        action: 'review-inactive-clients',
        priority: 'medium',
        category: 'optimization',
      },
    ];

    if (role === 'admin') {
      base.push({
        title: 'Configurar backups automáticos',
        description: 'Configure backups automáticos diários para proteger os dados da plataforma.',
        action: 'setup-automatic-backups',
        priority: 'high',
        category: 'security',
      });
    }

    return base;
  }
}

export const bootFlowSuggestionAgent = new BootFlowSuggestionAgent();

