import type { IncomingMessage, ServerResponse } from 'http';
import { AgentAIClient } from '@/lib/aiClient.agent';
import { agentLogger } from '@/lib/logger.agent';

export interface InsightsRequestBody {
  prompt: string;
  context?: Record<string, unknown>;
}

const logger = agentLogger;

export const insightsHandler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Allow', 'POST');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    const body = await new Promise<InsightsRequestBody>((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
      req.on('error', reject);
    });

    const client = new AgentAIClient();
    const insight = await client.createInsight(body.prompt, body.context ?? {});

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ insight }));
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.error('Falha ao gerar insight', { message: err.message });
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  }
};

export default insightsHandler;
