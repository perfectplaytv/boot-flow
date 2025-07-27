import React, { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { SignUpForm } from '@/components/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { user, loading } = useAuth();

  // Se o usuário já está logado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se ainda está carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm
            onSwitchToSignUp={() => setMode('signup')}
            onSuccess={() => {
              // Login bem-sucedido será tratado pelo redirecionamento automático
            }}
          />
        ) : (
          <SignUpForm
            onSwitchToLogin={() => setMode('login')}
            onSuccess={() => {
              // Cadastro bem-sucedido
              setMode('login');
            }}
          />
        )}
      </div>
    </div>
  );
}; 