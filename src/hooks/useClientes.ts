import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';

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
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchClientes = useCallback(async () => {
    // Proteção contra múltiplas chamadas simultâneas
    if (isFetchingRef.current) {
      console.log('🔄 [useClientes] fetchClientes já em execução, ignorando chamada');
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    isFetchingRef.current = true;
    
    try {
      console.log('🔄 [useClientes] fetchClientes chamado');
      setLoading(true);
      setError(null);
      
      // Usar fetch direto para evitar travamentos
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
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const fetchUrl = `${SUPABASE_URL}/rest/v1/users?select=*`;
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ [useClientes] Clientes buscados:', data.length);
        setClientes(data || []);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        // Ignorar erros de abort
        if (fetchError.name === 'AbortError') {
          console.log('🔄 [useClientes] Requisição abortada (nova requisição iniciada)');
          return;
        }
        throw fetchError;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado: ${errorMessage}`);
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      abortControllerRef.current = null;
    }
  }, []);

  async function addCliente(cliente: Omit<Cliente, 'id'>) {
    try {
      console.log('🔄 [useClientes] addCliente chamado com:', cliente);
      setError(null);
      
      // Usar fetch direto ao invés do cliente Supabase para evitar travamentos
      console.log('🔄 [useClientes] Inserindo cliente usando fetch direto...');
      console.log('🔄 [useClientes] Dados que serão inseridos:', JSON.stringify(cliente, null, 2));
      
      // Obter token de autenticação do localStorage
      // O Supabase armazena a sessão em uma chave específica
      let authToken = '';
      
      try {
        // Buscar todas as chaves do localStorage que começam com 'sb-'
        const allKeys = Object.keys(localStorage);
        const supabaseKeys = allKeys.filter(key => key.startsWith('sb-') && key.includes('auth-token'));
        
        for (const key of supabaseKeys) {
          try {
            const authData = localStorage.getItem(key);
            if (authData) {
              const parsed = JSON.parse(authData);
              if (parsed?.access_token) {
                authToken = parsed.access_token;
                console.log('🔄 [useClientes] Token encontrado no localStorage');
                break;
              }
            }
          } catch (e) {
            // Continuar procurando
          }
        }
        
        if (!authToken) {
          console.log('🔄 [useClientes] Token não encontrado, usando apenas apikey');
        }
      } catch (e) {
        console.log('🔄 [useClientes] Erro ao buscar token:', e);
      }
      
      // Preparar headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'return=representation',
      };
      
      // Adicionar token de autenticação se disponível
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      // URL da API do Supabase
      const insertUrl = `${SUPABASE_URL}/rest/v1/users`;
      
      console.log('🔄 [useClientes] URL:', insertUrl);
      console.log('🔄 [useClientes] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'Não fornecido' });
      
      // Timeout de 15 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      let response: Response;
      try {
        response = await fetch(insertUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(cliente),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('⏰ [useClientes] Timeout na inserção (15 segundos)');
          setError('Erro de conexão: A operação está demorando muito. Verifique sua conexão com a internet.');
          return false;
        }
        
        throw fetchError;
      }
      
      console.log('🔄 [useClientes] Resposta recebida:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('🔄 [useClientes] Resposta completa:', responseText);
      
      let data;
      let error: any = null;
      
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error('❌ [useClientes] Erro ao fazer parse da resposta:', parseError);
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
        
        console.error('❌ [useClientes] Erro do Supabase:', errorObj);
        console.error('❌ [useClientes] Status:', response.status);
        
        // Verificar tipo de erro
        if (response.status === 401 || errorObj.message?.includes('401') || errorObj.message?.includes('Unauthorized')) {
          setError('Erro de autenticação: Sua sessão expirou. Por favor, faça login novamente.');
        } else if (errorObj.message?.includes('row-level security policy') || errorObj.message?.includes('new row violates row-level security')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a inserção. Verifique se você está autenticado e se as políticas RLS estão configuradas corretamente.');
        } else if (response.status === 409 || errorObj.message?.includes('duplicate key')) {
          setError('Erro: Já existe um cliente com este e-mail ou dados duplicados.');
        } else {
          setError(`Erro ao adicionar cliente: ${errorObj.message || errorObj.details || 'Erro desconhecido'} (Status: ${response.status})`);
        }
        return false;
      }
      
      console.log('✅ [useClientes] Cliente inserido com sucesso:', data);
      
      // Adicionar o cliente diretamente ao estado ao invés de buscar novamente
      if (data && Array.isArray(data) && data.length > 0) {
        const newCliente = data[0] as Cliente;
        setClientes(prevClientes => [...prevClientes, newCliente]);
        console.log('✅ [useClientes] Cliente adicionado ao estado local');
      } else {
        // Se não conseguiu adicionar ao estado, buscar novamente
        console.log('🔄 [useClientes] Atualizando lista de clientes...');
        await fetchClientes();
      }
      console.log('✅ [useClientes] Lista atualizada!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useClientes] Erro inesperado:', err);
      console.error('❌ [useClientes] Stack trace:', err instanceof Error ? err.stack : 'N/A');
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