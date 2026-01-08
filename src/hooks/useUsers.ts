
import { useState, useEffect, useCallback } from 'react';

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
  admin_id?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users');
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
  }, []);

  const addUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        const errData = await response.json() as any;
        throw new Error(errData.error || 'Erro ao adicionar usuário');
      }

      const newUser = await response.json();
      setUsers(prevUsers => [newUser, ...prevUsers]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      setError(null);
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errData = await response.json() as any;
        throw new Error(errData.error || 'Erro ao atualizar usuário');
      }

      const updatedUser = await response.json();
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
    try {
      setError(null);
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
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
