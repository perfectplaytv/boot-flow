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
      
      // Validação do e-mail
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error('Por favor, insira um endereço de e-mail válido.');
      }
      
      // Validação da senha
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
        );
      }
      
      // Validação do nome completo
      if (!userData.full_name || userData.full_name.trim().length < 3) {
        throw new Error('Por favor, insira um nome completo válido (mínimo 3 caracteres).');
      }
      
      // Cria o usuário no Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: userData.full_name.trim(),
            role: userData.role || 'client',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;
      
      // Cria o perfil do usuário na tabela profiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email.trim().toLowerCase(),
              full_name: userData.full_name.trim(),
              role: userData.role || 'client',
            },
          ]);
          
        if (profileError) {
          // Se houver erro ao criar o perfil, tenta excluir o usuário criado
          await supabase.auth.admin.deleteUser(authData.user.id).catch(console.error);
          throw profileError;
        }
      }
      
      toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar sua conta.');
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      const errorMessage = error.message.includes('already registered')
        ? 'Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.'
        : error.message || 'Erro ao criar conta. Tente novamente.';
      
      toast.error(errorMessage);
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