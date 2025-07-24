import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  m3u_url?: string;
  bouquets?: string;
  expiration_date?: string;
  observations?: string;
  real_name?: string;
  telegram?: string;
  whatsapp?: string;
  status?: string;
  devices?: number;
  credits?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Legacy compatibility fields
  plan?: string;
  createdAt?: string;
  phone?: string;
  renewalDate?: string;
  expirationDate?: string;
  realName?: string;
}

interface UseNeonUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateUser: (id: number, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  refreshUsers: () => Promise<void>;
}

export const useNeonUsers = (): UseNeonUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: supaError } = await supabase.from('users').select('*');
      if (supaError) {
        setError('Erro ao buscar usuários do Supabase');
        setUsers([]);
      } else {
        const processedUsers = (data || []).map(user => ({
          ...user,
          // Add legacy compatibility fields
          plan: 'Basic',
          createdAt: user.created_at,
          phone: '',
          renewalDate: user.expiration_date,
          expirationDate: user.expiration_date,
          realName: user.real_name
        }));
        setUsers(processedUsers);
      }
    } catch (err) {
      setError('Erro de conexão com o Supabase');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      setError(null);
      const { error: supaError } = await supabase.from('users').insert([userData]);
      if (supaError) {
        setError('Erro ao criar usuário no Supabase');
        return false;
      }
      await fetchUsers();
      return true;
    } catch (err) {
      setError('Erro de conexão com o Supabase');
      return false;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
    try {
      setError(null);
      const { error: supaError } = await supabase.from('users').update(userData).eq('id', id);
      if (supaError) {
        setError('Erro ao atualizar usuário no Supabase');
        return false;
      }
      await fetchUsers();
      return true;
    } catch (err) {
      setError('Erro de conexão com o Supabase');
      return false;
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const { error: supaError } = await supabase.from('users').delete().eq('id', id);
      if (supaError) {
        setError('Erro ao deletar usuário no Supabase');
        return false;
      }
      await fetchUsers();
      return true;
    } catch (err) {
      setError('Erro de conexão com o Supabase');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers: fetchUsers,
  };
};