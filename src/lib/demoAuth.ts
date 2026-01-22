// Sistema de autenticação demo para desenvolvimento
// Usado quando não há conexão com Supabase

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'reseller' | 'client';
  avatar_url?: string;
}

// Usuários demo pré-configurados
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-admin-001',
    email: 'admin@demo.com',
    password: 'admin123',
    full_name: 'Administrador Demo',
    role: 'admin',
    avatar_url: undefined,
  },
  {
    id: 'demo-reseller-001',
    email: 'revendedor@demo.com',
    password: 'revendedor123',
    full_name: 'Revendedor Demo',
    role: 'reseller',
    avatar_url: undefined,
  },
  {
    id: 'demo-client-001',
    email: 'cliente@demo.com',
    password: 'cliente123',
    full_name: 'Cliente Demo',
    role: 'client',
    avatar_url: undefined,
  },
];

// Chave para armazenar sessão demo no localStorage
const DEMO_SESSION_KEY = 'bootflow_demo_session';

// Verifica se está em modo demo
export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true' || localStorage.getItem('bootflow_demo_mode') === 'true';
};

// Ativa modo demo
export const enableDemoMode = (): void => {
  localStorage.setItem('bootflow_demo_mode', 'true');
};

// Desativa modo demo
export const disableDemoMode = (): void => {
  localStorage.removeItem('bootflow_demo_mode');
  localStorage.removeItem(DEMO_SESSION_KEY);
};

// Busca usuário demo por email
export const findDemoUser = (email: string): DemoUser | undefined => {
  if (!email) return undefined;
  return DEMO_USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
};

// Valida credenciais demo
export const validateDemoCredentials = (email: string, password: string): DemoUser | null => {
  const user = findDemoUser(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

// Cria sessão demo
export const createDemoSession = (user: DemoUser): any => {
  const session = {
    access_token: `demo_token_${user.id}_${Date.now()}`,
    refresh_token: `demo_refresh_${user.id}_${Date.now()}`,
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: user.id,
      email: user.email,
      user_metadata: {
        full_name: user.full_name,
        role: user.role,
      },
      app_metadata: {
        role: user.role,
      },
    },
  };

  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({
    session,
    user,
    profile: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  }));

  return session;
};

// Recupera sessão demo do localStorage
export const getDemoSession = (): any => {
  const stored = localStorage.getItem(DEMO_SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

// Remove sessão demo
export const clearDemoSession = (): void => {
  localStorage.removeItem(DEMO_SESSION_KEY);
};

// Verifica se há sessão demo ativa
export const hasDemoSession = (): boolean => {
  const session = getDemoSession();
  if (!session) return false;

  // Verifica se a sessão expirou
  if (session.session.expires_at && session.session.expires_at < Math.floor(Date.now() / 1000)) {
    clearDemoSession();
    return false;
  }

  return true;
};

