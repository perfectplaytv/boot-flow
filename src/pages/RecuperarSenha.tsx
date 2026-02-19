import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const RecuperarSenha: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError(error.message || 'Erro ao enviar e-mail de recuperação.');
    } else {
      setSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Recuperar Senha</h2>
        {error && <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 rounded px-3 py-2 text-sm">{success}</div>}
        <div>
          <label htmlFor="recuperar-email" className="block text-gray-700 mb-1">E-mail</label>
          <input
            id="recuperar-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link de recuperação'}
        </Button>
        <div className="text-sm text-center text-gray-500">
          Lembrou da senha? <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
        </div>
      </form>
    </div>
  );
};

export default RecuperarSenha;
