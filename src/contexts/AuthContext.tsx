import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, UserProfile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  userRole: 'admin' | 'reseller' | 'client' | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, userData: { full_name: string; role?: 'admin' | 'reseller' | 'client' }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar o perfil do usuário
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  }, []);

  // Atualizar sessão e perfil do usuário
  const updateSession = useCallback(async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    if (session?.user) {
      const userProfile = await fetchUserProfile(session.user.id);
      setProfile(userProfile);
      
      // Redireciona com base no perfil do usuário após login
      if (userProfile) {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || `dashboard/${userProfile.role}`;
        navigate(redirectPath);
        sessionStorage.removeItem('redirectAfterLogin');
      }
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  }, [fetchUserProfile, navigate]);

  // Gerenciar mudanças de autenticação
  useEffect(() => {
    // Obter sessão inicial
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await updateSession(session);
    };

    initializeAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        await updateSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [updateSession]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Login realizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { full_name: string; role?: 'admin' | 'reseller' | 'client' }) => {
    try {
      setLoading(true);
      
      // Cria o usuário
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // Cria o perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: userData.role || 'client',
          full_name: userData.full_name,
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      toast.success('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar sua conta.');
      return { error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast.success('Você saiu da sua conta com sucesso!');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro ao sair:', error);
      toast.error(error.message || 'Erro ao sair da conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('E-mail de redefinição de senha enviado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast.error(error.message || 'Erro ao enviar e-mail de redefinição de senha.');
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Atualiza o perfil local
      if (profile) {
        setProfile({ ...profile, ...updates });
      }
      
      toast.success('Perfil atualizado com sucesso!');
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error.message || 'Erro ao atualizar perfil. Tente novamente.');
      return { error };
    }
  };
  
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      await updateSession(data.session);
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    userRole: profile?.role || null,
    signIn,
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