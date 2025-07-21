import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock, Loader2, Google, User, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const ADMIN_SECRET = 'admin-2024'; // Você pode trocar depois

export default function Login() {
  const [loginType, setLoginType] = useState<'client' | 'reseller' | 'admin'>('client');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (loginType === 'admin' && adminCode !== ADMIN_SECRET) {
      setError('Código secreto inválido para Admin.');
      setLoading(false);
      return;
    }
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }
    // Buscar papel do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user?.id)
      .single();
    setLoading(false);
    if (profileError || !profile) {
      setError('Não foi possível identificar o tipo de usuário.');
      return;
    }
    // Redirecionar conforme o papel
    if (profile.role === 'admin') navigate('/dashboard/admin');
    else if (profile.role === 'reseller') navigate('/dashboard/reseller');
    else navigate('/dashboard/client');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
    if (error) setError(error.message);
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
          <CardTitle className="text-2xl font-bold text-white">Entrar na Plataforma</CardTitle>
          <p className="text-gray-400 mt-2">Acesse sua conta para continuar</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2 mb-6">
            <Button variant={loginType === 'client' ? 'default' : 'outline'} className={loginType === 'client' ? 'bg-[#7e22ce] text-white' : 'bg-[#181825] text-white'} onClick={() => setLoginType('client')}><User className="w-4 h-4 mr-1" />Cliente</Button>
            <Button variant={loginType === 'reseller' ? 'default' : 'outline'} className={loginType === 'reseller' ? 'bg-green-700 text-white' : 'bg-[#181825] text-white'} onClick={() => setLoginType('reseller')}><Users className="w-4 h-4 mr-1" />Revendedor</Button>
            <Button variant={loginType === 'admin' ? 'default' : 'outline'} className={loginType === 'admin' ? 'bg-yellow-600 text-white' : 'bg-[#181825] text-white'} onClick={() => setLoginType('admin')}><Shield className="w-4 h-4 mr-1" />Admin</Button>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <Button
              type="button"
              className="w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 mb-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Google className="w-5 h-5 mr-1 text-[#ea4335]" />
              Entrar com Google
            </Button>
            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-700" />
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
                  placeholder="Sua senha"
                  className="pl-10 bg-[#181825] border border-gray-700 text-white"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            {loginType === 'admin' && (
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Código Secreto do Admin</label>
                <Input
                  type="password"
                  placeholder="Digite o código secreto"
                  className="bg-[#181825] border border-gray-700 text-white"
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  required
                />
              </div>
            )}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-[#7e22ce] hover:bg-[#6d1bb7] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 mr-1 animate-spin" /> : <LogIn className="w-5 h-5 mr-1" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-right">
              <a href="#" className="text-xs text-purple-400 hover:underline">Esqueceu a senha?</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 