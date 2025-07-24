import { useState, useEffect } from 'react';

interface Reseller {
  id: number;
  username: string;
  password: string;
  force_password_change: boolean;
  permission: 'admin' | 'reseller' | 'subreseller';
  credits: number;
  servers?: string;
  master_reseller?: string;
  disable_login_days: number;
  monthly_reseller: boolean;
  personal_name?: string;
  email?: string;
  telegram?: string;
  whatsapp?: string;
  observations?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface UseNeonResellersReturn {
  resellers: Reseller[];
  loading: boolean;
  error: string | null;
  createReseller: (resellerData: Omit<Reseller, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<boolean>;
  updateReseller: (id: number, resellerData: Partial<Reseller>) => Promise<boolean>;
  deleteReseller: (id: number) => Promise<boolean>;
  refreshResellers: () => Promise<void>;
}

const API_BASE = '/.netlify/functions';

export const useNeonResellers = (): UseNeonResellersReturn => {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResellers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE}/resellers`);
      const data = await response.json();
      
      if (data.success) {
        setResellers(data.resellers);
      } else {
        setError(data.message || 'Erro ao buscar revendedores');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar revendedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const createReseller = async (resellerData: Omit<Reseller, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/resellers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resellerData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchResellers(); // Recarregar lista
        return true;
      } else {
        setError(data.message || 'Erro ao criar revendedor');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao criar revendedor:', err);
      return false;
    }
  };

  const updateReseller = async (id: number, resellerData: Partial<Reseller>): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/resellers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...resellerData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchResellers(); // Recarregar lista
        return true;
      } else {
        setError(data.message || 'Erro ao atualizar revendedor');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao atualizar revendedor:', err);
      return false;
    }
  };

  const deleteReseller = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE}/resellers`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchResellers(); // Recarregar lista
        return true;
      } else {
        setError(data.message || 'Erro ao deletar revendedor');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao deletar revendedor:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchResellers();
  }, []);

  return {
    resellers,
    loading,
    error,
    createReseller,
    updateReseller,
    deleteReseller,
    refreshResellers: fetchResellers,
  };
}; 