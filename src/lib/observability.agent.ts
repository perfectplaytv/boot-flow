import { agentLogger } from '@/lib/logger.agent';

type AnalyticsPayload = Record<string, unknown>;

const logger = agentLogger;

export const emitAnalyticsEvent = async (name: string, payload: AnalyticsPayload = {}) => {
  try {
    const { track } = await import('@vercel/analytics').catch(() => ({ track: undefined }));
    if (track) {
      track(name, payload);
    }
  } catch (error) {
    logger.debug('Vercel analytics indisponível', { error });
  }

  try {
    const tinybirdEndpoint = import.meta.env.VITE_TINYBIRD_PIPE_URL ?? process.env.TINYBIRD_PIPE_URL;
    const tinybirdToken = import.meta.env.VITE_TINYBIRD_TOKEN ?? process.env.TINYBIRD_TOKEN;
    if (!tinybirdEndpoint || !tinybirdToken) return;

    await fetch(tinybirdEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tinybirdToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event: name, ...payload, ts: new Date().toISOString() }),
    });
  } catch (error) {
    logger.debug('Tinybird analytics indisponível', { error });
  }
};
