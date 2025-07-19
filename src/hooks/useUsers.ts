import React, { useState, useEffect } from 'react';

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
}

// Dados mockados dos usuários (em produção viria de uma API)
const initialUsers: User[] = [
  { 
    id: 1, 
    name: "João Silva", 
    email: "joao@email.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-01-15",
    phone: "+55 11 99999-1111",
    telegram: "@joaosilva",
    whatsapp: "+55 11 99999-1111",
    notes: "Cliente preferencial, sempre pontual no pagamento",
    devices: 3,
    credits: 50,
    renewalDate: "2024-02-15"
  },
  { 
    id: 2, 
    name: "Maria Santos", 
    email: "maria@email.com", 
    plan: "Revendedor", 
    status: "Ativo", 
    createdAt: "2024-01-10",
    phone: "+55 11 88888-2222",
    telegram: "@mariasantos",
    whatsapp: "+55 11 88888-2222",
    notes: "Revendedora ativa, boa performance",
    devices: 5,
    credits: 150,
    renewalDate: "2024-02-10"
  },
  { 
    id: 3, 
    name: "Pedro Oliveira", 
    email: "pedro@email.com", 
    plan: "Cliente", 
    status: "Inativo", 
    createdAt: "2024-01-05",
    phone: "+55 11 77777-3333",
    telegram: "@pedrooliveira",
    whatsapp: "+55 11 77777-3333",
    notes: "Cliente inativo por falta de pagamento",
    devices: 1,
    credits: 0,
    renewalDate: "2024-01-05"
  },
  { 
    id: 4, 
    name: "Ana Costa", 
    email: "ana@email.com", 
    plan: "Cliente", 
    status: "Pendente", 
    createdAt: "2024-01-20",
    phone: "+55 11 66666-4444",
    telegram: "@anacosta",
    whatsapp: "+55 11 66666-4444",
    notes: "Aguardando confirmação de pagamento",
    devices: 2,
    credits: 25,
    renewalDate: "2024-02-20"
  },
  { 
    id: 5, 
    name: "Carlos Lima", 
    email: "carlos@email.com", 
    plan: "Revendedor", 
    status: "Ativo", 
    createdAt: "2024-01-12",
    phone: "+55 11 55555-5555",
    telegram: "@carloslima",
    whatsapp: "+55 11 55555-5555",
    notes: "Revendedor experiente, muitos clientes",
    devices: 8,
    credits: 300,
    renewalDate: "2024-02-12"
  },
  { 
    id: 6, 
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
    id: 7, 
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
    id: 8, 
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
    id: 9, 
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
    id: 10, 
    name: "João filho de Keita 62", 
    email: "joao62@gmail.com", 
    plan: "Cliente", 
    status: "Ativo", 
    createdAt: "2024-02-01",
    phone: "+55 11 00000-0000",
    telegram: "@joao62",
    whatsapp: "+55 11 00000-0000",
    notes: "Cliente experiente, sempre pontual",
    devices: 4,
    credits: 120,
    renewalDate: "2024-03-01"
  }
];

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Carregar usuários do localStorage se disponível
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Salvar usuários no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.max(...users.map(u => u.id)) + 1
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const getActiveUsers = () => {
    return users.filter(user => user.status === 'Ativo');
  };

  const getUserById = (id: number) => {
    return users.find(user => user.id === id);
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    getActiveUsers,
    getUserById
  };
}; 