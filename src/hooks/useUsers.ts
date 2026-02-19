
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Interface compatível com o resto da aplicação
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
  server?: string;
  pago?: boolean | number | string;
  price?: string;
}

export const useUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro API: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar usuários (useUsers):', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    if (!token) throw new Error('Token não fornecido');

    try {
      setError(null);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        const errData = await response.json() as { error?: string };
        throw new Error(errData.error || 'Erro ao adicionar usuário');
      }

      const newUser = await response.json() as User;
      setUsers(prevUsers => [newUser, ...prevUsers]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    if (!token) throw new Error('Token não fornecido');

    try {
      setError(null);
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errData = await response.json() as { error?: string };
        throw new Error(errData.error || 'Erro ao atualizar usuário');
      }

      const updatedUser = await response.json() as Partial<User>;
      setUsers(prevUsers =>
        prevUsers.map(user => user.id === id ? { ...user, ...updatedUser } : user)
      );
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    if (!token) throw new Error('Token não fornecido');

    try {
      setError(null);
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário');
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
  }, [fetchUsers]);

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
