import React, { useState, useEffect } from 'react';
import { db } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

export interface User {
  id: number;
  name: string;
  email: string;
  plan: string;
  status: string;
  createdAt: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
  notes?: string;
  devices?: number;
  credits?: number;
  renewalDate?: string;
  password?: string;
  observations?: string;
  expirationDate?: string;
  bouquets?: string;
}

// Mapear dados do Supabase para interface User
const mapSupabaseUserToUser = (supabaseUser: Database['public']['Tables']['users']['Row']): User => ({
  id: supabaseUser.id,
  name: supabaseUser.name,
  email: supabaseUser.email,
  plan: 'Cliente', // Valor padrão
  status: 'Ativo', // Valor padrão
  createdAt: supabaseUser.created_at || new Date().toISOString(),
  observations: supabaseUser.observations || undefined,
  password: supabaseUser.password || undefined,
  expirationDate: supabaseUser.expiration_date || undefined,
  bouquets: supabaseUser.bouquets || undefined,
  m3uUrl: supabaseUser.m3u_url || undefined,
});
  { 
    id: 1, 
    name: "Isa 22", 
    email: "isa22@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-01-18",
    phone: "+55 11 44444-6666",
    telegram: "@isa22",
    whatsapp: "+55 11 44444-6666",
    notes: "Cliente fiel, sempre renova",
    devices: 2,
    credits: 75,
    renewalDate: "2024-02-18"
  },
  { 
    id: 2, 
    name: "Felipe 27", 
    email: "felipe27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-01-22",
    phone: "+55 11 33333-7777",
    telegram: "@felipe27",
    whatsapp: "+55 11 33333-7777",
    notes: "Cliente novo, potencial alto",
    devices: 1,
    credits: 30,
    renewalDate: "2024-02-22"
  },
  { 
    id: 3, 
    name: "Rafaela 27", 
    email: "rafael27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-01-25",
    phone: "+55 11 22222-8888",
    telegram: "@rafaela27",
    whatsapp: "+55 11 22222-8888",
    notes: "Cliente satisfeita com o serviço",
    devices: 3,
    credits: 60,
    renewalDate: "2024-02-25"
  },
  { 
    id: 4, 
    name: "Nivea 21 novo", 
    email: "nivea21@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-01-28",
    phone: "+55 11 11111-9999",
    telegram: "@nivea21",
    whatsapp: "+55 11 11111-9999",
    notes: "Cliente nova, muito ativa",
    devices: 2,
    credits: 45,
    renewalDate: "2024-02-28"
  },
  { 
    id: 5, 
    name: "Rafaela 27", 
    email: "juli27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-01",
    phone: "+55 11 00000-0000",
    telegram: "@rafaela27",
    whatsapp: "+55 11 00000-0000",
    notes: "Cliente experiente, sempre pontual",
    devices: 4,
    credits: 120,
    renewalDate: "2024-03-01"
  },
  { 
    id: 6, 
    name: "João filho de Keita 62", 
    email: "joao62@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-05",
    phone: "+55 11 99999-0000",
    telegram: "@joao62",
    whatsapp: "+55 11 99999-0000",
    notes: "Cliente pontual nos pagamentos",
    devices: 2,
    credits: 50,
    renewalDate: "2024-03-05"
  },
  { 
    id: 7, 
    name: "Diógenes 27", 
    email: "diogenes27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-10",
    phone: "+55 11 88888-1111",
    telegram: "@diogenes27",
    whatsapp: "+55 11 88888-1111",
    notes: "Cliente indicada por Janaina",
    devices: 1,
    credits: 25,
    renewalDate: "2024-03-10"
  },
  { 
    id: 8, 
    name: "Islaine 27 amiga de Janaina", 
    email: "islaine27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-12",
    phone: "+55 11 77777-2222",
    telegram: "@islaine27",
    whatsapp: "+55 11 77777-2222",
    notes: "Cliente novo, muito ativo",
    devices: 3,
    credits: 80,
    renewalDate: "2024-03-12"
  },
  { 
    id: 9, 
    name: "Tobias 27", 
    email: "tobias27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-15",
    phone: "+55 11 66666-3333",
    telegram: "@tobias27",
    whatsapp: "+55 11 66666-3333",
    notes: "Cliente novo, potencial alto",
    devices: 2,
    credits: 40,
    renewalDate: "2024-03-15"
  },
  { 
    id: 10, 
    name: "Céber 11 novo", 
    email: "ceber11@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-18",
    phone: "+55 11 55555-4444",
    telegram: "@ceber11",
    whatsapp: "+55 11 55555-4444",
    notes: "Taxista, cliente fiel",
    devices: 1,
    credits: 35,
    renewalDate: "2024-03-18"
  },
  { 
    id: 11, 
    name: "Gustavo taxista", 
    email: "gustavo27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-20",
    phone: "+55 11 44444-5555",
    telegram: "@gustavotaxista",
    whatsapp: "+55 11 44444-5555",
    notes: "Cliente satisfeita com o serviço",
    devices: 2,
    credits: 55,
    renewalDate: "2024-03-20"
  },
  { 
    id: 12, 
    name: "Amanda 27", 
    email: "amanda27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-22",
    phone: "+55 11 33333-6666",
    telegram: "@amanda27",
    whatsapp: "+55 11 33333-6666",
    notes: "Cliente novo, sempre pontual",
    devices: 1,
    credits: 30,
    renewalDate: "2024-03-22"
  },
  { 
    id: 13, 
    name: "Michel 27", 
    email: "michel27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-25",
    phone: "+55 11 22222-7777",
    telegram: "@michel27",
    whatsapp: "+55 11 22222-7777",
    notes: "Cliente experiente, sempre renova",
    devices: 3,
    credits: 90,
    renewalDate: "2024-03-25"
  },
  { 
    id: 14, 
    name: "Rene 27", 
    email: "rene27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-28",
    phone: "+55 11 11111-8888",
    telegram: "@rene27",
    whatsapp: "+55 11 11111-8888",
    notes: "Cliente novo, potencial alto",
    devices: 2,
    credits: 45,
    renewalDate: "2024-03-28"
  },
  { 
    id: 15, 
    name: "Eduardo 11 novo 2", 
    email: "eduardo11@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-03-01",
    phone: "+55 11 00000-9999",
    telegram: "@eduardo11",
    whatsapp: "+55 11 00000-9999",
    notes: "Cliente fiel, sempre pontual",
    devices: 2,
    credits: 70,
    renewalDate: "2024-04-01"
  },
  { 
    id: 16, 
    name: "Kelia 27", 
    email: "kelia27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-03-05",
    phone: "+55 11 99999-1111",
    telegram: "@kelia27",
    whatsapp: "+55 11 99999-1111",
    notes: "Cliente novo, muito ativo",
    devices: 1,
    credits: 25,
    renewalDate: "2024-04-05"
  },
  { 
    id: 17, 
    name: "Valdeno 27", 
    email: "valdeno27@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-03-08",
    phone: "+55 11 88888-2222",
    telegram: "@valdeno27",
    whatsapp: "+55 11 88888-2222",
    notes: "Cliente novo, muito ativo",
    devices: 1,
    credits: 25,
    renewalDate: "2024-04-08"
  }
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await db.users.getAll();
      if (error) {
        setError(error.message);
      } else {
        const mappedUsers = data?.map(mapSupabaseUserToUser) || [];
        setUsers(mappedUsers);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    setError(null);
    
    try {
      const supabaseUser = {
        name: user.name,
        email: user.email,
        observations: user.notes || user.observations,
        password: user.password,
        expiration_date: user.expirationDate || user.renewalDate,
        bouquets: user.bouquets,
        m3u_url: user.m3uUrl,
      };

      const { data, error } = await db.users.create(supabaseUser);
      if (error) {
        setError(error.message);
      } else if (data) {
        const newUser = mapSupabaseUserToUser(data);
        setUsers([newUser, ...users]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar usuário');
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    setError(null);
    
    try {
      const supabaseUpdates = {
        name: updates.name,
        email: updates.email,
        observations: updates.notes || updates.observations,
        password: updates.password,
        expiration_date: updates.expirationDate || updates.renewalDate,
        bouquets: updates.bouquets,
        m3u_url: updates.m3uUrl,
      };

      const { data, error } = await db.users.update(id, supabaseUpdates);
      if (error) {
        setError(error.message);
      } else if (data) {
        const updatedUser = mapSupabaseUserToUser(data);
        setUsers(users.map(user => 
          user.id === id ? updatedUser : user
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    }
  };

  const deleteUser = async (id: number) => {
    setError(null);
    
    try {
      const { error } = await db.users.delete(id);
      if (error) {
        setError(error.message);
      } else {
        setUsers(users.filter(user => user.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar usuário');
    }
  };

  const getActiveUsers = () => {
    return users.filter(user => user.status === 'Ativo');
  };

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  // Carregar usuários na inicialização
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
    fetchUsers
  };
}; 