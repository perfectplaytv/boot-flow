import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCobrancas() {
    setLoading(true);
    const { data, error } = await supabase.from('cobrancas').select('*');
    if (error) setError(error.message);
    else setCobrancas(data || []);
    setLoading(false);
  }

  async function addCobranca(cobranca: Omit<Cobranca, 'id'>) {
    const { error } = await supabase.from('cobrancas').insert([cobranca]);
    if (error) setError(error.message);
    else await fetchCobrancas();
  }

  async function updateCobranca(id: number, updates: Partial<Cobranca>) {
    const { error } = await supabase.from('cobrancas').update(updates).eq('id', id);
    if (error) setError(error.message);
    else await fetchCobrancas();
  }

  async function deleteCobranca(id: number) {
    const { error } = await supabase.from('cobrancas').delete().eq('id', id);
    if (error) setError(error.message);
    else await fetchCobrancas();
  }

  useEffect(() => { fetchCobrancas(); }, []);

  return { cobrancas, loading, error, addCobranca, updateCobranca, deleteCobranca, fetchCobrancas };
} 