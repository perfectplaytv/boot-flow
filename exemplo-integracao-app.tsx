// Exemplo de como integrar o AuthProvider no seu App.tsx ou main.tsx

import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { LoginForm } from './components/LoginForm';
import { useAuth } from './contexts/AuthContext';

// Componente que protege rotas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoginForm />
      </div>
    );
  }

  return <>{children}</>;
}

// Componente principal da aplicação
function AppContent() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Meu Sistema</h1>
              </div>
              <div className="flex items-center">
                <LogoutButton />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Aqui vai o conteúdo da sua aplicação */}
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <h2 className="text-lg font-medium mb-4">Dashboard</h2>
              <p>Usuário logado com sucesso!</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Botão de logout
function LogoutButton() {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">{user?.email}</span>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Sair
      </button>
    </div>
  );
}

// App principal com todos os providers
export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AuthProvider>
  );
}

// ================================================================
// EXEMPLO DE USO DOS HOOKS EM COMPONENTES
// ================================================================

// Exemplo 1: Lista de usuários
function ListaUsuarios() {
  const { users, loading, error, addUser, deleteUser } = useUsers();

  if (loading) return <div>Carregando usuários...</div>;
  if (error) return <div className="text-red-600">Erro: {error}</div>;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Usuários do Sistema</h3>
      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="border p-4 rounded-lg">
              <h4 className="font-medium">{user.name}</h4>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm">Status: {user.status}</p>
              <button 
                onClick={() => deleteUser(user.id)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Exemplo 2: Adicionar usuário
function AdicionarUsuario() {
  const { addUser } = useUsers();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser({
        name: nome,
        email: email,
        plan: 'Cliente',
        status: 'Ativo'
      });
      setNome('');
      setEmail('');
      alert('Usuário adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar usuário');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Adicionar Usuário
      </button>
    </form>
  );
}