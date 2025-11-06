import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface Revenda {
  id: number;
  username: string;
  email: string;
  password?: string;
  permission?: string;
  credits?: number;
  personal_name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  force_password_change?: string;
  servers?: string;
  master_reseller?: string;
  disable_login_days?: number;
  monthly_reseller?: boolean;
  telegram?: string;
  whatsapp?: string;
  observations?: string;
}

export function useRevendas() {
  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchRevendas = useCallback(async () => {
    // Proteção contra múltiplas chamadas simultâneas
    if (isFetchingRef.current) {
      console.log('🔄 [useRevendas] fetchRevendas já em execução, ignorando chamada');
      return;
    }

    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.from('resellers').select('*');
      
      if (error) {
        console.error('Erro ao buscar revendedores:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando o acesso. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao buscar revendedores: ${error.message}`);
        }
        return;
      }
      
      setRevendas(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado: ${errorMessage}`);
      console.error('Erro ao buscar revendedores:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  async function addRevenda(revenda: Omit<Revenda, 'id'>) {
    try {
      setError(null);
      
      // Preparar dados para inserção, garantindo tipos corretos
      const revendaData: any = {
        username: revenda.username,
        email: revenda.email,
        password: revenda.password,
        permission: revenda.permission,
        credits: revenda.credits ?? 10,
        personal_name: revenda.personal_name,
        status: revenda.status || 'Ativo',
        force_password_change: typeof revenda.force_password_change === 'string' 
          ? revenda.force_password_change === 'true' 
          : revenda.force_password_change ?? false,
        monthly_reseller: revenda.monthly_reseller ?? false,
        disable_login_days: revenda.disable_login_days ?? 0,
      };
      
      // Adicionar campos opcionais apenas se tiverem valor
      if (revenda.servers) revendaData.servers = revenda.servers;
      if (revenda.master_reseller) revendaData.master_reseller = revenda.master_reseller;
      if (revenda.telegram) revendaData.telegram = revenda.telegram;
      if (revenda.whatsapp) revendaData.whatsapp = revenda.whatsapp;
      if (revenda.observations) revendaData.observations = revenda.observations;
      
      console.log('🔄 [useRevendas] Tentando adicionar revendedor:', revendaData);
      
      const { data, error } = await supabase.from('resellers').insert([revendaData]).select();
      
      if (error) {
        console.error('❌ [useRevendas] Erro ao adicionar revendedor:', error);
        console.error('❌ [useRevendas] Detalhes do erro:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a inserção. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao adicionar revendedor: ${error.message}`);
        }
        return false;
      }
      
      console.log('✅ [useRevendas] Revendedor adicionado com sucesso:', data);
      
      // Buscar novamente para atualizar a lista
      await fetchRevendas();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useRevendas] Erro inesperado ao adicionar revendedor:', err);
      setError(`Erro inesperado ao adicionar revendedor: ${errorMessage}`);
      return false;
    }
  }

  async function updateRevenda(id: number, updates: Partial<Revenda>) {
    try {
      setError(null);
      
      const { data, error } = await supabase.from('resellers').update(updates).eq('id', id).select();
      
      if (error) {
        console.error('Erro ao atualizar revendedor:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a atualização. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao atualizar revendedor: ${error.message}`);
        }
        return false;
      }
      
      await fetchRevendas();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao atualizar revendedor: ${errorMessage}`);
      console.error('Erro ao atualizar revendedor:', err);
      return false;
    }
  }

  async function deleteRevenda(id: number) {
    try {
      setError(null);
      
      const { error } = await supabase.from('resellers').delete().eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar revendedor:', error);
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a exclusão. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao deletar revendedor: ${error.message}`);
        }
        return false;
      }
      
      await fetchRevendas();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao deletar revendedor: ${errorMessage}`);
      console.error('Erro ao deletar revendedor:', err);
      return false;
    }
  }

  useEffect(() => { 
    fetchRevendas(); 
  }, []);

  return { 
    revendas, 
    loading, 
    error, 
    addRevenda, 
    updateRevenda, 
    deleteRevenda, 
    fetchRevendas,
    clearError: () => setError(null)
  };
} 