
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Revenda {
  id: number | string;
  name: string;
  username?: string; // Compatibilidade
  email: string;
  whatsapp?: string;
  plan: string;
  credits?: number;
  status?: string;
  created_at?: string;
  server?: string;
  expiration_date?: string;

  // Campos legados/opcionais para UI
  permission?: string;
  personal_name?: string;
  servers?: string;
  master_reseller?: string;
  disable_login_days?: number;
  monthly_reseller?: boolean;
  telegram?: string;
  observations?: string;
  force_password_change?: boolean;
}

export function useRevendas() {
  const { token, user } = useAuth();
  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRevendas = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/resellers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar revendedores');
      }

      const data = await response.json() as Revenda[];
      setRevendas(data);

    } catch (err: unknown) {
      console.error('Erro ao buscar revendas:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao buscar revendas';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Carrega ao montar
  useEffect(() => {
    fetchRevendas();
  }, [fetchRevendas]);

  const addRevenda = async (data: Partial<Revenda> & { password?: string }) => {
    if (!token) {
      toast.error('Você precisa estar logado.');
      return false;
    }

    try {
      const response = await fetch('/api/resellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar revenda');
      }

      toast.success('Revendedor criado com sucesso!');
      fetchRevendas(); // Atualiza a lista
      return true;

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar revenda';
      toast.error(msg);
      return false;
    }
  };

  const updateRevenda = async (id: number | string, updates: Partial<Revenda>) => {
    toast.info('Atualização de revenda em implementação');
    return true;
  };

  const deleteRevenda = async (id: number | string) => {
    toast.info('Deleção de revenda em implementação');
    return true;
  };

  const clearError = () => setError(null);

  return {
    revendas,
    loading,
    error,
    fetchRevendas,
    addRevenda,
    updateRevenda,
    deleteRevenda,
    clearError
  };
}