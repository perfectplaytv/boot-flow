import { AgentAIClient, defaultAIClient } from '@/lib/aiClient.agent';
import { agentLogger } from '@/lib/logger.agent';

const logger = agentLogger;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatContext {
  userId?: string;
  userRole?: string;
  sessionHistory?: ChatMessage[];
  metadata?: Record<string, unknown>;
}

export class BootFlowChatAgent {
  private client: AgentAIClient;
  private contextHistory: ChatMessage[] = [];

  constructor(client?: AgentAIClient) {
    this.client = client ?? defaultAIClient;
  }

  async sendMessage(
    message: string,
    context: ChatContext = {},
  ): Promise<{ response: string; suggestions?: string[] }> {
    try {
      const systemPrompt = `Você é o assistente AI da plataforma Boot Flow, especializado em gestão de clientes, revendedores, cobranças e dashboards. 
Forneça respostas úteis, concisas e profissionais. Se o usuário for ${context.userRole || 'cliente'}, adapte o tom e o nível de detalhes.`;

      const fullContext = [
        { role: 'system' as const, content: systemPrompt },
        ...(context.sessionHistory || this.contextHistory.slice(-10)),
        { role: 'user' as const, content: message },
      ];

      const insight = await this.client.createInsight(
        JSON.stringify({ messages: fullContext, context: context.metadata }),
        context,
      );

      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: insight.summary,
        timestamp: new Date().toISOString(),
      };

      this.contextHistory.push(userMessage, assistantMessage);
      if (this.contextHistory.length > 50) {
        this.contextHistory = this.contextHistory.slice(-50);
      }

      return {
        response: insight.summary,
        suggestions: insight.actions.slice(0, 3),
      };
    } catch (error) {
      logger.error('Erro no chat agent', { error: (error as Error).message });
      return {
        response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      };
    }
  }

  clearHistory() {
    this.contextHistory = [];
  }

  getHistory(): ChatMessage[] {
    return [...this.contextHistory];
  }
}

export const bootFlowChatAgent = new BootFlowChatAgent();

