import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, User, Users, Shield } from 'lucide-react';

const profiles = [
  { key: 'cliente', label: 'Cliente', icon: <User className="w-4 h-4 mr-1" /> },
  { key: 'revendedor', label: 'Revendedor', icon: <Users className="w-4 h-4 mr-1" /> },
  { key: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4 mr-1" /> },
];

export default function LoginForm() {
  const [profile, setProfile] = useState('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Aqui você integra com seu backend real
    setTimeout(() => {
      setLoading(false);
      setError('Login de exemplo. Integre com seu backend!');
    }, 1200);
  };

  const handleGoogle = () => {
    // Integre com Google Auth
    setError('Integração com Google não implementada neste exemplo.');
  };

  return (
    <div className="rounded-lg bg-card text-card-foreground w-full max-w-md bg-gradient-to-br from-purple-900/60 to-purple-800/30 border border-purple-700/40 shadow-2xl">
      <div className="flex flex-col space-y-1.5 p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-purple-500 rounded-lg flex items-center justify-center">
            <LogIn className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="tracking-tight text-2xl font-bold text-white">Entrar na Plataforma</h3>
        <p className="text-gray-400 mt-2">Acesse sua conta para continuar</p>
      </div>
      <div className="p-6 pt-0">
        <div className="flex justify-center gap-2 mb-6">
          {profiles.map((p) => (
            <button
              key={p.key}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-10 px-4 py-2 text-white ${profile === p.key ? (p.key === 'admin' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-[#181825]') : 'bg-[#181825]'} ${profile === p.key ? 'shadow-lg' : ''}`}
              onClick={() => setProfile(p.key)}
              type="button"
            >
              {p.icon}
              {p.label}
            </button>
          ))}
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <button
            className="whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 mb-2"
            type="button"
            onClick={handleGoogle}
          >
            <span className="mr-1">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h12.98c-.56 3.02-2.24 5.58-4.78 7.3v6.06h7.74c4.54-4.18 7.11-10.34 7.11-17.676z" fill="#4285F4"></path><path d="M24.48 48c6.48 0 11.92-2.14 15.89-5.82l-7.74-6.06c-2.15 1.44-4.9 2.3-8.15 2.3-6.26 0-11.56-4.22-13.46-9.9H2.5v6.22C6.45 43.78 14.7 48 24.48 48z" fill="#34A853"></path><path d="M11.02 28.52a14.77 14.77 0 010-9.44v-6.22H2.5a24.01 24.01 0 000 21.88l8.52-6.22z" fill="#FBBC05"></path><path d="M24.48 9.54c3.53 0 6.66 1.22 9.13 3.62l6.84-6.84C36.39 2.14 30.96 0 24.48 0 14.7 0 6.45 4.22 2.5 10.82l8.52 6.22c1.9-5.68 7.2-9.5 13.46-9.5z" fill="#EA4335"></path></g><defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white"></rect></clipPath></defs></svg>
            </span>
            Entrar com Google
          </button>
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                id="login-email"
                name="email"
                className="flex h-10 w-full rounded-md px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 bg-[#181825] border border-gray-700 text-white"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-1 font-medium">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                name="password"
                className="flex h-10 w-full rounded-md px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-10 bg-[#181825] border border-gray-700 text-white"
                placeholder="Sua senha"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-3 top-2.5 text-gray-400 hover:text-white" tabIndex={-1} aria-label="Mostrar senha" onClick={() => setShowPassword(v => !v)}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {profile === 'admin' && (
            <div>
              <label className="block text-gray-300 mb-1 font-medium">Código Secreto do Admin</label>
              <div className="relative">
                <input
                  type={showAdminCode ? 'text' : 'password'}
                  id="login-admin-code"
                  name="adminCode"
                  className="flex h-10 w-full rounded-md px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-10 bg-[#181825] border border-gray-700 text-white"
                  placeholder="Digite o código secreto"
                  required
                  value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                />
                <button type="button" className="absolute right-3 top-2.5 text-gray-400 hover:text-white" tabIndex={-1} aria-label="Mostrar código" onClick={() => setShowAdminCode(v => !v)}>
                  {showAdminCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
          <button
            className="whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 w-full bg-[#7e22ce] hover:bg-[#6d1bb7] text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
            type="submit"
            disabled={loading}
          >
            <LogIn className="w-5 h-5 mr-1" />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <div className="text-right">
            <a href="#" className="text-xs text-purple-400 hover:underline">Esqueceu a senha?</a>
          </div>
          {error && <div className="text-red-400 text-sm text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
} 