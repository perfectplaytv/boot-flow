import React, { useState } from 'react';
import { AlertCircle, Copy, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RLSErrorBannerCobrancasProps {
  error: string;
  onClearError: () => void;
}

export function RLSErrorBannerCobrancas({ error, onClearError }: RLSErrorBannerCobrancasProps) {
  const [showScripts, setShowScripts] = useState(false);

  const fixRLSScript = `-- Script para corrigir as políticas RLS da tabela cobrancas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos desabilitar temporariamente o RLS para limpar as políticas existentes
ALTER TABLE cobrancas DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Cobrancas can view own data" ON cobrancas;
DROP POLICY IF EXISTS "Only admins can insert cobrancas" ON cobrancas;
DROP POLICY IF EXISTS "Cobrancas can update own data" ON cobrancas;
DROP POLICY IF EXISTS "Cobrancas can delete own data" ON cobrancas;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON cobrancas;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON cobrancas;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON cobrancas;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON cobrancas;

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
WHERE tablename = 'cobrancas';`;

  const disableRLSScript = `-- Script para desabilitar completamente o RLS na tabela cobrancas
-- Execute este script no SQL Editor do Supabase Dashboard se quiser acesso total sem restrições

-- Desabilitar RLS completamente na tabela cobrancas
ALTER TABLE cobrancas DISABLE ROW LEVEL SECURITY;

-- Verificar se o RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'cobrancas';`;

  const addColumnScript = `-- Script para adicionar a coluna formaPagamento à tabela cobrancas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Adicionar a coluna formaPagamento
ALTER TABLE cobrancas 
ADD COLUMN IF NOT EXISTS formaPagamento VARCHAR(50);

-- 2. Adicionar outras colunas que podem estar faltando
ALTER TABLE cobrancas 
ADD COLUMN IF NOT EXISTS gateway VARCHAR(50),
ADD COLUMN IF NOT EXISTS tentativas INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ultimaTentativa TIMESTAMP,
ADD COLUMN IF NOT EXISTS proximaTentativa TIMESTAMP,
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- 3. Verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cobrancas' 
ORDER BY ordinal_position;

-- 4. Atualizar registros existentes com valores padrão para formaPagamento
UPDATE cobrancas 
SET formaPagamento = 'PIX' 
WHERE formaPagamento IS NULL;

-- 5. Verificar se a coluna foi adicionada corretamente
SELECT * FROM cobrancas LIMIT 5;`;

  const copyToClipboard = (text: string, scriptName: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${scriptName} copiado para a área de transferência!`);
  };

  const openSupabase = () => {
    window.open('https://supabase.com/dashboard', '_blank');
  };

  // Verificar se o erro é relacionado à coluna formaPagamento
  const isColumnError = error.includes('formaPagamento') || error.includes('Could not find the');

  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-400">
              Erro de Política RLS - Tabela Cobranças
            </h3>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearError}
          className="text-red-400 hover:text-red-300"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {isColumnError && (
          <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
            <h4 className="text-purple-400 font-semibold mb-2">
              Solução 1: Adicionar Coluna formaPagamento
            </h4>
            <p className="text-purple-300 text-sm mb-3">
              Script para adicionar a coluna formaPagamento à tabela cobrancas - Execute este script no SQL Editor do Supabase Dashboard
            </p>
            <div className="bg-gray-900 rounded p-3 mb-3">
              <pre className="text-xs text-gray-300 overflow-x-auto">{addColumnScript}</pre>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => copyToClipboard(addColumnScript, 'Script de Adição de Coluna')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Script
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={openSupabase}
                className="border-purple-500 text-purple-400 hover:bg-purple-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Supabase
              </Button>
            </div>
          </div>
        )}

        <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
          <h4 className="text-purple-400 font-semibold mb-2">
            Solução 2: Corrigir Políticas RLS
          </h4>
          <p className="text-purple-300 text-sm mb-3">
            Script para corrigir as políticas RLS da tabela cobrancas - Execute este script no SQL Editor do Supabase Dashboard
          </p>
          <div className="bg-gray-900 rounded p-3 mb-3">
            <pre className="text-xs text-gray-300 overflow-x-auto">{fixRLSScript}</pre>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => copyToClipboard(fixRLSScript, 'Script de Correção RLS')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Script
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={openSupabase}
              className="border-purple-500 text-purple-400 hover:bg-purple-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Supabase
            </Button>
          </div>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
          <h4 className="text-purple-400 font-semibold mb-2">
            Solução 3: Desabilitar RLS (Rápido)
          </h4>
          <p className="text-purple-300 text-sm mb-3">
            Script para desabilitar completamente o RLS na tabela cobrancas - Execute este script no SQL Editor do Supabase Dashboard se quiser acesso total sem restrições
          </p>
          <div className="bg-gray-900 rounded p-3 mb-3">
            <pre className="text-xs text-gray-300 overflow-x-auto">{disableRLSScript}</pre>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => copyToClipboard(disableRLSScript, 'Script de Desabilitação RLS')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Script
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={openSupabase}
              className="border-purple-500 text-purple-400 hover:bg-purple-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Supabase
            </Button>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
          <h4 className="text-blue-400 font-semibold mb-2">Instruções:</h4>
          <ol className="text-blue-300 text-sm space-y-1 list-decimal list-inside">
            <li>Acesse o <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Supabase Dashboard</a></li>
            <li>Selecione seu projeto</li>
            <li>Vá para SQL Editor no menu lateral</li>
            <li>Clique em "New query"</li>
            <li>Cole um dos scripts acima</li>
            <li>Clique em "Run" para executar</li>
            <li>Recarregue a página após executar o script</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 