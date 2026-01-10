
import { useState, useEffect, useCallback, useRef } from 'react';
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
  admin_id?: string;
  server?: string;
  role?: string;
  // Aliases for compatibility with camelCase usage in frontend
  realName?: string;
  expirationDate?: string;
  createdAt?: string;
}

export function useClientes() {
  const { user, userRole } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchClientes = useCallback(async () => {
    if (isFetchingRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    isFetchingRef.current = true;

    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        setClientes([]);
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch('/api/users', {
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json() as Cliente[];
        if (Array.isArray(data)) {
          // Filtrar administradores para não aparecerem na lista de clientes
          const filteredClients = data.filter(client =>
            client.plan !== 'admin' &&
            client.email !== 'pontonois@gmail.com' &&
            client.role !== 'admin' // Caso venha do backend
          );
          setClientes(filteredClients);
        } else {
          console.warn('Resposta inválida da API:', data);
          setClientes([]);
        }
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return;
        throw fetchError;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao buscar clientes: ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [user?.id]);

  async function addCliente(cliente: Omit<Cliente, 'id'>) {
    try {
      setError(null);
      if (!user?.id) {
        setError('Você precisa estar logado.');
        return false;
      }

      const clienteComAdmin = { ...cliente, owner_uid: user.id };
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let response: Response;
      try {
        response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteComAdmin),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (e) {
        clearTimeout(timeoutId);
        setError('Erro de conexão ou timeout.');
        return false;
      }

      if (!response.ok) {
        const txt = await response.text();
        console.error('Erro add:', txt);
        try {
          const json = JSON.parse(txt);
          setError(json.message || json.error || response.statusText);
        } catch {
          setError(`Erro ao adicionar: ${response.statusText}`);
        }
        return false;
      }

      const data = await response.json();

      // Atualizar lista
      if (data && !Array.isArray(data)) { // Se retornou objeto único
        setClientes(prev => [...prev, data as Cliente]);
      } else if (Array.isArray(data) && data.length > 0) {
        setClientes(prev => [...prev, data[0] as Cliente]);
      } else {
        await fetchClientes();
      }

      return true;
    } catch (err: unknown) {
      setError(`Erro inesperado: ${err instanceof Error ? err.message : 'Desconhecido'}`);
      return false;
    }
  }

  async function updateCliente(id: number, updates: Partial<Cliente>) {
    try {
      setError(null);
      if ('pago' in updates) updates.pago = Boolean(updates.pago);

      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const txt = await response.text();
        console.error('Erro update:', txt);
        setError(`Erro ao atualizar: ${response.statusText}`);
        return false;
      }

      const data = await response.json() as Partial<Cliente>;
      setClientes(prev => prev.map(c => c.id === id ? { ...c, ...updates, ...data } : c));
      return true;
    } catch (e: unknown) {
      setError(`Erro ao atualizar: ${e instanceof Error ? e.message : 'Desconhecido'}`);
      return false;
    }
  }

  async function deleteCliente(id: number) {
    try {
      setError(null);
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const txt = await response.text();
        setError(`Erro ao deletar: ${txt || response.statusText}`);
        return false;
      }

      setClientes(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: unknown) {
      setError(`Erro ao deletar: ${err instanceof Error ? err.message : 'Desconhecido'}`);
      return false;
    }
  }

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  return { clientes, loading, error, addCliente, updateCliente, deleteCliente, fetchClientes, clearError: () => setError(null) };
}