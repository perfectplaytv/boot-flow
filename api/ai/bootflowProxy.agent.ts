import OpenAI from 'openai';
import { agentLogger } from '../../src/lib/logger.agent';

const logger = agentLogger;

const openaiApiKey = process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

interface BootflowProxyRequest {
  messages: Array<{ role: string; content: string }>;
  context?: Record<string, unknown>;
  type?: 'chat' | 'summary' | 'suggestion';
}

// Mock responses quando OpenAI não está configurado
const mockResponse = (prompt: string): string => {
  if (prompt.includes('resumo') || prompt.includes('summary')) {
    return 'Resumo gerado automaticamente (modo mock). Configure OPENAI_API_KEY para respostas reais.';
  }
  if (prompt.includes('sugestão') || prompt.includes('suggestion')) {
    return 'Sugestão: Configure OPENAI_API_KEY para receber sugestões inteligentes baseadas em seus dados.';
  }
  return 'Resposta automática (modo mock). Configure OPENAI_API_KEY para usar IA real.';
};

export const POST = async (request: Request) => {
  try {
    const body: BootflowProxyRequest = await request.json();
    const { messages, context, type = 'chat' } = body;

    if (!openai) {
      logger.warn('OpenAI não configurado, usando mock');
      const lastMessage = messages[messages.length - 1]?.content || '';
      return new Response(
        JSON.stringify({
          response: mockResponse(lastMessage),
          model: 'mock',
          usage: { total_tokens: 0 },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    let response;

    switch (type) {
      case 'chat':
        response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: messages.map((msg: { role: string; content: string }) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
          })),
          temperature: 0.7,
          max_tokens: 1000,
        });
        break;

      case 'summary':
        response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente especializado em gerar resumos executivos de métricas e dados de negócios. Responda sempre em português.',
            },
            {
              role: 'user',
              content: messages[messages.length - 1]?.content || '',
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        });
        break;

      case 'suggestion':
        response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'Você é um consultor de negócios. Analise os dados fornecidos e gere 3-5 sugestões práticas e acionáveis. Responda sempre em português.',
            },
            {
              role: 'user',
              content: messages[messages.length - 1]?.content || '',
            },
          ],
          temperature: 0.8,
          max_tokens: 800,
        });
        break;

      default:
        throw new Error(`Tipo não suportado: ${type}`);
    }

    const content = response.choices[0]?.message?.content || 'Sem resposta';
    logger.info('Resposta IA gerada', { type, tokens: response.usage?.total_tokens });

    return new Response(
      JSON.stringify({
        response: content,
        model: response.model,
        usage: response.usage,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    logger.error('Erro no proxy IA', { error: (error as Error).message });
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

