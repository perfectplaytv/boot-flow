
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// Tipos adaptados para nossa nova autenticação
export interface User {
  id: number | string;
  email: string;
  name?: string;
  role: 'admin' | 'reseller' | 'client';
}

interface AuthResponse {
  user: User;
  token: string;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  userRole: 'admin' | 'reseller' | 'client' | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: { full_name: string; role?: 'admin' | 'reseller' | 'client' }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  profile: Record<string, unknown> | null;
  session: Record<string, unknown> | null;
}

interface AuthProviderProps {
  children: ReactNode;
  navigate?: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, navigate }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const safeNavigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      if (navigate) navigate(path);
      else window.location.href = path;
    }
  }, [navigate]);

  const redirectBasedOnRole = useCallback((role: string) => {
    switch (role) {
      case 'admin': safeNavigate('/admin'); break;
      case 'reseller': safeNavigate('/dashboard/revendas'); break;
      case 'client': safeNavigate('/dashboard/client'); break;
      default: safeNavigate('/'); break;
    }
  }, [safeNavigate]);

  useEffect(() => {
    const loadSession = () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao fazer login');
      }

      const userData = data.user;
      const authToken = data.token;

      if (!userData.role) userData.role = 'client';

      setUser(userData);
      setToken(authToken);

      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      toast.success('Login realizado com sucesso!');
      redirectBasedOnRole(userData.role);

      return { error: null };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return { error: error instanceof Error ? error : new Error(message) };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role?: 'admin' | 'reseller' | 'client' }) => {
    try {
      setLoading(true);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: userData.full_name,
          role: userData.role || 'client'
        }),
      });

      const data = await response.json() as AuthResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Falha no registro');
      }

      const newUser = data.user;
      const newToken = data.token;
      if (!newUser.role) newUser.role = userData.role || 'client';

      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));

      toast.success('Conta criada com sucesso!');
      redirectBasedOnRole(newUser.role);

      return { error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return { error: error instanceof Error ? error : new Error(message) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    safeNavigate('/login');
    toast.success('Logout realizado.');
  };

  const signInWithGoogle = async () => {
    toast.info('Login com Google desativado nesta versão.');
    return { error: null };
  };
  const resetPassword = async (email: string) => {
    toast.info('Recuperação de senha será implementada em breve.');
    return { error: null };
  };
  const updateProfile = async (updates: Partial<User>) => {
    toast.success('Dados salvos localmente (Demo).');
    if (user) {
      const newUser = { ...user, ...updates };
      setUser(newUser as User);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
    }
    return { error: null };
  };
  const refreshSession = async () => { };

  const value: AuthContextType = {
    user,
    token, // Novo
    session: token ? { user, access_token: token } : null, // Compatibilidade fake
    profile: user as unknown as Record<string, unknown>, // Compatibilidade fake
    loading,
    isAuthenticated: !!user,
    userRole: user?.role || null,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};