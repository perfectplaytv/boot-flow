# 🚀 Guia de Uso do Supabase CLI

## ✅ Status: Supabase CLI já está instalado!

Versão instalada: `2.54.11`

---

## 📋 Comandos Úteis do Supabase CLI

### 1. Conectar ao Projeto Remoto

```bash
# Linkar com o projeto remoto (você precisará do database password)
supabase link --project-ref mnjivyaztsgxaqihrqec
```

**Onde encontrar o database password:**
- Acesse: https://app.supabase.com → Seu Projeto → Settings → Database
- Role até "Connection string" → copie a senha da URL

### 2. Iniciar Servidor Local (Desenvolvimento)

```bash
# Inicia todos os serviços do Supabase localmente
supabase start

# Isso iniciará:
# - PostgreSQL (porta 54322)
# - API REST (porta 54321)
# - Studio (porta 54323)
# - Inbucket (porta 54324) - para testar emails
```

### 3. Parar Servidor Local

```bash
supabase stop
```

### 4. Criar Migração

```bash
# Criar uma nova migração
supabase migration new nome_da_migracao

# Isso cria um arquivo em: supabase/migrations/YYYYMMDDHHMMSS_nome_da_migracao.sql
```

### 5. Aplicar Migrações

```bash
# Aplicar migrações locais no banco remoto
supabase db push

# Aplicar migrações do remoto no local
supabase db pull
```

### 6. Resetar Banco Local

```bash
# Reseta o banco local e aplica todas as migrações + seed.sql
supabase db reset
```

### 7. Criar Usuário Admin via CLI

```bash
# Criar usuário admin no projeto remoto
supabase auth admin create-user --email admin@exemplo.com --password senha123456 --user-metadata '{"role":"admin","full_name":"Admin"}'
```

### 8. Ver Diferenças entre Local e Remoto

```bash
# Ver diferenças no schema entre local e remoto
supabase db diff
```

### 9. Gerar Tipos TypeScript

```bash
# Gerar tipos TypeScript do banco de dados
supabase gen types typescript --local > src/types/database.types.ts
```

### 10. Ver Logs

```bash
# Ver logs do servidor local
supabase logs
```

---

## 🔧 Configuração Atual

### Estrutura de Pastas Criada:

```
supabase/
├── config.toml       # Configuração do projeto
├── migrations/       # Migrações SQL (criadas via CLI)
└── seed.sql         # Dados de seed para desenvolvimento
```

### Configurações no config.toml:

- **Project ID**: `bootflow`
- **API Port**: `54321`
- **Database Port**: `54322`
- **Studio Port**: `54323`
- **Site URL**: `http://localhost:3000`
- **Auth**: Habilitado com email signup

---

## 📝 Scripts NPM Úteis (Adicionar ao package.json)

Adicione estes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:migration": "supabase migration new",
    "supabase:push": "supabase db push",
    "supabase:pull": "supabase db pull",
    "supabase:types": "supabase gen types typescript --local > src/types/database.types.ts",
    "supabase:create-user": "supabase auth admin create-user"
  }
}
```

Depois você pode usar:
```bash
npm run supabase:start
npm run supabase:stop
npm run supabase:reset
```

---

## 🎯 Fluxo de Trabalho Recomendado

### 1. Desenvolvimento Local

```bash
# 1. Iniciar servidor local
supabase start

# 2. Criar migração
supabase migration new criar_tabela_clientes

# 3. Editar o arquivo de migração criado em supabase/migrations/

# 4. Aplicar localmente
supabase db reset

# 5. Testar localmente
npm run dev
```

### 2. Publicar no Remoto

```bash
# 1. Linkar com projeto remoto (se ainda não fez)
supabase link --project-ref mnjivyaztsgxaqihrqec

# 2. Aplicar migrações no remoto
supabase db push

# 3. Verificar diferenças
supabase db diff
```

---

## 🔐 Criar Usuário Admin via CLI

### Método 1: Via CLI (Recomendado)

```bash
supabase auth admin create-user \
  --email admin@exemplo.com \
  --password senha123456 \
  --user-metadata '{"role":"admin","full_name":"Admin Name"}' \
  --email-confirm
```

### Método 2: Via Dashboard

- Acesse: https://app.supabase.com → Authentication → Users → Add User

---

## 🐛 Troubleshooting

### Erro: "failed to parse environment file: .env"
- Verifique se o arquivo `.env` não tem caracteres especiais inválidos
- Use apenas ASCII no `.env`

### Erro: "project not linked"
- Execute: `supabase link --project-ref mnjivyaztsgxaqihrqec`

### Erro: "database password required"
- Você precisa do database password do projeto
- Encontre em: Settings → Database → Connection string

### Porta já em uso
- Pare o servidor: `supabase stop`
- Ou altere as portas no `config.toml`

---

## 📚 Recursos Adicionais

- [Documentação Supabase CLI](https://supabase.com/docs/reference/cli/introduction)
- [Guia de Migrações](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Autenticação via CLI](https://supabase.com/docs/reference/cli/supabase-auth-admin)

---

## ✅ Próximos Passos

1. **Corrigir o arquivo .env** (remover caracteres inválidos)
2. **Linkar com projeto remoto**: `supabase link --project-ref mnjivyaztsgxaqihrqec`
3. **Criar usuário admin**: `supabase auth admin create-user --email seu@email.com --password senha123`
4. **Aplicar migrações existentes**: `supabase db push`

---

## 🎉 Benefícios do Supabase CLI

- ✅ Desenvolvimento local completo
- ✅ Migrações versionadas
- ✅ Sincronização com remoto
- ✅ Geração automática de tipos TypeScript
- ✅ Testes locais sem custos
- ✅ Gerenciamento de usuários via CLI

