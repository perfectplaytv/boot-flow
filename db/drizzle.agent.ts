import { neonConfig, neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export interface AgentDrizzleOptions {
  connectionString?: string;
  fetchOptions?: RequestInit;
  maxAttempts?: number;
}

export interface AgentDrizzleInstance {
  db: NeonHttpDatabase<typeof schema>;
  disconnect: () => void;
}

const defaultConnection = () => {
  const envUrl =
    process.env.DATABASE_URL ??
    process.env.NEON_DATABASE_URL ??
    process.env.VITE_DATABASE_URL ??
    '';

  if (!envUrl) {
    console.warn('[AgentDrizzle] DATABASE_URL não encontrado. Utilizando conexão Netlify Neon padrão.');
  }

  return envUrl;
};

export const createAgentDrizzle = (options?: AgentDrizzleOptions): AgentDrizzleInstance => {
  const connectionString = options?.connectionString ?? defaultConnection();

  if (!connectionString) {
    throw new Error('[AgentDrizzle] Nenhuma connection string fornecida. Configure DATABASE_URL.');
  }

  neonConfig.fetchConnectionCache = true;

  const client = neon(connectionString, {
    fetchOptions: options?.fetchOptions,
  });

  const db = drizzle(client, {
    schema,
    logger: {
      logQuery(query, params) {
        if (process.env.AGENT_DRIZZLE_DEBUG) {
          console.debug('[AgentDrizzle] Query:', query, params);
        }
      },
    },
  });

  const disconnect = () => {
    try {
      client.end?.();
    } catch (error) {
      console.warn('[AgentDrizzle] Erro ao encerrar conexão', error);
    }
  };

  return { db, disconnect };
};

export type AgentDb = ReturnType<typeof createAgentDrizzle>['db'];
