# 🚀 Scripts Úteis do Supabase CLI

## ✅ Configuração Completa

O Supabase CLI já está instalado e configurado! Aqui estão os comandos principais:

---

## 📋 Comandos Disponíveis

### Gerenciamento de Projeto

```bash
# Linkar com projeto remoto (precisa do database password)
npm run supabase:link

# Ou diretamente:
supabase link --project-ref mnjivyaztsgxaqihrqec
```

### Desenvolvimento Local

```bash
# Iniciar servidor local completo
npm run supabase:start

# Parar servidor local
npm run supabase:stop

# Resetar banco local (aplica migrations + seed.sql)
npm run supabase:reset
```

### Migrações

```bash
# Criar nova migração
npm run supabase:migration nome_da_migracao

# Aplicar migrações no remoto
npm run supabase:push

# Baixar migrações do remoto
npm run supabase:pull
```

### Tipos TypeScript

```bash
# Gerar tipos TypeScript do banco
npm run supabase:types
```

### Criar Usuário Admin

```bash
# Criar usuário admin no projeto remoto
supabase auth admin create-user \
  --email admin@exemplo.com \
  --password senha123456 \
  --user-metadata '{"role":"admin","full_name":"Admin Name"}' \
  --email-confirm
```

---

## 🎯 Próximos Passos

### 1. Linkar com Projeto Remoto

Você precisará do **database password** do seu projeto Supabase:

1. Acesse: https://app.supabase.com → Seu Projeto → **Settings** → **Database**
2. Role até **Connection string** → copie a senha da URL
3. Execute:
   ```bash
   supabase link --project-ref mnjivyaztsgxaqihrqec
   ```
4. Quando pedir a senha, cole a senha do database

### 2. Criar Usuário Admin via CLI

```bash
supabase auth admin create-user \
  --email seu-email@exemplo.com \
  --password senha123456 \
  --user-metadata '{"role":"admin","full_name":"Seu Nome"}' \
  --email-confirm
```

### 3. Aplicar Migrações Existentes

Se você já tem scripts SQL (`criar_todas_tabelas.sql`, `setup_auth_supabase.sql`):

1. Crie migrações a partir deles:
   ```bash
   npm run supabase:migration criar_todas_tabelas
   ```
2. Copie o conteúdo do SQL para o arquivo criado em `supabase/migrations/`
3. Aplique no remoto:
   ```bash
   npm run supabase:push
   ```

---

## 📁 Estrutura Criada

```
supabase/
├── config.toml          # Configuração do projeto
├── migrations/          # Migrações SQL (versionadas)
└── seed.sql            # Dados de seed para desenvolvimento local
```

---

## 🔧 Configuração Atual

- **Project ID**: `bootflow`
- **API Port**: `54321`
- **Database Port**: `54322`
- **Studio Port**: `54323`
- **Site URL**: `http://localhost:3000`

---

## 💡 Dicas

1. **Desenvolvimento Local**: Use `supabase start` para ter um ambiente completo local
2. **Migrações**: Sempre crie migrações para mudanças no schema
3. **Tipos**: Gere tipos TypeScript regularmente com `npm run supabase:types`
4. **Reset**: Use `supabase db reset` para resetar e aplicar tudo do zero

---

## 📚 Documentação

Veja o arquivo `GUIA_SUPABASE_CLI.md` para mais detalhes e comandos avançados.

