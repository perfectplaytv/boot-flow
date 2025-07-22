import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock, Loader2, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [role, setRole] = useState<'client' | 'reseller'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    // Cria usuário no Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { name }
      }
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Cria perfil na tabela profiles
    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        name,
        email,
        role
      });
      if (profileError) {
        setError('Usuário criado, mas houve erro ao salvar o perfil.');
        setLoading(false);
        return;
      }
    }
    setLoading(false);
    setSuccess('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-purple-900/60 to-purple-800/30 border border-purple-700/40 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Criar Conta</CardTitle>
          <p className="text-gray-400 mt-2">Preencha os dados para se cadastrar</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 bg-[#181825] border border-gray-700 text-white"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 bg-[#181825] border border-gray-700 text-white"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Crie uma senha"
                  className="pl-10 bg-[#181825] border border-gray-700 text-white"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Repita a senha"
                  className="pl-10 bg-[#181825] border border-gray-700 text-white"
                  value={confirmSenha}
                  onChange={e => setConfirmSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Tipo de Conta</label>
              <div className="flex gap-2">
                <Button type="button" variant={role === 'client' ? 'default' : 'outline'} className={role === 'client' ? 'bg-[#7e22ce] text-white' : 'bg-[#181825] text-white'} onClick={() => setRole('client')}><User className="w-4 h-4 mr-1" />Cliente</Button>
                <Button type="button" variant={role === 'reseller' ? 'default' : 'outline'} className={role === 'reseller' ? 'bg-green-700 text-white' : 'bg-[#181825] text-white'} onClick={() => setRole('reseller')}><Users className="w-4 h-4 mr-1" />Revendedor</Button>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center">{success}</div>}
            <Button
              type="submit"
              className="w-full bg-[#7e22ce] hover:bg-[#6d1bb7] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 mr-1 animate-spin" /> : <LogIn className="w-5 h-5 mr-1" />}
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-400">Já tem conta? </span>
              <a href="/login" className="text-xs text-purple-400 hover:underline">Entrar</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 