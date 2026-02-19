-- Script para corrigir as políticas RLS da tabela resellers
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos desabilitar temporariamente o RLS para limpar as políticas existentes
ALTER TABLE resellers DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Resellers can view own data" ON resellers;
DROP POLICY IF EXISTS "Only admins can insert resellers" ON resellers;
DROP POLICY IF EXISTS "Resellers can update own data" ON resellers;
DROP POLICY IF EXISTS "Resellers can delete own data" ON resellers;

-- 3. Habilitar RLS novamente
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas mais permissivas para desenvolvimento
-- Política para SELECT - permitir leitura para todos os usuários autenticados
CREATE POLICY "Enable read access for authenticated users" ON resellers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT - permitir inserção para usuários autenticados
CREATE POLICY "Enable insert access for authenticated users" ON resellers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE - permitir atualização para usuários autenticados
CREATE POLICY "Enable update access for authenticated users" ON resellers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para DELETE - permitir exclusão para usuários autenticados
CREATE POLICY "Enable delete access for authenticated users" ON resellers
  FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Alternativa: Se você quiser permitir acesso total (sem autenticação)
-- Descomente as linhas abaixo se quiser permitir acesso sem autenticação:

-- ALTER TABLE resellers DISABLE ROW LEVEL SECURITY;

-- 6. Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'resellers'; 