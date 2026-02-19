-- Script para desabilitar completamente o RLS na tabela resellers
-- Execute este script no SQL Editor do Supabase Dashboard se quiser acesso total sem restrições

-- Desabilitar RLS completamente na tabela resellers
ALTER TABLE resellers DISABLE ROW LEVEL SECURITY;

-- Verificar se o RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'resellers'; 