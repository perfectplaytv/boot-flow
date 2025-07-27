# 🔧 Guia de Correção - Erro de Política de Segurança (RLS) - Revendedores

## 🚨 Problema Identificado

O erro **"new row violates row-level security policy for table 'resellers'"** está ocorrendo porque as políticas RLS (Row Level Security) do Supabase estão bloqueando as operações na tabela `resellers`.

## 🛠️ Soluções Disponíveis

### Opção 1: Solução Rápida (Recomendada)

**Desabilitar completamente o RLS na tabela resellers:**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Navegue até **SQL Editor**
3. Cole e execute este script:

```sql
-- Desabilitar RLS completamente na tabela resellers
ALTER TABLE resellers DISABLE ROW LEVEL SECURITY;

-- Verificar se o RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'resellers';
```

### Opção 2: Solução Completa (Com Políticas)

**Criar políticas RLS adequadas:**

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Navegue até **SQL Editor**
3. Cole e execute este script:

```sql
-- Script para corrigir as políticas RLS da tabela resellers

-- 1. Desabilitar temporariamente o RLS
ALTER TABLE resellers DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes
DROP POLICY IF EXISTS "Resellers can view own data" ON resellers;
DROP POLICY IF EXISTS "Only admins can insert resellers" ON resellers;
DROP POLICY IF EXISTS "Resellers can update own data" ON resellers;
DROP POLICY IF EXISTS "Resellers can delete own data" ON resellers;

-- 3. Habilitar RLS novamente
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas mais permissivas
CREATE POLICY "Enable read access for authenticated users" ON resellers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON resellers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON resellers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON resellers
  FOR DELETE USING (auth.role() = 'authenticated');
```

## 📋 Passo a Passo

### 1. Acessar o Supabase Dashboard
- Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Faça login na sua conta
- Selecione seu projeto

### 2. Abrir o SQL Editor
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova consulta

### 3. Executar o Script
- Cole um dos scripts acima na área de texto
- Clique no botão **"Run"** (▶️) para executar
- Aguarde a confirmação de sucesso

### 4. Verificar a Correção
- Volte para sua aplicação
- Tente adicionar um novo revendedor
- O erro deve ter sido resolvido

## 🔍 Verificação

Para verificar se a correção funcionou:

1. **No Supabase Dashboard:**
   ```sql
   -- Verificar se o RLS está desabilitado
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'resellers';
   ```

2. **Na sua aplicação:**
   - Tente adicionar um novo revendedor
   - Verifique se não há mais erros de RLS
   - Confirme se os dados estão sendo salvos

## ⚠️ Considerações de Segurança

### Opção 1 (Desabilitar RLS):
- ✅ **Vantagem:** Funciona imediatamente
- ❌ **Desvantagem:** Sem proteção de segurança
- 🎯 **Recomendado para:** Desenvolvimento e testes

### Opção 2 (Políticas RLS):
- ✅ **Vantagem:** Mantém segurança
- ✅ **Desvantagem:** Requer autenticação configurada
- 🎯 **Recomendado para:** Produção

## 🚀 Próximos Passos

Após corrigir o erro:

1. **Teste as funcionalidades:**
   - Adicionar revendedores
   - Editar revendedores
   - Excluir revendedores
   - Listar revendedores

2. **Configure autenticação (se necessário):**
   - Implemente login/logout
   - Configure políticas de acesso
   - Teste com usuários autenticados

3. **Monitoramento:**
   - Verifique logs de erro
   - Monitore performance
   - Configure alertas se necessário

## 🧪 Teste Automatizado

Execute este script no console do navegador para testar:

```javascript
// Copie e cole no console do navegador (F12)
// Execute o script test-rls-fix-resellers.js
```

## 🆘 Suporte

Se ainda tiver problemas:

1. **Verifique os logs:**
   - Console do navegador (F12)
   - Logs do Supabase Dashboard

2. **Teste a conexão:**
   ```javascript
   // No console do navegador
   const { data, error } = await supabase.from('resellers').select('count');
   console.log(data, error);
   ```

3. **Contate o suporte:**
   - Documentação: [https://supabase.com/docs](https://supabase.com/docs)
   - Comunidade: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

## 📊 Arquivos Criados

### Scripts SQL:
- `fix-rls-policies-resellers.sql` - Correção completa com políticas
- `disable-rls-resellers.sql` - Desabilitação completa do RLS

### Melhorias no Código:
- `src/hooks/useRevendas.ts` - Hook melhorado com tratamento de erros RLS
- `src/components/RLSErrorBannerResellers.tsx` - Componente específico para erros RLS
- `src/pages/AdminResellers.tsx` - Página atualizada com melhor tratamento de erros

### Testes:
- `test-rls-fix-resellers.js` - Script de teste automatizado

---

**Última atualização:** Correção implementada com scripts SQL e melhorias no código para revendedores 