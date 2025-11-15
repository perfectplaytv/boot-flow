import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
  admin_id?: string; // ID do admin responsável por este revenda
}

export function useRevendas() {
  const { user } = useAuth(); // Obter o admin logado
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
      
      // Se não houver usuário logado, não buscar revendas
      if (!user?.id) {
        console.log('⚠️ [useRevendas] Nenhum usuário logado, não buscando revendas');
        setRevendas([]);
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }
      
      // Usar fetch direto para evitar travamentos (igual ao useClientes)
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
      
      // Filtrar revendas pelo admin_id do usuário logado
      // A política RLS já filtra automaticamente, mas adicionamos o filtro explícito para clareza
      const adminId = user.id;
      let fetchUrl = `${SUPABASE_URL}/rest/v1/resellers?select=*&admin_id=eq.${adminId}`;
      
      console.log('🔄 [useRevendas] Buscando revendas do admin:', adminId);
      console.log('🔄 [useRevendas] Chamando:', fetchUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        let response = await fetch(fetchUrl, {
          method: 'GET',
          headers,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Se der erro 400, pode ser que a coluna admin_id ainda não exista
        // Tentar buscar sem filtro como fallback temporário
        if (!response.ok && response.status === 400) {
          console.warn('⚠️ [useRevendas] Erro 400 ao buscar com filtro admin_id. A coluna pode não existir ainda.');
          console.warn('⚠️ [useRevendas] Tentando buscar sem filtro como fallback...');
          
          // Tentar buscar sem filtro
          const fallbackUrl = `${SUPABASE_URL}/rest/v1/resellers?select=*`;
          const fallbackController = new AbortController();
          const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);
          
          try {
            response = await fetch(fallbackUrl, {
              method: 'GET',
              headers,
              signal: fallbackController.signal,
            });
            clearTimeout(fallbackTimeoutId);
            
            if (response.ok) {
              const data = await response.json();
              console.warn('⚠️ [useRevendas] Busca sem filtro bem-sucedida. Execute o script SQL adicionar_admin_id_resellers.sql no Supabase para habilitar a separação por admin.');
              console.log('✅ [useRevendas] Revendedores buscados (sem filtro):', data?.length || 0, 'revendedores');
              
              // Filtrar manualmente no frontend (temporário até executar o script SQL)
              const filteredData = Array.isArray(data) ? data.filter((revenda: any) => {
                // Se não tiver admin_id, incluir (dados antigos)
                // Se tiver admin_id, incluir apenas se for do admin logado
                return !revenda.admin_id || revenda.admin_id === adminId;
              }) : [];
              
              setRevendas(filteredData);
              setError('⚠️ A coluna admin_id ainda não existe na tabela resellers. Execute o script SQL adicionar_admin_id_resellers.sql no Supabase para habilitar a separação completa por admin.');
              return;
            }
          } catch (fallbackError: any) {
            clearTimeout(fallbackTimeoutId);
            if (fallbackError.name !== 'AbortError') {
              throw new Error(`HTTP ${response.status}: ${response.statusText}. A coluna admin_id pode não existir. Execute o script SQL adicionar_admin_id_resellers.sql no Supabase.`);
            }
          }
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ [useRevendas] Revendedores buscados com sucesso:', data?.length || 0, 'revendedores');
        
        // Se não encontrou nenhum revenda com admin_id, pode ser que os revendas existentes não tenham admin_id
        // Tentar buscar todos os revendas e filtrar manualmente
        if ((!data || data.length === 0) && adminId) {
          console.log('🔄 [useRevendas] Nenhum revenda encontrado com admin_id. Buscando todos os revendas para verificar...');
          
          try {
            const allRevendasUrl = `${SUPABASE_URL}/rest/v1/resellers?select=*`;
            const allResponse = await fetch(allRevendasUrl, {
              method: 'GET',
              headers,
            });
            
            if (allResponse.ok) {
              const allData = await allResponse.json();
              console.log('🔄 [useRevendas] Total de revendas no banco:', allData?.length || 0);
              
              // Filtrar manualmente: incluir revendas sem admin_id ou com admin_id do admin logado
              const filteredData = Array.isArray(allData) ? allData.filter((revenda: any) => {
                return !revenda.admin_id || revenda.admin_id === adminId;
              }) : [];
              
              console.log('✅ [useRevendas] Revendas filtrados manualmente:', filteredData?.length || 0);
              setRevendas(filteredData);
              
              if (allData && allData.length > 0 && filteredData.length === 0) {
                console.warn('⚠️ [useRevendas] Existem revendas no banco, mas nenhum pertence a este admin. Execute o script SQL adicionar_admin_id_resellers.sql para associar revendas aos admins.');
              }
              return;
            }
          } catch (allError) {
            console.error('❌ [useRevendas] Erro ao buscar todos os revendas:', allError);
          }
        }
        
        setRevendas(data || []);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        // Ignorar erros de abort
        if (fetchError.name === 'AbortError') {
          console.log('🔄 [useRevendas] Requisição abortada (nova requisição iniciada)');
          return;
        }
        throw fetchError;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ [useRevendas] Erro inesperado ao buscar revendedores:', err);
      console.error('❌ [useRevendas] Detalhes:', {
        message: errorMessage,
        error: err
      });
      
      // Verificar se é erro de RLS
      if (errorMessage.includes('row-level security policy')) {
        setError('Erro de permissão: As políticas de segurança estão bloqueando o acesso. Execute o script SQL para corrigir as políticas RLS.');
      } else {
        setError(`Erro inesperado: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      console.log('✅ [useRevendas] Busca finalizada');
    }
  }, [user?.id]); // Recarregar quando o admin mudar
  
  // Buscar revendas quando o componente montar ou quando o admin mudar
  useEffect(() => {
    fetchRevendas();
  }, [fetchRevendas]);

  async function addRevenda(revenda: Omit<Revenda, 'id'>) {
    try {
      setError(null);
      
      // Preparar dados para inserção, garantindo tipos corretos
      // Gerar email único se não fornecido
      let email = revenda.email;
      if (!email || email.trim() === '') {
        // Gerar email único baseado no username e timestamp
        const timestamp = Date.now();
        email = `${revenda.username}_${timestamp}@revenda.local`;
        console.log('🔄 [useRevendas] Email não fornecido, gerando email único:', email);
      }
      
      // Validar email
      if (!email || !email.includes('@')) {
        const errorMsg = 'Email inválido: O email é obrigatório e deve ser válido.';
        console.error('❌ [useRevendas]', errorMsg);
        setError(errorMsg);
        return false;
      }
      
      // Obter o admin logado para associar o revenda (user já está disponível no escopo do hook)
      const adminId = user?.id;
      
      if (!adminId) {
        const errorMsg = 'Erro: Você precisa estar logado como admin para criar um revenda.';
        console.error('❌ [useRevendas]', errorMsg);
        setError(errorMsg);
        return false;
      }
      
      console.log('🔄 [useRevendas] Associando revenda ao admin:', adminId);
      
      // NOVA ABORDAGEM: Tentar inserir SEM admin_id primeiro (mais compatível)
      // Se funcionar, depois tentamos atualizar com admin_id se a coluna existir
      const revendaData: any = {
        username: revenda.username.trim(),
        email: email.trim(),
        password: revenda.password,
        permission: revenda.permission,
        credits: revenda.credits ?? 10,
        personal_name: revenda.personal_name?.trim() || null,
        status: revenda.status || 'Ativo',
        force_password_change: typeof revenda.force_password_change === 'string' 
          ? revenda.force_password_change === 'true' 
          : revenda.force_password_change ?? false,
        monthly_reseller: revenda.monthly_reseller ?? false,
        disable_login_days: revenda.disable_login_days ?? 0,
      };
      
      // NÃO adicionar admin_id inicialmente - vamos tentar inserir sem ele primeiro
      // Isso evita erros se a coluna não existir
      
      // Adicionar campos opcionais apenas se tiverem valor
      if (revenda.servers) revendaData.servers = revenda.servers;
      if (revenda.master_reseller) revendaData.master_reseller = revenda.master_reseller;
      if (revenda.telegram) revendaData.telegram = revenda.telegram;
      if (revenda.whatsapp) revendaData.whatsapp = revenda.whatsapp;
      if (revenda.observations) revendaData.observations = revenda.observations;
      
      console.log('🔄 [useRevendas] Tentando adicionar revendedor:', revendaData);
      console.log('🔄 [useRevendas] JSON serializado:', JSON.stringify(revendaData, null, 2));
      
      // Obter token de autenticação do localStorage (igual ao useClientes)
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
                console.log('🔄 [useRevendas] Token encontrado no localStorage');
                break;
              }
            }
          } catch (e) {
            // Continuar procurando
          }
        }
        
        if (!authToken) {
          console.log('🔄 [useRevendas] Token não encontrado, usando apenas apikey');
        }
      } catch (e) {
        console.log('🔄 [useRevendas] Erro ao buscar token:', e);
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
        console.log('🔄 [useRevendas] Fazendo requisição POST...');
        response = await fetch(insertUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(revendaData),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        console.log('🔄 [useRevendas] Requisição completa, status:', response.status);
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
      console.log('🔄 [useRevendas] Headers da resposta:', Object.fromEntries(response.headers.entries()));
      
      // Ler o responseText primeiro (só pode ser lido uma vez)
      const responseText = await response.text();
      console.log('🔄 [useRevendas] Resposta do Supabase:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        responseTextLength: responseText.length,
        responseTextPreview: responseText.substring(0, 200)
      });
      
      // Processar a resposta
      console.log('🔄 [useRevendas] Processando resposta...');
      console.log('🔄 [useRevendas] Status:', response.status, 'OK:', response.ok);
      console.log('🔄 [useRevendas] Resposta completa (texto):', responseText);
      console.log('🔄 [useRevendas] Tamanho da resposta:', responseText.length);
      
      let data;
      let error: any = null;
      
      // Se a resposta não está OK, tratar como erro
      if (!response.ok) {
        console.error('❌ [useRevendas] Resposta não OK:', response.status, response.statusText);
        console.error('❌ [useRevendas] Response Text:', responseText);
        
        // Tentar parsear o erro
        try {
          error = JSON.parse(responseText);
        } catch (e) {
          error = {
            code: response.status.toString(),
            message: response.statusText || 'Erro desconhecido',
            details: responseText,
          };
        }
        
        // Verificar tipo de erro específico
        if (response.status === 403 || responseText.includes('row-level security') || responseText.includes('permission denied')) {
          const errorMsg = 'Erro de permissão (RLS): As políticas de segurança estão bloqueando a inserção. Verifique as políticas RLS no Supabase ou execute o script SQL para corrigir.';
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
          return false;
        } else if (response.status === 400) {
          // Erro 400 pode ser coluna não existe ou dados inválidos
          const errorMsg = `Erro de validação (400): ${error?.message || responseText || 'Dados inválidos ou coluna não existe'}`;
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
          return false;
        } else {
          const errorMsg = `Erro ao inserir revenda (Status ${response.status}): ${error?.message || responseText || 'Erro desconhecido'}`;
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
          return false;
        }
      }
      
      // Verificar se a resposta está vazia
      if (!responseText || responseText.trim().length === 0) {
        console.warn('⚠️ [useRevendas] Resposta vazia do Supabase');
        console.warn('⚠️ [useRevendas] Status:', response.status);
        console.warn('⚠️ [useRevendas] Status Text:', response.statusText);
        
        // Se a resposta está OK mas vazia, pode ser que o Prefer não funcionou
        // Mas também pode ser um problema de RLS que não está retornando erro
        if (response.ok && (response.status === 201 || response.status === 200 || response.status === 204)) {
          console.log('🔄 [useRevendas] Resposta OK mas vazia (status ' + response.status + '), verificando se inserção foi bem-sucedida...');
          
          // Aguardar um pouco para garantir que o Supabase processou a inserção
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Tentar buscar o revenda recém-criado pelo username
          try {
            console.log('🔄 [useRevendas] Buscando revenda recém-criado pelo username:', revendaData.username);
            const verifyHeaders: HeadersInit = {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
            };
            
            if (authToken) {
              verifyHeaders['Authorization'] = `Bearer ${authToken}`;
            }
            
            const verifyUrl = `${SUPABASE_URL}/rest/v1/resellers?username=eq.${encodeURIComponent(revendaData.username)}&select=*`;
            console.log('🔄 [useRevendas] URL de verificação:', verifyUrl);
            
            const verifyResponse = await fetch(verifyUrl, {
              method: 'GET',
              headers: verifyHeaders,
            });
            
            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              console.log('🔄 [useRevendas] Dados de verificação:', verifyData);
              
              if (verifyData && Array.isArray(verifyData) && verifyData.length > 0) {
                console.log('✅ [useRevendas] Revenda encontrado após inserção!');
                const newRevenda = verifyData[0] as Revenda;
                setRevendas(prevRevendas => {
                  const exists = prevRevendas.find(r => r.id === newRevenda.id || r.username === newRevenda.username);
                  if (exists) {
                    return prevRevendas.map(r => r.id === newRevenda.id ? newRevenda : r);
                  }
                  return [...prevRevendas, newRevenda];
                });
                return true;
              } else {
                console.error('❌ [useRevendas] Revenda não encontrado após inserção. Pode ser um problema de RLS ou a inserção não foi bem-sucedida.');
                setError('Erro: A inserção foi confirmada pelo servidor, mas o revenda não foi encontrado. Isso pode indicar um problema com as políticas RLS. Verifique as políticas no Supabase.');
                return false;
              }
            } else {
              console.error('❌ [useRevendas] Erro ao verificar inserção:', verifyResponse.status, verifyResponse.statusText);
              const verifyErrorText = await verifyResponse.text();
              console.error('❌ [useRevendas] Erro de verificação:', verifyErrorText);
              
              // Se o erro for 403 ou relacionado a RLS, indicar problema de RLS
              if (verifyResponse.status === 403 || verifyErrorText.includes('row-level security') || verifyErrorText.includes('permission denied')) {
                setError('Erro de permissão: As políticas de segurança (RLS) estão bloqueando a inserção ou leitura. Execute o script SQL para corrigir as políticas RLS no Supabase Dashboard.');
                return false;
              }
              
              // Se não conseguir verificar, tratar como erro
              setError(`Erro ao verificar inserção: ${verifyResponse.status} ${verifyResponse.statusText}. A inserção pode não ter sido bem-sucedida. Verifique as políticas RLS no Supabase.`);
              return false;
            }
          } catch (verifyError) {
            console.error('❌ [useRevendas] Erro ao verificar inserção:', verifyError);
            const errorMsg = verifyError instanceof Error ? verifyError.message : 'Erro desconhecido ao verificar inserção';
            setError(`Erro ao verificar inserção: ${errorMsg}. A inserção pode não ter sido bem-sucedida. Verifique as políticas RLS no Supabase.`);
            return false;
          }
        } else {
          // Se não está OK, tratar como erro
          error = {
            code: response.status.toString(),
            message: response.statusText || 'Erro desconhecido',
            details: 'Resposta vazia do servidor - Status: ' + response.status,
          };
        }
      } else {
        try {
          data = JSON.parse(responseText);
          console.log('🔄 [useRevendas] Resposta parseada:', data);
        } catch (parseError) {
          console.error('❌ [useRevendas] Erro ao fazer parse da resposta:', parseError);
          console.error('❌ [useRevendas] Texto que falhou no parse:', responseText);
          if (!response.ok) {
            error = {
              code: response.status.toString(),
              message: response.statusText || 'Erro desconhecido',
              details: responseText,
            };
          }
        }
      }
      
      // Verificar se houve erro (não OK ou erro retornado)
      // IMPORTANTE: Status 201, 200, 204 são considerados sucesso
      const isSuccess = response.ok && (response.status === 201 || response.status === 200 || response.status === 204);
      
      if (!isSuccess || error) {
        const errorObj = error || data || {
          code: response.status.toString(),
          message: response.statusText || 'Erro desconhecido',
          details: responseText || 'Nenhum detalhe disponível',
        };
        
        console.error('❌ [useRevendas] Erro do Supabase:', errorObj);
        console.error('❌ [useRevendas] Status:', response.status);
        console.error('❌ [useRevendas] Status Text:', response.statusText);
        console.error('❌ [useRevendas] Response OK:', response.ok);
        console.error('❌ [useRevendas] Dados enviados:', JSON.stringify(revendaData, null, 2));
        console.error('❌ [useRevendas] Response Text:', responseText);
        
        // Verificar tipo de erro
        if (response.status === 401 || errorObj.message?.includes('401') || errorObj.message?.includes('Unauthorized') || errorObj.details?.includes('401')) {
          const errorMsg = 'Erro de autenticação: Sua sessão expirou. Por favor, faça login novamente.';
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
        } else if (response.status === 403 || errorObj.message?.includes('row-level security policy') || errorObj.message?.includes('new row violates row-level security') || errorObj.details?.includes('row-level security') || errorObj.message?.includes('permission denied') || errorObj.details?.includes('permission denied')) {
          const errorMsg = 'Erro de permissão: As políticas de segurança (RLS) estão bloqueando a inserção. Execute o script SQL para corrigir as políticas RLS ou verifique se você está autenticado. Status: ' + response.status;
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
        } else if (response.status === 409 || errorObj.message?.includes('duplicate key') || errorObj.details?.includes('duplicate') || errorObj.message?.includes('already exists')) {
          const errorMsg = 'Erro: Já existe um revendedor com este username ou email.';
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
        } else if (response.status === 400 || errorObj.message?.includes('violates') || errorObj.message?.includes('constraint') || errorObj.details?.includes('violates')) {
          const errorMsg = `Erro de validação: ${errorObj.message || errorObj.details || 'Dados inválidos'} (Status: ${response.status})`;
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
        } else {
          // Para outros erros, mostrar mensagem mais detalhada
          const errorMsg = `Erro ao adicionar revendedor (Status: ${response.status}): ${errorObj.message || errorObj.details || response.statusText || 'Erro desconhecido'}`;
          console.error('❌ [useRevendas]', errorMsg);
          setError(errorMsg);
        }
        return false;
      }
      
      console.log('✅ [useRevendas] Revendedor inserido com sucesso!');
      console.log('✅ [useRevendas] Dados retornados:', data);
      console.log('✅ [useRevendas] Tipo dos dados:', typeof data, Array.isArray(data) ? 'Array' : 'Object');
      
      // Se inseriu com sucesso mas não tem admin_id, tentar atualizar com admin_id (se a coluna existir)
      if (data && (Array.isArray(data) ? data.length > 0 : true)) {
        const insertedRevenda = Array.isArray(data) ? data[0] : data;
        if (insertedRevenda && !insertedRevenda.admin_id && adminId) {
          console.log('🔄 [useRevendas] Tentando atualizar revenda com admin_id após inserção...');
          try {
            const updateHeaders: HeadersInit = {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
            };
            if (authToken) {
              updateHeaders['Authorization'] = `Bearer ${authToken}`;
            }
            
            const updateUrl = `${SUPABASE_URL}/rest/v1/resellers?id=eq.${insertedRevenda.id}`;
            const updateResponse = await fetch(updateUrl, {
              method: 'PATCH',
              headers: updateHeaders,
              body: JSON.stringify({ admin_id: adminId }),
            });
            
            if (updateResponse.ok) {
              console.log('✅ [useRevendas] admin_id atualizado com sucesso!');
              const updateData = await updateResponse.json();
              if (updateData && Array.isArray(updateData) && updateData.length > 0) {
                data = updateData;
              }
            } else {
              console.warn('⚠️ [useRevendas] Não foi possível atualizar admin_id (coluna pode não existir):', updateResponse.status);
            }
          } catch (updateError) {
            console.warn('⚠️ [useRevendas] Erro ao tentar atualizar admin_id:', updateError);
          }
        }
      }
      
      // Adicionar o revendedor diretamente ao estado ou buscar novamente
      if (data && Array.isArray(data) && data.length > 0) {
        const newRevenda = data[0] as Revenda;
        console.log('✅ [useRevendas] Revendedor retornado:', newRevenda);
        setRevendas(prevRevendas => {
          // Verificar se já existe para evitar duplicatas
          const exists = prevRevendas.find(r => r.id === newRevenda.id || r.username === newRevenda.username);
          if (exists) {
            console.log('⚠️ [useRevendas] Revendedor já existe na lista, atualizando...');
            return prevRevendas.map(r => r.id === newRevenda.id ? newRevenda : r);
          }
          console.log('✅ [useRevendas] Adicionando revenda ao estado. Total antes:', prevRevendas.length, 'Total depois:', prevRevendas.length + 1);
          return [...prevRevendas, newRevenda];
        });
        console.log('✅ [useRevendas] Revendedor adicionado ao estado local');
        
        // Forçar atualização da lista também
        setTimeout(() => {
          console.log('🔄 [useRevendas] Forçando atualização da lista após adicionar ao estado...');
          fetchRevendas();
        }, 500);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Se retornou um objeto único ao invés de array
        console.log('✅ [useRevendas] Revendedor retornado como objeto único:', data);
        const newRevenda = data as Revenda;
        setRevendas(prevRevendas => {
          const exists = prevRevendas.find(r => r.id === newRevenda.id || r.username === newRevenda.username);
          if (exists) {
            console.log('⚠️ [useRevendas] Revendedor já existe na lista, atualizando...');
            return prevRevendas.map(r => r.id === newRevenda.id ? newRevenda : r);
          }
          console.log('✅ [useRevendas] Adicionando revenda ao estado. Total antes:', prevRevendas.length, 'Total depois:', prevRevendas.length + 1);
          return [...prevRevendas, newRevenda];
        });
        console.log('✅ [useRevendas] Revendedor adicionado ao estado local');
        
        // Forçar atualização da lista também
        setTimeout(() => {
          console.log('🔄 [useRevendas] Forçando atualização da lista após adicionar ao estado...');
          fetchRevendas();
        }, 500);
      } else {
        // Se não conseguiu adicionar ao estado, verificar se foi inserido no banco
        console.log('⚠️ [useRevendas] Resposta não contém dados retornados');
        console.log('🔄 [useRevendas] Verificando se revenda foi inserido no banco...');
        
        // Aguardar um pouco para garantir que o Supabase processou
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tentar buscar o revenda recém-criado pelo username
        try {
          const verifyHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
          };
          
          if (authToken) {
            verifyHeaders['Authorization'] = `Bearer ${authToken}`;
          }
          
          const verifyUrl = `${SUPABASE_URL}/rest/v1/resellers?username=eq.${encodeURIComponent(revendaData.username)}&select=*`;
          console.log('🔄 [useRevendas] Verificando inserção:', verifyUrl);
          
          const verifyResponse = await fetch(verifyUrl, {
            method: 'GET',
            headers: verifyHeaders,
          });
          
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            console.log('🔄 [useRevendas] Dados encontrados na verificação:', verifyData);
            
            if (verifyData && Array.isArray(verifyData) && verifyData.length > 0) {
              console.log('✅ [useRevendas] Revenda encontrado após inserção!');
              const newRevenda = verifyData[0] as Revenda;
              setRevendas(prevRevendas => {
                const exists = prevRevendas.find(r => r.id === newRevenda.id || r.username === newRevenda.username);
                if (exists) {
                  return prevRevendas.map(r => r.id === newRevenda.id ? newRevenda : r);
                }
                console.log('✅ [useRevendas] Adicionando revenda verificado ao estado. Total antes:', prevRevendas.length, 'Total depois:', prevRevendas.length + 1);
                return [...prevRevendas, newRevenda];
              });
              console.log('✅ [useRevendas] Lista atualizada com revenda inserido!');
              
              // Forçar atualização da lista também
              setTimeout(() => {
                console.log('🔄 [useRevendas] Forçando atualização da lista após verificação...');
                fetchRevendas();
              }, 500);
              
              return true;
            } else {
              console.error('❌ [useRevendas] Revenda não encontrado após inserção');
              console.error('❌ [useRevendas] Isso indica que a inserção não foi bem-sucedida, possivelmente devido a RLS');
              setError('Erro: A inserção não foi bem-sucedida. O revenda não foi encontrado no banco de dados. Isso pode indicar um problema com as políticas RLS. Verifique as políticas no Supabase Dashboard.');
              return false;
            }
          } else {
            console.error('❌ [useRevendas] Erro ao verificar inserção:', verifyResponse.status, verifyResponse.statusText);
            setError(`Erro ao verificar inserção: ${verifyResponse.status} ${verifyResponse.statusText}. A inserção pode não ter sido bem-sucedida.`);
            return false;
          }
        } catch (verifyError) {
          console.error('❌ [useRevendas] Erro ao verificar inserção:', verifyError);
          // Tentar buscar todos os revendas como fallback
          console.log('🔄 [useRevendas] Buscando lista completa de revendas como fallback...');
        await fetchRevendas();
          // Retornar true porque não sabemos ao certo se falhou ou não
          return true;
        }
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
      console.log('🔄 [useRevendas] Deletando revendedor com ID:', id);
      
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
                console.log('🔄 [useRevendas] Token encontrado no localStorage');
                break;
              }
            }
          } catch (e) {
            // Continuar procurando
          }
        }
        
        if (!authToken) {
          console.log('🔄 [useRevendas] Token não encontrado, usando apenas apikey');
        }
      } catch (e) {
        console.log('🔄 [useRevendas] Erro ao buscar token:', e);
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
      const deleteUrl = `${SUPABASE_URL}/rest/v1/resellers?id=eq.${id}`;
      console.log('🔄 [useRevendas] URL de exclusão:', deleteUrl);
      console.log('🔄 [useRevendas] Headers:', { ...headers, Authorization: authToken ? 'Bearer ***' : 'Não fornecido' });
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Erro HTTP: ${response.status} ${response.statusText}`;
        console.error('❌ [useRevendas] Erro ao deletar revendedor:', errorMessage);
        
        // Verificar se é erro de RLS
        if (errorMessage.includes('row-level security policy') || errorMessage.includes('permission denied')) {
          setError('Erro de permissão: As políticas de segurança estão bloqueando a exclusão. Execute o script SQL para corrigir as políticas RLS.');
        } else {
          setError(`Erro ao deletar revendedor: ${errorMessage}`);
        }
        return false;
      }
      
      console.log('✅ [useRevendas] Revendedor deletado com sucesso');
      
      // Atualizar lista de revendedores
      await fetchRevendas();
      
      // Atualizar estado local removendo o revendedor deletado
      setRevendas(prevRevendas => prevRevendas.filter(revenda => revenda.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro inesperado ao deletar revendedor: ${errorMessage}`);
      console.error('❌ [useRevendas] Erro ao deletar revendedor:', err);
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