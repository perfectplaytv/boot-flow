export interface AgentAIClientOptions {
  apiKey?: string;
  baseUrl?: string;
  defaultAssistantId?: string;
  mock?: boolean;
}

export interface AgentInsightPayload {
  title: string;
  summary: string;
  confidence: number;
  actions: string[];
}

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

export class AgentAIClient {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly assistantId: string | undefined;
  private readonly mock: boolean;

  constructor(options?: AgentAIClientOptions) {
    this.apiKey = options?.apiKey ?? import.meta.env.VITE_OPENAI_API_KEY ?? (typeof process !== 'undefined' ? process.env.OPENAI_API_KEY : undefined);
    this.baseUrl = options?.baseUrl ?? import.meta.env.VITE_OPENAI_BASE_URL ?? DEFAULT_BASE_URL;
    this.assistantId = options?.defaultAssistantId ?? import.meta.env.VITE_OPENAI_ASSISTANT_ID;
    this.mock = options?.mock ?? !this.apiKey;

    if (this.mock) {
      console.info('[AgentAI] Rodando em modo mock. Configure VITE_OPENAI_API_KEY para usar a API real.');
    }
  }

  async createInsight(prompt: string, context: Record<string, unknown> = {}): Promise<AgentInsightPayload> {
    if (this.mock) {
      return {
        title: 'Insight simulado',
        summary: 'Configure a variável VITE_OPENAI_API_KEY para ativar insights reais.',
        confidence: 0.2,
        actions: ['Adicionar chave de API nas variáveis de ambiente', 'Ajustar agente para modo produção'],
      };
    }

    const payload = {
      model: 'gpt-4.2-mini',
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente de analytics corporativo. Retorne insights estruturados em JSON com título, resumo, confiança (0-1) e ações recomendadas.',
        },
        {
          role: 'user',
          content: JSON.stringify({ prompt, context }),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'agent_insight_schema',
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              summary: { type: 'string' },
              confidence: { type: 'number' },
              actions: { type: 'array', items: { type: 'string' } },
            },
            required: ['title', 'summary', 'confidence', 'actions'],
          },
        },
      },
    };

    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`[AgentAI] Erro na API OpenAI: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.output[0]?.content?.[0]?.text
      ? JSON.parse(json.output[0].content[0].text) as AgentInsightPayload
      : ({
          title: 'Insight indisponível',
          summary: 'Não foi possível interpretar a resposta da API.',
          confidence: 0,
          actions: [],
        } satisfies AgentInsightPayload);
  }

  async runAssistantThread(input: string, metadata: Record<string, unknown> = {}) {
    if (this.mock) {
      return {
        status: 'mocked',
        output: `Thread simulada: ${input}`,
        metadata,
      };
    }

    if (!this.assistantId) {
      throw new Error('[AgentAI] Assistant ID não configurado. Defina VITE_OPENAI_ASSISTANT_ID.');
    }

    const response = await fetch(`${this.baseUrl}/assistants/${this.assistantId}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        input,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`[AgentAI] Falha ao iniciar thread: ${response.statusText}`);
    }

    return response.json();
  }
}

export const defaultAIClient = new AgentAIClient();
