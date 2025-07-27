# Integração com Supabase

Este documento explica como a integração com o Supabase foi implementada no projeto Bootflow.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 2. Estrutura do Banco de Dados

O projeto está configurado para trabalhar com as seguintes tabelas no Supabase:

#### Tabela `users`
- `id` (int, primary key)
- `name` (text, not null)
- `email` (text, not null)
- `password` (text)
- `m3u_url` (text)
- `bouquets` (text)
- `expiration_date` (timestamp)
- `observations` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Tabela `resellers`
- `id` (int, primary key)
- `username` (text)
- `email` (text)
- `password` (text)
- `permission` (text)
- `credits` (int)
- `personal_name` (text)
- `status` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `force_password_change` (text)
- `servers` (text)
- `master_reseller` (text)
- `disable_login_days` (int)
- `monthly_reseller` (boolean)
- `telegram` (text)
- `whatsapp` (text)
- `observations` (text)

#### Tabela `cobrancas`
- `id` (int, primary key)
- `cliente` (text)
- `email` (text)
- `descricao` (text)
- `valor` (numeric)
- `vencimento` (timestamp)
- `status` (text)
- `tipo` (text)
- `gateway` (text)
- `formapagamento` (text)
- `tentativas` (int)
- `ultimatentativa` (timestamp)
- `proximatentativa` (timestamp)
- `observacoes` (text)
- `tags` (text[])

## Arquivos Principais

### 1. `src/lib/supabase.ts`
Arquivo principal de configuração do Supabase com:
- Cliente do Supabase configurado
- Funções de autenticação
- Funções de banco de dados
- Hook de autenticação

### 2. `src/contexts/AuthContext.tsx`
Contexto React para gerenciar autenticação global.

### 3. `src/hooks/useUsers.ts`
Hook para gerenciar usuários com integração completa ao Supabase.

### 4. `src/hooks/useCobrancas.ts`
Hook para gerenciar cobranças (já integrado).

### 5. `src/hooks/useRevendas.ts`
Hook para gerenciar revendedores (já integrado).

## Como Usar

### 1. Autenticação

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();

  const handleLogin = async () => {
    const { error } = await signIn('email@example.com', 'password');
    if (error) {
      console.error('Erro no login:', error.message);
    }
  };

  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sair</button>
      ) : (
        <button onClick={handleLogin}>Entrar</button>
      )}
    </div>
  );
}
```

### 2. Gerenciar Usuários

```tsx
import { useUsers } from '@/hooks/useUsers';

function UsersList() {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers();

  const handleAddUser = async () => {
    await addUser({
      name: 'João Silva',
      email: 'joao@example.com',
      observations: 'Cliente novo'
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. Proteger Rotas

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

## Funcionalidades Implementadas

### ✅ Autenticação
- Login com email/senha
- Cadastro de usuários
- Logout
- Reset de senha
- Atualização de senha
- Persistência de sessão

### ✅ Gerenciamento de Dados
- CRUD completo para usuários
- CRUD completo para revendedores
- CRUD completo para cobranças
- Tipagem TypeScript completa
- Tratamento de erros

### ✅ Interface
- Formulários de login e cadastro
- Proteção de rotas
- Loading states
- Tratamento de erros na UI

### ✅ Segurança
- Autenticação baseada em JWT
- Proteção de rotas
- Validação de dados
- Sanitização de inputs

## Próximos Passos

1. **Configurar RLS (Row Level Security)** no Supabase
2. **Implementar roles e permissões** mais granulares
3. **Adicionar autenticação social** (Google, Facebook, etc.)
4. **Implementar notificações em tempo real** com Supabase Realtime
5. **Adicionar upload de arquivos** com Supabase Storage
6. **Implementar backup automático** dos dados

## Troubleshooting

### Erro de conexão
Verifique se as variáveis de ambiente estão configuradas corretamente.

### Erro de autenticação
Certifique-se de que o usuário existe no Supabase e que a senha está correta.

### Erro de permissão
Verifique se as políticas RLS estão configuradas corretamente no Supabase.

### Erro de tipagem
Execute `npm run build` para verificar se há erros de TypeScript. 