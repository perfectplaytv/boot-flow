import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import { supabase } from '@/lib/supabase'; // Removido
import { toast } from 'sonner';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove o #
      const token = params.get('access_token');
      const type = params.get('type');

      if (token && type === 'recovery') {
        setAccessToken(token);
      } else {
        setError('Parâmetros de redefinição inválidos ou não encontrados na URL.');
        toast.error('O link de redefinição parece estar incorreto. Por favor, tente novamente.');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.'
      );
      return;
    }

    try {
      setLoading(true);

      // Simulação temporária até o backend de reset de senha estar pronto
      console.log('Solicitação de reset de senha para token:', accessToken);

      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error: unknown) {
      console.error('Erro ao redefinir senha:', error);
      setError('Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Senha Redefinida!</h2>
          <p className="text-gray-600 mb-6">Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login em instantes...</p>
          <Button onClick={() => navigate('/login')}>
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Redefinir Senha</h2>

        {error && <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">{error}</div>}

        <div>
          <label htmlFor="reset-nova" className="block text-gray-700 mb-1">Nova Senha</label>
          <input
            id="reset-nova"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Mínimo de 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.
          </p>
        </div>

        <div>
          <label htmlFor="reset-confirm" className="block text-gray-700 mb-1">Confirmar Nova Senha</label>
          <input
            id="reset-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Redefinindo...' : 'Redefinir Senha'}
        </Button>

        <div className="text-sm text-center text-gray-500">
          Lembrou da senha?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Fazer Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
