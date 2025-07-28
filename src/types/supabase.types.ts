// Tipos gerados pelo Supabase CLI
interface GeneratedDatabase {
  public: {
    Tables: Record<string, any>;
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Tables<T extends keyof Database['public']['Tables']> {
  Row: Database['public']['Tables'][T]['Row'];
  Insert: Database['public']['Tables'][T]['Insert'];
  Update: Database['public']['Tables'][T]['Update'];
}

export interface Database extends GeneratedDatabase {
  public: {
    Tables: {
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
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role?: 'admin' | 'reseller' | 'client' | null;
        };
      };
      // Adicione outras tabelas conforme necessário
    };
    // Adicionando as propriedades necessárias
    Views: Record<string, any>;
    Functions: Record<string, any>;
    Enums: Record<string, any>;
  };
}
