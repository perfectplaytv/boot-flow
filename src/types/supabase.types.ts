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
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role?: 'admin' | 'reseller' | 'client' | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          role?: 'admin' | 'reseller' | 'client' | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
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
