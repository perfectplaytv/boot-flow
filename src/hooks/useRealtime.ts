import { useEffect, useState, useCallback } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase.types';

type Table = 'profiles' | 'cobrancas' | 'users' | 'resellers';
type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions<T> {
  table: Table;
  filter?: string;
  event?: EventType;
  schema?: string;
  onPayload?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export function useRealtime<T>({
  table,
  filter = '*',
  event = '*',
  schema = 'public',
  onPayload,
}: UseRealtimeOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Função para buscar dados iniciais
  const fetchData = useCallback(async () => {
    try {
      const { data: initialData, error: queryError } = await supabase
        .from(table)
        .select('*');

      if (queryError) throw queryError;
      
      setData(initialData || []);
      return initialData || [];
    } catch (err) {
      console.error(`Erro ao buscar dados iniciais da tabela ${table}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    }
  }, [table]);

  // Configura a assinatura em tempo real
  useEffect(() => {
    // Busca os dados iniciais
    fetchData();

    // Configura a assinatura para mudanças em tempo real
    const subscription = supabase
      .channel(`realtime_${table}`)
      .on(
        'postgres_changes',
        {
          event: event as any,
          schema,
          table,
          filter,
        },
        (payload) => {
          // Atualiza o estado local com base no tipo de evento
          setData((currentData) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...currentData, payload.new as T];
              case 'UPDATE':
                return currentData.map((item: any) =>
                  item.id === (payload.new as any).id ? (payload.new as T) : item
                );
              case 'DELETE':
                return currentData.filter((item: any) => item.id !== (payload.old as any).id);
              default:
                return currentData;
            }
          });

          // Chama o callback personalizado, se fornecido
          if (onPayload) {
            onPayload(payload as RealtimePostgresChangesPayload<T>);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'CHANNEL_ERROR') {
          console.error('Erro na conexão em tempo real');
          setError(new Error('Erro na conexão em tempo real'));
        } else if (status === 'TIMED_OUT') {
          console.error('Conexão em tempo real expirada');
          setError(new Error('Conexão em tempo real expirada'));
        } else if (status === 'CLOSED') {
          console.log('Conexão em tempo real fechada');
          setIsConnected(false);
        }
      });

    // Limpeza da assinatura ao desmontar o componente
    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter, event, schema, onPayload, fetchData]);

  // Função para forçar uma atualização dos dados
  const refresh = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  return { data, error, isConnected, refresh };
}

// Hook específico para a tabela de perfis
export function useRealtimeProfiles() {
  return useRealtime<Database['public']['Tables']['profiles']['Row']>({
    table: 'profiles',
    event: '*',
  });
}

// Hook específico para a tabela de cobranças
export function useRealtimeCobrancas() {
  return useRealtime<Database['public']['Tables']['cobrancas']['Row']>({
    table: 'cobrancas',
    event: '*',
  });
}

// Hook específico para a tabela de clientes
export function useRealtimeClientes() {
  return useRealtime<Database['public']['Tables']['clientes']['Row']>({
    table: 'clientes',
    event: '*',
  });
}

// Hook específico para a tabela de revendas
export function useRealtimeRevendas() {
  return useRealtime<Database['public']['Tables']['revendas']['Row']>({
    table: 'revendas',
    event: '*',
  });
}
