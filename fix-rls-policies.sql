-- Script para corrigir as políticas RLS da tabela users
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos desabilitar temporariamente o RLS para limpar as políticas existentes
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Only admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

-- 3. Habilitar RLS novamente
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas mais permissivas para desenvolvimento
-- Política para SELECT - permitir leitura para todos os usuários autenticados
CREATE POLICY "Enable read access for authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT - permitir inserção para usuários autenticados
CREATE POLICY "Enable insert access for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE - permitir atualização para usuários autenticados
CREATE POLICY "Enable update access for authenticated users" ON users
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE - permitir exclusão para usuários autenticados
CREATE POLICY "Enable delete access for authenticated users" ON users
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Alternativa: Se você quiser permitir acesso total (sem autenticação)
-- Descomente as linhas abaixo se quiser permitir acesso sem autenticação:

-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 6. Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users'; 