import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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

  async function fetchClientes() {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
    if (error) setError(error.message);
    else setClientes(data || []);
    setLoading(false);
  }

  async function addCliente(cliente: Omit<Cliente, 'id'>) {
    const { error } = await supabase.from('users').insert([cliente]);
    if (error) setError(error.message);
    else await fetchClientes();
  }

  async function updateCliente(id: number, updates: Partial<Cliente>) {
    const { error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) setError(error.message);
    else await fetchClientes();
  }

  async function deleteCliente(id: number) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) setError(error.message);
    else await fetchClientes();
  }

  useEffect(() => { fetchClientes(); }, []);

  return { clientes, loading, error, addCliente, updateCliente, deleteCliente, fetchClientes };
} 