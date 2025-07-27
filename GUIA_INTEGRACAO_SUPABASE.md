# 🚀 Guia Completo de Integração Supabase

## 📋 Status da Integração

### ✅ Implementado
- Cliente Supabase configurado com tipagem TypeScript
- Hooks para `cobrancas`, `resellers` e `users`
- Context de autenticação completo (AuthContext)
- Formulário de login/cadastro
- Tratamento de erros e loading states

### 🔧 Configuração Atual

#### Arquivos Principais:
- `src/lib/supabaseClient.ts` - Cliente principal do Supabase
- `src/contexts/AuthContext.tsx` - Context de autenticação
- `src/integrations/supabase/types.ts` - Tipos TypeScript gerados
- `src/hooks/useUsers.ts` - Hook para gerenciar usuários
- `src/components/LoginForm.tsx` - Formulário de autenticação

## 🛠️ Setup Inicial

### 1. Verificar Variáveis de Ambiente

Certifique-se que o arquivo `.env` contém:

```env
VITE_SUPABASE_URL=https://zluggifavplgsxzbupiq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

### 3. Configurar o App Principal

Adicione o AuthProvider no seu `App.tsx` ou `main.tsx`:

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      {/* Seu app aqui */}
    </AuthProvider>
  );
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Existentes:
- `users` - Usuários/clientes do sistema
- `cobrancas` - Sistema de cobrança
- `resellers` - Revendedores

### Schema da Tabela Users:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR,
  plan VARCHAR,
  status VARCHAR DEFAULT 'Ativo',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  phone VARCHAR,
  telegram VARCHAR,
  whatsapp VARCHAR,
  notes TEXT,
  devices INTEGER DEFAULT 1,
  credits INTEGER DEFAULT 0,
  renewal_date DATE,
  expiration_date DATE,
  bouquets VARCHAR,
  m3u_url VARCHAR,
  real_name VARCHAR,
  observations TEXT
);
```

## 🔐 Autenticação

### Configuração RLS (Row Level Security)

Para habilitar a autenticação, configure as políticas RLS no Supabase:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para leitura (usuários logados)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Política para inserção (apenas admins)
CREATE POLICY "Only admins can insert users" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = id 
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );
```

### Uso no Frontend:

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MeuComponente() {
  const { user, signIn, signOut, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  
  if (!user) {
    return <LoginForm />;
  }
  
  return (
    <div>
      <p>Bem-vindo, {user.email}!</p>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  );
}
```

## 📊 Hooks de Dados

### useUsers

```tsx
import { useUsers } from '@/hooks/useUsers';

function ListaUsuarios() {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers();
  
  if (loading) return <div>Carregando usuários...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name} - {user.email}</div>
      ))}
    </div>
  );
}
```

## 🚨 Troubleshooting

### Problema: "Could not resolve host"

**Causa:** Projeto Supabase pode estar pausado ou URL incorreta.

**Soluções:**
1. Verificar se o projeto está ativo no dashboard do Supabase
2. Confirmar URL e chave de API no arquivo `.env`
3. Testar conectividade:

```bash
curl -I https://zluggifavplgsxzbupiq.supabase.co
```

### Problema: "Invalid API key"

**Causa:** Chave de API incorreta ou expirada.

**Soluções:**
1. Regenerar chave no dashboard Supabase
2. Atualizar arquivo `.env`
3. Reiniciar o servidor de desenvolvimento

### Problema: Erro de CORS

**Causa:** Domínio não autorizado no Supabase.

**Soluções:**
1. Adicionar `localhost:5173` nas configurações do projeto
2. Configurar o domínio de produção no Supabase

### Problema: RLS bloqueando queries

**Causa:** Row Level Security muito restritivo.

**Soluções:**
1. Revisar políticas RLS no Supabase
2. Temporariamente desabilitar RLS para teste:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

## 🧪 Testes

### Teste de Conexão

Execute o script de teste:

```bash
node test-conexao-supabase.js
```

### Teste Manual no Browser

1. Abra as ferramentas de desenvolvedor
2. Execute no console:

```javascript
import { supabase } from './src/lib/supabaseClient.ts';
const { data, error } = await supabase.from('users').select('count');
console.log(data, error);
```

## 📝 Próximos Passos

1. **Configurar Projeto Supabase:**
   - Criar novo projeto se necessário
   - Configurar tabelas com as migrações
   - Definir políticas RLS

2. **Testar Conectividade:**
   - Executar testes de conexão
   - Verificar se as queries estão funcionando

3. **Implementar Autenticação:**
   - Configurar políticas de segurança
   - Testar login/logout
   - Implementar proteção de rotas

4. **Migrar Dados:**
   - Importar dados existentes se houver
   - Sincronizar com sistema atual

## 🆘 Suporte

Se precisar de ajuda adicional:

1. Verifique os logs do console do browser
2. Consulte a documentação oficial: https://supabase.com/docs
3. Verifique o status do Supabase: https://status.supabase.com/

---

**Último Update:** Implementação completa da integração Supabase com autenticação e CRUD de usuários.