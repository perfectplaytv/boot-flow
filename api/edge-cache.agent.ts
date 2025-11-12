import type { IncomingMessage, ServerResponse } from 'http';
import { agentLogger } from '../src/lib/logger.agent';

const logger = agentLogger;

const ONE_MINUTE = 60;

export const edgeCacheHandler = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Cache-Control', `public, s-maxage=${5 * ONE_MINUTE}, stale-while-revalidate=${15 * ONE_MINUTE}`);
  res.setHeader('CDN-Cache-Control', 'max-age=300');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  try {
    const payload = { time: new Date().toISOString(), message: 'Edge cache ativo' };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  } catch (error) {
    logger.error('Erro no edge cache handler', { error: (error as Error).message });
    res.statusCode = 500;
    res.end('Internal error');
  }
};

export default edgeCacheHandler;
