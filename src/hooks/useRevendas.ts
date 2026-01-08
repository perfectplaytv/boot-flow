
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Revenda {
  id: number | string;
  name: string;
  email: string;
  whatsapp?: string;
  plan: string;
  credits?: number;
  status?: string;
  created_at?: string;
  server?: string;
  expiration_date?: string;
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

  const addRevenda = async (data: { name: string; email: string; password?: string; whatsapp?: string }) => {
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

  return {
    revendas,
    loading,
    error,
    fetchRevendas,
    addRevenda
  };
}