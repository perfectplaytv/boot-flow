import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Cadastro: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Forçar cadastro como revendedor (revenda)
  const [role, setRole] = useState<'client' | 'reseller'>('reseller');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: fullName, role });
    setLoading(false);
    if (error) {
      setError(error.message || 'Erro ao cadastrar.');
    } else {
      setSuccess('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <form
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Criar Conta</h2>
        {error && <div className="bg-red-100 text-red-700 rounded px-3 py-2 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 rounded px-3 py-2 text-sm">{success}</div>}
        <div>
          <label htmlFor="cad-fullname" className="block text-gray-700 mb-1">Nome completo</label>
          <input
            id="cad-fullname"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="cad-email" className="block text-gray-700 mb-1">E-mail</label>
          <input
            id="cad-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="cad-password" className="block text-gray-700 mb-1">Senha</label>
          <input
            id="cad-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="cad-confirm" className="block text-gray-700 mb-1">Confirmar senha</label>
          <input
            id="cad-confirm"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Forçar role 'reseller' no cadastro; envia como metadata mas não exibe seleção ao usuário */}
        <input type="hidden" value={role} />
        <div className="text-sm text-gray-600">O cadastro será realizado como <strong>Revendedor</strong>.</div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
        <div className="text-sm text-center text-gray-500">
          Já tem uma conta? <a href="/login" className="text-blue-600 hover:underline">Entrar</a>
        </div>
      </form>
    </div>
  );
};

export default Cadastro;
