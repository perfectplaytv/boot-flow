import { useCallback, useEffect, useMemo, useState } from 'react';
import { AgentAIClient, AgentInsightPayload, defaultAIClient } from '@/lib/aiClient.agent';

export interface AIInsightOptions {
  prompt: string;
  context?: Record<string, unknown>;
  client?: AgentAIClient;
  auto?: boolean;
}

export interface AIInsightState {
  data?: AgentInsightPayload;
  isLoading: boolean;
  error?: Error;
}

export const useAIInsights = (options: AIInsightOptions) => {
  const { prompt, context = {}, client = defaultAIClient, auto = true } = options;
  const [state, setState] = useState<AIInsightState>({ isLoading: auto });

  const execute = useCallback(async () => {
    setState({ isLoading: true });
    try {
      const data = await client.createInsight(prompt, context);
      setState({ data, isLoading: false });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erro desconhecido ao gerar insight.');
      setState({ error: err, isLoading: false });
      return undefined;
    }
  }, [client, context, prompt]);

  useEffect(() => {
    if (auto) {
      void execute();
    }
  }, [auto, execute]);

  return useMemo(
    () => ({
      ...state,
      refresh: execute,
    }),
    [execute, state],
  );
};
