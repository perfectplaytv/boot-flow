import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase.types';

// Configuração do cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tgffflpfilsxikqhnkuj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZmZmbHBmaWxzeGlrcWhua3VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzQ5OTcsImV4cCI6MjA2OTE1MDk5N30.qMzjJOJkPeW2hN9jD_uCW1MTlJgzstSyxm78ia0IdIM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas corretamente.');
  console.log('Usando valores padrão para desenvolvimento local.');
}

// Criação da instância única do cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'bootflow-web/1.0.0',
    },
  },
});

// Tipos úteis para o frontend
export type UserProfile = Database['public']['Tables']['profiles']['Row'] & {
  role?: 'admin' | 'reseller' | 'client';
};

export type UserProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Obtém o perfil do usuário pelo ID
 * @param userId ID do usuário
 * @returns Perfil do usuário ou null se não encontrado
 */
export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};

/**
 * Atualiza o perfil do usuário
 * @param userId ID do usuário
 * @param updates Campos para atualização
 * @returns Perfil atualizado
 */
export const updateUserProfile = async (userId: string, updates: UserProfileUpdate): Promise<UserProfile> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Faz logout do usuário
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};
