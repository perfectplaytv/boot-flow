import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
  price?: string;
  status?: string;
  pago?: boolean;
  admin_id?: string; // ID do admin responsável por este cliente
  server?: string;
}

export function useClientes() {
  const { user, userRole } = useAuth(); // Obter o admin logado e seu role
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
      
      // Se não houver usuário logado, não buscar clientes
      if (!user?.id) {
        console.log('⚠️ [useClientes] Nenhum usuário logado, não buscando clientes');
        setClientes([]);
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }
      
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
      
      // Se for admin, buscar TODOS os clientes (sem filtrar por admin_id)
      // Se for cliente ou revendedor, filtrar apenas os seus clientes
      let fetchUrl: string;
      if (userRole === 'admin') {
        // Admin vê todos os clientes
        fetchUrl = `${SUPABASE_URL}/rest/v1/users?select=*`;
        console.log('🔄 [useClientes] Admin logado - Buscando TODOS os clientes');
      } else {
        // Cliente ou revendedor vê apenas seus próprios clientes
        const adminId = user.id;
        fetchUrl = `${SUPABASE_URL}/rest/v1/users?select=*&admin_id=eq.${adminId}`;
        console.log('🔄 [useClientes] Buscando clientes do admin:', adminId);
      }
      
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
        if (userRole === 'admin') {
          console.log('✅ [useClientes] Clientes buscados (TODOS):', data.length);
        } else {
          console.log('✅ [useClientes] Clientes buscados:', data.length, 'para o admin:', user.id);
        }
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
  }, [user?.id, userRole]);

  async function addCliente(cliente: Omit<Cliente, 'id'>) {
    try {
      console.log('🔄 [useClientes] addCliente chamado com:', cliente);
      setError(null);
      
      // Se não houver usuário logado, não pode criar cliente
      if (!user?.id) {
        setError('Erro: Você precisa estar logado para criar um cliente.');
        return false;
      }
      
      // Associar o cliente ao admin logado
      const clienteComAdmin = {
        ...cliente,
        admin_id: user.id,
      };
      
      // Usar fetch direto ao invés do cliente Supabase para evitar travamentos
      console.log('🔄 [useClientes] Inserindo cliente usando fetch direto...');
      console.log('🔄 [useClientes] Dados que serão inseridos:', JSON.stringify(clienteComAdmin, null, 2));
      console.log('🔄 [useClientes] Cliente associado ao admin:', user.id);
      
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
          body: JSON.stringify(clienteComAdmin),
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
      console.log('🔄 [useClientes] updateCliente chamado com:', { id, updates });
      
      // Garantir que o campo pago seja boolean se estiver presente
      if ('pago' in updates) {
        updates.pago = Boolean(updates.pago);
        console.log('🔄 [useClientes] Campo pago convertido para boolean:', updates.pago);
      }
      
      setError(null);
      
      // Usar fetch direto ao invés do cliente Supabase para evitar travamentos
      console.log('🔄 [useClientes] Atualizando cliente usando fetch direto...');
      
      // Obter token de autenticação do localStorage
      let authToken = '';
      
      try {
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
      const updateUrl = `${SUPABASE_URL}/rest/v1/users?id=eq.${id}`;
      
      console.log('🔄 [useClientes] URL:', updateUrl);
      console.log('🔄 [useClientes] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'Não fornecido' });
      console.log('🔄 [useClientes] Dados que serão atualizados:', JSON.stringify(updates, null, 2));
      
      // Timeout de 15 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      let response: Response;
      try {
        response = await fetch(updateUrl, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(updates),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('⏰ [useClientes] Timeout na atualização (15 segundos)');
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
        console.error('❌ [useClientes] Resposta completa:', responseText);
        console.error('❌ [useClientes] Dados enviados:', JSON.stringify(updates, null, 2));
        
        let errorMessage = '';
        
        // Verificar tipo de erro
        if (response.status === 401 || errorObj.message?.includes('401') || errorObj.message?.includes('Unauthorized')) {
          errorMessage = 'Erro de autenticação: Sua sessão expirou. Por favor, faça login novamente.';
        } else if (response.status === 404) {
          errorMessage = 'Erro: Cliente não encontrado. O ID pode estar incorreto.';
        } else if (response.status === 400) {
          // Erro 400 pode ser coluna não existe ou tipo incorreto
          if (errorObj.message?.includes('column') || errorObj.details?.includes('column')) {
            errorMessage = `Erro: A coluna 'pago' pode não existir na tabela 'users'. Execute o script SQL para adicionar a coluna.`;
          } else {
            errorMessage = `Erro de validação: ${errorObj.message || errorObj.details || 'Dados inválidos'}`;
          }
        } else if (errorObj.message?.includes('row-level security policy') || errorObj.message?.includes('new row violates row-level security') || errorObj.message?.includes('RLS')) {
          errorMessage = 'Erro de permissão: As políticas de segurança (RLS) estão bloqueando a atualização. Verifique se você está autenticado e se as políticas RLS estão configuradas corretamente.';
        } else if (response.status === 409 || errorObj.message?.includes('duplicate key')) {
          errorMessage = 'Erro: Já existe um cliente com este e-mail ou dados duplicados.';
        } else if (response.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = `Erro ao atualizar cliente: ${errorObj.message || errorObj.details || 'Erro desconhecido'} (Status: ${response.status})`;
        }
        
        setError(errorMessage);
        console.error('❌ [useClientes] Mensagem de erro definida:', errorMessage);
        return false;
      }
      
      console.log('✅ [useClientes] Cliente atualizado com sucesso:', data);
      
      // Atualizar estado local IMEDIATAMENTE para feedback visual
      // Se a resposta contém dados, usar os dados retornados
      // Caso contrário, atualizar apenas o campo pago
      setClientes(prevClientes => {
        if (data && Array.isArray(data) && data.length > 0) {
          const updatedCliente = data[0] as Cliente;
          return prevClientes.map(cliente => 
            cliente.id === id ? { ...cliente, ...updatedCliente } : cliente
          );
        } else {
          // Se não retornou dados, atualizar apenas o campo que foi modificado
          return prevClientes.map(cliente => 
            cliente.id === id ? { ...cliente, ...updates } : cliente
          );
        }
      });
      console.log('✅ [useClientes] Estado local atualizado imediatamente');
      
      // Atualizar a lista de clientes do banco (para sincronização completa)
      console.log('🔄 [useClientes] Atualizando lista de clientes do banco...');
      // Aguardar um pouco antes de buscar para garantir que o banco processou
      setTimeout(async () => {
        await fetchClientes();
        console.log('✅ [useClientes] Lista atualizada!');
      }, 200);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useClientes] Erro inesperado:', err);
      console.error('❌ [useClientes] Stack trace:', err instanceof Error ? err.stack : 'N/A');
      setError(`Erro inesperado ao atualizar cliente: ${errorMessage}`);
      return false;
    }
  }

  async function deleteCliente(id: number) {
    try {
      setError(null);
      console.log('🔄 [useClientes] Deletando cliente com ID:', id);
      
      // Obter token de autenticação do localStorage
      let authToken = '';
      
      try {
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
      
      // Usar fetch direto para deletar
      const deleteUrl = `${SUPABASE_URL}/rest/v1/users?id=eq.${id}`;
      console.log('🔄 [useClientes] URL de exclusão:', deleteUrl);
      console.log('🔄 [useClientes] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'Não fornecido' });
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro HTTP: ${response.status} ${response.statusText}`;
        console.error('❌ [useClientes] Erro ao deletar cliente:', errorMessage);
        
        // Verificar se é erro de RLS
        if (errorMessage.includes('row-level security policy') || errorMessage.includes('permission denied')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a exclusão. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao deletar cliente: ${errorMessage}`);
        }
        return false;
      }
      
      console.log('✅ [useClientes] Cliente deletado com sucesso');
      
      // Atualizar lista de clientes
      await fetchClientes();
      
      // Atualizar estado local removendo o cliente deletado
      setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao deletar cliente: ${errorMessage}`);
      console.error('❌ [useClientes] Erro ao deletar cliente:', err);
      return false;
    }
  }

  useEffect(() => { 
    fetchClientes(); 
  }, [fetchClientes]);

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