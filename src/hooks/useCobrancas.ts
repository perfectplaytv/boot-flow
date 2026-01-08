
import { useState, useEffect } from 'react';

export interface Cobranca {
  id: number;
  cliente: string;
  email: string;
  descricao: string;
  valor: number;
  vencimento: string;
  status: string;
  tipo: string;
  gateway?: string;
  formaPagamento?: string;
  tentativas?: number;
  ultimaTentativa?: string;
  proximaTentativa?: string;
  observacoes?: string;
  tags?: string[];
}

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false to avoid infinite loading
  const [error, setError] = useState<string | null>(null);

  async function fetchCobrancas() {
    // Mock implementation because endpoint /api/cobrancas does not exist yet
    setLoading(false);
    setCobrancas([]);
    // setError("API de cobranças ainda não implementada.");
  }

  async function addCobranca(cobranca: Omit<Cobranca, 'id'>) {
    console.warn('API de cobranças não implementada. Cobrança não salva:', cobranca);
    return true; // Pretend success
  }

  async function updateCobranca(id: number, updates: Partial<Cobranca>) {
    console.warn('API de cobranças não implementada. Update ignorado:', id, updates);
    return true;
  }

  async function deleteCobranca(id: number) {
    console.warn('API de cobranças não implementada. Delete ignorado:', id);
    return true;
  }

  useEffect(() => {
    fetchCobrancas();
  }, []);

  return {
    cobrancas,
    loading,
    error,
    addCobranca,
    updateCobranca,
    deleteCobranca,
    fetchCobrancas,
    clearError: () => setError(null)
  };
}
