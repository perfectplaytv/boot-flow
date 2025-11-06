import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';

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
      console.log('🔄 [useRevendas] Iniciando busca de revendedores...');
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useRevendas] Chamando supabase.from("resellers").select("*")...');
      const { data, error } = await supabase.from('resellers').select('*');
      
      console.log('🔄 [useRevendas] Resposta recebida do Supabase');
      
      if (error) {
        console.error('❌ [useRevendas] Erro ao buscar revendedores:', error);
        console.error('❌ [useRevendas] Detalhes do erro:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security policy')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando o acesso. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao buscar revendedores: ${error.message}`);
        }
        return;
      }
      
      console.log('✅ [useRevendas] Revendedores buscados com sucesso:', data?.length || 0, 'revendedores');
      setRevendas(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useRevendas] Erro inesperado ao buscar revendedores:', err);
      setError(`Erro inesperado: ${errorMessage}`);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log('✅ [useRevendas] Busca finalizada');
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
      console.log('🔄 [useRevendas] JSON serializado:', JSON.stringify(revendaData, null, 2));
      
      // Obter token de autenticação do localStorage
      const allKeys = Object.keys(localStorage);
      const supabaseKeys = allKeys.filter(key => key.startsWith('sb-') && key.includes('auth-token'));
      let authToken = '';
      
      for (const key of supabaseKeys) {
        try {
          const authData = localStorage.getItem(key);
          if (authData) {
            const parsed = JSON.parse(authData);
            if (parsed?.access_token) {
              authToken = parsed.access_token;
              break;
            }
          }
        } catch (e) {
          // Continuar procurando
        }
      }
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const insertUrl = `${SUPABASE_URL}/rest/v1/resellers`;
      
      console.log('🔄 [useRevendas] URL:', insertUrl);
      console.log('🔄 [useRevendas] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'Não fornecido' });
      
      // Timeout de 15 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      let response: Response;
      try {
        response = await fetch(insertUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(revendaData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('⏰ [useRevendas] Timeout na inserção (15 segundos)');
          setError('Erro de conexão: A operação está demorando muito. Verifique sua conexão com a internet.');
          return false;
        }
        
        throw fetchError;
      }
      
      console.log('🔄 [useRevendas] Resposta recebida:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('🔄 [useRevendas] Resposta completa:', responseText);
      
      let data;
      let error: any = null;
      
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error('❌ [useRevendas] Erro ao fazer parse da resposta:', parseError);
        if (!response.ok) {
          error = {
            code: response.status.toString(),
            message: response.statusText || 'Erro desconhecido',
            details: responseText,
          };
        }
      }
      
      if (!response.ok || error) {
        const errorObj = error || data || {
          code: response.status.toString(),
          message: response.statusText || 'Erro desconhecido',
          details: responseText,
        };
        
        console.error('❌ [useRevendas] Erro do Supabase:', errorObj);
        console.error('❌ [useRevendas] Status:', response.status);
        
        // Verificar tipo de erro
        if (response.status === 401 || errorObj.message?.includes('401') || errorObj.message?.includes('Unauthorized')) {
          setError('Erro de autenticação: Sua sessão expirou. Por favor, faça login novamente.');
        } else if (errorObj.message?.includes('row-level security policy') || errorObj.message?.includes('new row violates row-level security')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a inserção. Verifique se você está autenticado e se as políticas RLS estão configuradas corretamente.');
        } else if (response.status === 409 || errorObj.message?.includes('duplicate key')) {
          setError('Erro: Já existe um revendedor com este username ou email.');
        } else {
          setError(`Erro ao adicionar revendedor: ${errorObj.message || errorObj.details || 'Erro desconhecido'} (Status: ${response.status})`);
        }
        return false;
      }
      
      console.log('✅ [useRevendas] Revendedor inserido com sucesso:', data);
      
      // Adicionar o revendedor diretamente ao estado ou buscar novamente
      if (data && Array.isArray(data) && data.length > 0) {
        const newRevenda = data[0] as Revenda;
        setRevendas(prevRevendas => [...prevRevendas, newRevenda]);
        console.log('✅ [useRevendas] Revendedor adicionado ao estado local');
      } else {
        // Se não conseguiu adicionar ao estado, buscar novamente
        console.log('🔄 [useRevendas] Atualizando lista de revendedores...');
        await fetchRevendas();
      }
      console.log('✅ [useRevendas] Lista atualizada!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useRevendas] Erro inesperado ao adicionar revendedor:', err);
      console.error('❌ [useRevendas] Stack trace:', err instanceof Error ? err.stack : 'N/A');
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