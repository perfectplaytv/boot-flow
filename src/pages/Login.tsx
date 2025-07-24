import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock, Loader2, User, Shield, Users, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

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
              {/* SVG do Google */}
              <span className="mr-1">
                <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_17_40)">
                    <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h12.98c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.11-10.34 7.11-17.676z" fill="#4285F4"/>
                    <path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.74-6.06c-2.15 1.44-4.9 2.3-8.15 2.3-6.26 0-11.56-4.22-13.46-9.9H2.5v6.22C6.45 43.78 14.7 48 24.48 48z" fill="#34A853"/>
                    <path d="M11.02 28.52a14.77 14.77 0 010-9.44v-6.22H2.5a24.01 24.01 0 000 21.88l8.52-6.22z" fill="#FBBC05"/>
                    <path d="M24.48 9.54c3.53 0 6.66 1.22 9.13 3.62l6.84-6.84C36.39 2.14 30.96 0 24.48 0 14.7 0 6.45 4.22 2.5 10.82l8.52 6.22c1.9-5.68 7.2-9.5 13.46-9.5z" fill="#EA4335"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_17_40">
                      <rect width="48" height="48" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </span>
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
                  id="login-email"
                  name="email"
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
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  placeholder="Sua senha"
                  className="pl-10 pr-10 bg-[#181825] border border-gray-700 text-white"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {loginType === 'admin' && (
              <div>
                <label className="block text-gray-300 mb-1 font-medium">Código Secreto do Admin</label>
                <div className="relative">
                  <Input
                    type={showAdminCode ? 'text' : 'password'}
                    id="login-admin-code"
                    name="adminCode"
                    placeholder="Digite o código secreto"
                    className="pr-10 bg-[#181825] border border-gray-700 text-white"
                    value={adminCode}
                    onChange={e => setAdminCode(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    tabIndex={-1}
                    onClick={() => setShowAdminCode(v => !v)}
                    aria-label={showAdminCode ? 'Ocultar código' : 'Mostrar código'}
                  >
                    {showAdminCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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