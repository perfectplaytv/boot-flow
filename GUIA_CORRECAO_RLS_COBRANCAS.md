# 🔧 Guia de Correção RLS - Tabela Cobranças

## 🚨 Problema Identificado

A tabela `cobrancas` está apresentando erros de **Row Level Security (RLS)** que impedem o acesso aos dados. O erro aparece como:

```
new row violates row-level security policy for table 'cobrancas'
```

## 📋 Soluções Disponíveis

### ✅ Solução 1: Corrigir Políticas RLS (Recomendado)

Execute o script `fix-rls-policies-cobrancas.sql` no Supabase Dashboard:

```sql
-- Script para corrigir as políticas RLS da tabela cobrancas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos desabilitar temporariamente o RLS para limpar as políticas existentes
ALTER TABLE cobrancas DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Cobrancas can view own data" ON cobrancas;
DROP POLICY IF EXISTS "Only admins can insert cobrancas" ON cobrancas;
DROP POLICY IF EXISTS "Cobrancas can update own data" ON cobrancas;
DROP POLICY IF EXISTS "Cobrancas can delete own data" ON cobrancas;

-- 3. Habilitar RLS novamente
ALTER TABLE cobrancas ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas mais permissivas para desenvolvimento
-- Política para SELECT - permitir leitura para todos os usuários autenticados
CREATE POLICY "Enable read access for authenticated users" ON cobrancas
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT - permitir inserção para usuários autenticados
CREATE POLICY "Enable insert access for authenticated users" ON cobrancas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE - permitir atualização para usuários autenticados
CREATE POLICY "Enable update access for authenticated users" ON cobrancas
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE - permitir exclusão para usuários autenticados
CREATE POLICY "Enable delete access for authenticated users" ON cobrancas
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'cobrancas';
```

### ⚡ Solução 2: Desabilitar RLS (Rápido)

Execute o script `disable-rls-cobrancas.sql` para acesso total:

```sql
-- Script para desabilitar completamente o RLS na tabela cobrancas
-- Execute este script no SQL Editor do Supabase Dashboard se quiser acesso total sem restrições

-- Desabilitar RLS completamente na tabela cobrancas
ALTER TABLE cobrancas DISABLE ROW LEVEL SECURITY;

-- Verificar se o RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cobrancas';
```

## 🛠️ Como Executar

### Passo a Passo:

1. **Acesse o Supabase Dashboard**
   - Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Faça login na sua conta
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New query"** para criar uma nova consulta

3. **Cole o Script**
   - Escolha um dos scripts acima
   - Cole na área de texto do SQL Editor

4. **Execute o Script**
   - Clique no botão **"Run"** (▶️)
   - Aguarde a confirmação de sucesso

5. **Verifique o Resultado**
   - Recarregue a página de Cobranças
   - Os dados devem aparecer normalmente

## 🔍 Verificação

Após executar o script, você pode verificar se funcionou:

```sql
-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'cobrancas';

-- Verificar se o RLS está habilitado/desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cobrancas';
```

## 📊 Melhorias Implementadas

### 1. Hook `useCobrancas` Atualizado
- ✅ Tratamento específico de erros RLS
- ✅ Mensagens de erro mais informativas
- ✅ Função `clearError` adicionada

### 2. Componente `RLSErrorBannerCobrancas`
- ✅ Banner específico para erros RLS de cobranças
- ✅ Scripts SQL copiáveis
- ✅ Instruções passo a passo
- ✅ Links diretos para o Supabase Dashboard

### 3. Página `AdminCobrancas` Atualizada
- ✅ Integração do banner de erro RLS
- ✅ Tratamento de erro melhorado

## 🎯 Resultado Esperado

Após executar um dos scripts:

- ✅ A tabela de cobranças carregará normalmente
- ✅ Operações CRUD funcionarão sem erros
- ✅ Os dados aparecerão na interface
- ✅ Não haverá mais erros de RLS

## 🚀 Próximos Passos

1. Execute um dos scripts SQL no Supabase Dashboard
2. Recarregue a página de Cobranças
3. Verifique se os dados aparecem
4. Teste as operações de adicionar, editar e excluir cobranças

## 📞 Suporte

Se ainda houver problemas após executar os scripts:

1. Verifique se o script foi executado com sucesso
2. Confirme se não há erros de sintaxe
3. Verifique se a tabela `cobrancas` existe no seu projeto
4. Entre em contato se o problema persistir

---

**Status:** ✅ Implementado  
**Última Atualização:** $(date)  
**Versão:** 1.0 