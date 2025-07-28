import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, Session, AuthError, UserResponse } from '@supabase/supabase-js';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'admin' | 'reseller' | 'client' | null>(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  // Função para redirecionar com base no papel do usuário
  const redirectBasedOnRole = useCallback((role: 'admin' | 'reseller' | 'client') => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'reseller':
        navigate('/reseller/dashboard');
        break;
      case 'client':
      default:
        navigate('/dashboard');
        break;
    }
  }, [navigate]);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
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

  useEffect(() => {
    // Verifica se há uma sessão ativa ao carregar o componente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        setProfile(userProfile);
        const role = userProfile?.role || 'client';
        setUserRole(role);
        
        // Redireciona para a dashboard apropriada se estiver na página de login
        if (window.location.pathname === '/login') {
          redirectBasedOnRole(role);
        }
      } else {
        setProfile(null);
        setUserRole(null);
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirectBasedOnRole]);

  // Gerenciar mudanças de autenticação
  useEffect(() => {
    // Verificar sessão ativa ao montar o componente
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          return;
        }
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          const role = userProfile?.role || 'client';
          
          // Atualiza o estado com os dados do usuário e perfil
          setSession(session);
          setUser(session.user);
          setProfile(userProfile);
          setUserRole(role);
          
          // Redireciona para a dashboard apropriada se estiver na página de login
          if (window.location.pathname === '/login') {
            redirectBasedOnRole(role);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [fetchUserProfile, redirectBasedOnRole]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.session) throw new Error('Erro ao fazer login: Sessão não encontrada');

      // Busca o perfil do usuário
      const userProfile = await fetchUserProfile(data.session.user.id);
      const role = userProfile?.role || 'client';
      
      // Atualiza o estado com os dados do usuário e perfil
      setSession(data.session);
      setUser(data.session.user);
      setProfile(userProfile);
      setUserRole(role);
      
      // Exibe mensagem de sucesso
      toast.success('Login realizado com sucesso! Redirecionando...');
      
      // Redireciona com base no papel do usuário
      redirectBasedOnRole(role);
      
      return { error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      const errorMessage = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
      toast.error(errorMessage);
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
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao sair da conta. Tente novamente.');
      throw error;
    } finally {
      // Limpa o estado independentemente do resultado do logout
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserRole(null);
      
      // Redireciona para a página de login
      navigate('/login');
      
      // Exibe mensagem de sucesso após o redirecionamento
      setTimeout(() => {
        toast.success('Você saiu da sua conta com sucesso!');
      }, 100);
      
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      // Validação básica do e-mail
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Por favor, insira um endereço de e-mail válido.');
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.');
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao enviar e-mail de redefinição de senha:', error);
      const errorMessage = error.message.includes('email') 
        ? 'Este endereço de e-mail não está cadastrado.' 
        : 'Erro ao enviar e-mail de redefinição de senha. Tente novamente.';
      
      toast.error(errorMessage);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      
      setLoading(true);
      
      // Validações básicas
      if (updates.email && !/\S+@\S+\.\S+/.test(updates.email)) {
        throw new Error('Por favor, insira um endereço de e-mail válido.');
      }
      
      // Prepara os dados para atualização
      const updateData: Partial<UserProfile> = { ...updates };
      
      // Remove campos que não devem ser atualizados diretamente
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.updated_at;
      
      // Atualiza o perfil no banco de dados
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Atualiza o estado local
      if (data) {
        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);
        
        // Se o papel foi atualizado, atualiza o redirecionamento
        if (updates.role) {
          setUserRole(updates.role);
          // Não redireciona automaticamente para evitar problemas de UX
          // O usuário pode querer continuar editando
          toast.success('Perfil atualizado com sucesso! Atualizando permissões...');
          // Pequeno atraso para o usuário ver a mensagem
          setTimeout(() => redirectBasedOnRole(updates.role!), 1000);
        } else {
          toast.success('Perfil atualizado com sucesso!');
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = error.message.includes('unique')
        ? 'Este e-mail já está em uso por outra conta.'
        : error.message || 'Erro ao atualizar perfil. Tente novamente.';
      
      toast.error(errorMessage);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error);
        throw error;
      }
      
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id);
        const role = userProfile?.role || 'client';
        
        // Atualiza o estado com os dados mais recentes
        setSession(session);
        setUser(session.user);
        setProfile(userProfile);
        setUserRole(role);
        
        // Retorna os dados atualizados para uso imediato, se necessário
        return {
          session,
          user: session.user,
          profile: userProfile,
          role
        };
      } else {
        // Se não houver sessão, limpa o estado
        setSession(null);
        setUser(null);
        setProfile(null);
        setUserRole(null);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      // Em caso de erro, limpa o estado para garantir consistência
      setSession(null);
      setUser(null);
      setProfile(null);
      setUserRole(null);
      throw error;
    }
  }, [fetchUserProfile]);

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