// Tipos gerados pelo Supabase CLI
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Tipos utilitários
type StringKeyOf<T> = Extract<keyof T, string>;

type Tables = {
  profiles: {
    Row: {
      id: string;
      email?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      website?: string | null;
      role?: 'admin' | 'reseller' | 'client' | null;
    };
    Insert: {
      id: string;
      email?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      website?: string | null;
      role?: 'admin' | 'reseller' | 'client' | null;
    };
    Update: {
      id?: string;
      email?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
      username?: string | null;
      full_name?: string | null;
      avatar_url?: string | null;
      website?: string | null;
      role?: 'admin' | 'reseller' | 'client' | null;
    };
  };
  cobrancas: {
    Row: {
      id: string;
      created_at?: string | null;
      updated_at?: string | null;
      cliente_id: string;
      valor: number;
      data_vencimento: string;
      status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
      descricao?: string | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      updated_at?: string | null;
      cliente_id: string;
      valor: number;
      data_vencimento: string;
      status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
      descricao?: string | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      updated_at?: string | null;
      cliente_id?: string;
      valor?: number;
      data_vencimento?: string;
      status?: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
      descricao?: string | null;
    };
  };
  clientes: {
    Row: {
      id: string;
      created_at?: string | null;
      updated_at?: string | null;
      nome: string;
      email?: string | null;
      telefone?: string | null;
      endereco?: string | null;
      cidade?: string | null;
      estado?: string | null;
      cep?: string | null;
      data_nascimento?: string | null;
      status: 'ativo' | 'inativo' | 'suspenso';
      plano_id?: string | null;
      revendedor_id?: string | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      updated_at?: string | null;
      nome: string;
      email?: string | null;
      telefone?: string | null;
      endereco?: string | null;
      cidade?: string | null;
      estado?: string | null;
      cep?: string | null;
      data_nascimento?: string | null;
      status: 'ativo' | 'inativo' | 'suspenso';
      plano_id?: string | null;
      revendedor_id?: string | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      updated_at?: string | null;
      nome?: string;
      email?: string | null;
      telefone?: string | null;
      endereco?: string | null;
      cidade?: string | null;
      estado?: string | null;
      cep?: string | null;
      data_nascimento?: string | null;
      status?: 'ativo' | 'inativo' | 'suspenso';
      plano_id?: string | null;
      revendedor_id?: string | null;
    };
  };
  revendas: {
    Row: {
      id: string;
      created_at?: string | null;
      updated_at?: string | null;
      nome: string;
      email: string;
      telefone?: string | null;
      endereco?: string | null;
      cidade?: string | null;
      estado?: string | null;
      cep?: string | null;
      status: 'ativo' | 'inativo' | 'suspenso';
      comissao?: number;
      limite_clientes?: number | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      updated_at?: string | null;
      nome: string;
      email: string;
      telefone?: string | null;
      endereco?: string | null;
      cidade?: string | null;
      estado?: string | null;
      cep?: string | null;
      status: 'ativo' | 'inativo' | 'suspenso';
      comissao?: number;
      limite_clientes?: number | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      updated_at?: string | null;
      nome?: string;
      email?: string;
      telefone?: string | null;
      endereco?: string | null;
      cidade?: string | null;
      estado?: string | null;
      cep?: string | null;
      status?: 'ativo' | 'inativo' | 'suspenso';
      comissao?: number;
      limite_clientes?: number | null;
    };
  };
}

// Exportando o tipo Tables
export type { Tables };

// Tipos de mapeamento para as tabelas
type MapRow<T> = T extends { Row: infer R } ? R : never;
type MapInsert<T> = T extends { Insert: infer I } ? I : never;
type MapUpdate<T> = T extends { Update: infer U } ? U : never;

type DatabaseTables = {
  [K in keyof Tables]: {
    Row: MapRow<Tables[K]>;
    Insert: MapInsert<Tables[K]>;
    Update: MapUpdate<Tables[K]>;
  };
};

export interface Database {
  public: {
    Tables: DatabaseTables;
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      [key: string]: string[];
    };
  };
}

// Tipos auxiliares para consultas
export type TablesKey = keyof Database['public']['Tables'];
export type TableKey<T extends TablesKey> = T;

export type TableRow<T extends TablesKey> = Database['public']['Tables'][T]['Row'];
export type TableInsert<T extends TablesKey> = Database['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends TablesKey> = Database['public']['Tables'][T]['Update'];

// Tipos úteis para queries
export type TableName = keyof Database['public']['Tables'];
export type TableType<T extends TableName> = Database['public']['Tables'][T];

// Tipos para realtime updates
export type RealtimePayload<T extends TableName> = {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  record: TableRow<T> | null;
  old_record: TableRow<T> | null;
};
