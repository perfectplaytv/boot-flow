import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
}

export function useRevendas() {
  const [revendas, setRevendas] = useState<Revenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRevendas() {
    setLoading(true);
    const { data, error } = await supabase.from('resellers').select('*');
    if (error) setError(error.message);
    else setRevendas(data || []);
    setLoading(false);
  }

  async function addRevenda(revenda: Omit<Revenda, 'id'>) {
    const { error } = await supabase.from('resellers').insert([revenda]);
    if (error) setError(error.message);
    else await fetchRevendas();
  }

  async function updateRevenda(id: number, updates: Partial<Revenda>) {
    const { error } = await supabase.from('resellers').update(updates).eq('id', id);
    if (error) setError(error.message);
    else await fetchRevendas();
  }

  async function deleteRevenda(id: number) {
    const { error } = await supabase.from('resellers').delete().eq('id', id);
    if (error) setError(error.message);
    else await fetchRevendas();
  }

  useEffect(() => { fetchRevendas(); }, []);

  return { revendas, loading, error, addRevenda, updateRevenda, deleteRevenda, fetchRevendas };
} 