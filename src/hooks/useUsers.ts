import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  created_at: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  notes?: string;
  devices?: number;
  credits?: number;
  renewal_date?: string;
  password?: string;
  observations?: string;
  expiration_date?: string;
  bouquets?: string;
  m3u_url?: string;
  real_name?: string;
  updated_at?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        console.error('Erro ao buscar usuários:', fetchError);
        return;
      }

      setUsers(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([{
          ...user,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        console.error('Erro ao adicionar usuário:', insertError);
        throw insertError;
      }

      setUsers(prevUsers => [data, ...prevUsers]);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        setError(updateError.message);
        console.error('Erro ao atualizar usuário:', updateError);
        throw updateError;
      }

      setUsers(prevUsers => 
        prevUsers.map(user => user.id === id ? { ...user, ...data } : user)
      );
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (deleteError) {
        setError(deleteError.message);
        console.error('Erro ao deletar usuário:', deleteError);
        throw deleteError;
      }

      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  };

  const getActiveUsers = () => {
    return users.filter(user => user.status === 'Ativo');
  };

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    getActiveUsers,
    getUserById,
    refetch: fetchUsers
  };
}; 