
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export interface Env {
    DB: D1Database;
}

// Função auxiliar para inicializar o banco no contexto do Cloudflare Worker
export const getDb = (d1: D1Database) => drizzle(d1, { schema });