// Tipos gerados pelo Supabase CLI
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type StringKeyOf<T> = Extract<keyof T, string>;
type Values<T> = T[keyof T];
type Columns<T extends { Row: Record<string, unknown> }> = StringKeyOf<T['Row']>;

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

type TablesKey = keyof Tables;
type TableKey<T extends TablesKey> = T;
type TableRow<T extends TablesKey> = Tables[T]['Row'];
type TableInsert<T extends TablesKey> = Tables[T]['Insert'];
type TableUpdate<T extends TablesKey> = Tables[T]['Update'];

export type { Tables, TablesKey, TableKey, TableRow, TableInsert, TableUpdate };

export interface Database {
  public: {
    Tables: Tables;
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}
