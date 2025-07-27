import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Cliente {
  id: number;
  name: string;
  email: string;
  password?: string;
  m3u_url?: string;
  bouquets?: string;
  expiration_date?: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  devices?: number;
  credits?: number;
  renewalDate?: string;
  notes?: string;
  real_name?: string;
  plan?: string;
  status?: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchClientes() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.from('users').select('*');
      
      if (error) {
        console.error('Erro ao buscar clientes:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando o acesso. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao buscar clientes: ${error.message}`);
        }
        return;
      }
      
      setClientes(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado: ${errorMessage}`);
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addCliente(cliente: Omit<Cliente, 'id'>) {
    try {
      setError(null);
      
      const { data, error } = await supabase.from('users').insert([cliente]).select();
      
      if (error) {
        console.error('Erro ao adicionar cliente:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a inserção. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao adicionar cliente: ${error.message}`);
        }
        return false;
      }
      
      await fetchClientes();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao adicionar cliente: ${errorMessage}`);
      console.error('Erro ao adicionar cliente:', err);
      return false;
    }
  }

  async function updateCliente(id: number, updates: Partial<Cliente>) {
    try {
      setError(null);
      
      const { data, error } = await supabase.from('users').update(updates).eq('id', id).select();
      
      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a atualização. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao atualizar cliente: ${error.message}`);
        }
        return false;
      }
      
      await fetchClientes();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao atualizar cliente: ${errorMessage}`);
      console.error('Erro ao atualizar cliente:', err);
      return false;
    }
  }

  async function deleteCliente(id: number) {
    try {
      setError(null);
      
      const { error } = await supabase.from('users').delete().eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar cliente:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a exclusão. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao deletar cliente: ${error.message}`);
        }
        return false;
      }
      
      await fetchClientes();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao deletar cliente: ${errorMessage}`);
      console.error('Erro ao deletar cliente:', err);
      return false;
    }
  }

  useEffect(() => { 
    fetchClientes(); 
  }, []);

  return { 
    clientes, 
    loading, 
    error, 
    addCliente, 
    updateCliente, 
    deleteCliente, 
    fetchClientes,
    clearError: () => setError(null)
  };
} 