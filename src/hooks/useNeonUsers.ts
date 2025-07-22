import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  m3u_url?: string;
  bouquets?: string;
  expiration_date?: string;
  observations?: string;
  real_name?: string; // Campo para o nome real
  telegram?: string; // Campo para telegram
  whatsapp?: string; // Campo para whatsapp
  status?: string; // Campo para status
  devices?: number; // Campo para número de dispositivos
  credits?: number; // Campo para créditos
  notes?: string; // Campo para anotações
  created_at: string;
  updated_at: string;
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

const API_BASE = '/api';

export const useNeonUsers = (): UseNeonUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      
      if (data.success) {
        console.log('📋 Usuários retornados do backend:', data.users);
        console.log('Exemplo de usuário:', data.users[0]);
        console.log('Campos disponíveis:', data.users[0] ? Object.keys(data.users[0]) : 'Nenhum usuário');
        setUsers(data.users);
      } else {
        setError(data.message || 'Erro ao buscar usuários');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchUsers(); // Recarregar lista
        return true;
      } else {
        setError(data.message || 'Erro ao criar usuário');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao criar usuário:', err);
      return false;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...userData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchUsers(); // Recarregar lista
        return true;
      } else {
        setError(data.message || 'Erro ao atualizar usuário');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao atualizar usuário:', err);
      return false;
    }
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchUsers(); // Recarregar lista
        return true;
      } else {
        setError(data.message || 'Erro ao deletar usuário');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao deletar usuário:', err);
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