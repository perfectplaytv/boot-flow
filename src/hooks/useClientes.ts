import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
      console.log('🔄 [useClientes] addCliente chamado com:', cliente);
      setError(null);
      
      // Verifica se há sessão válida
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔄 [useClientes] Sessão:', session ? 'Existe' : 'Não existe');
      
      if (!session) {
        const errorMsg = 'Você precisa estar autenticado para adicionar clientes. Faça login novamente.';
        setError(errorMsg);
        console.error('❌ [useClientes] Erro de autenticação:', errorMsg);
        return false;
      }
      
      console.log('🔄 [useClientes] Inserindo cliente no Supabase...');
      const { data, error } = await supabase.from('users').insert([cliente]).select();
      
      if (error) {
        console.error('❌ [useClientes] Erro do Supabase:', error);
        console.error('❌ [useClientes] Código do erro:', error.code);
        console.error('❌ [useClientes] Mensagem do erro:', error.message);
        console.error('❌ [useClientes] Detalhes do erro:', error.details);
        
        // Verificar tipo de erro
        if (error.code === 'PGRST301' || error.message.includes('401') || error.message.includes('Unauthorized')) {
          setError('Erro de autenticação: Sua sessão expirou. Por favor, faça login novamente.');
        } else if (error.message.includes('row-level security policy') || error.message.includes('new row violates row-level security')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a inserção. Verifique se você está autenticado e se as políticas RLS estão configuradas corretamente.');
        } else {
          setError(`Erro ao adicionar cliente: ${error.message} (Código: ${error.code || 'N/A'})`);
        }
        return false;
      }
      
      console.log('✅ [useClientes] Cliente inserido com sucesso:', data);
      await fetchClientes();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useClientes] Erro inesperado:', err);
      setError(`Erro inesperado ao adicionar cliente: ${errorMessage}`);
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