import { AlertTriangle, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface RLSErrorBannerProps {
  error: string;
  onClearError: () => void;
}

export function RLSErrorBanner({ error, onClearError }: RLSErrorBannerProps) {
  const [copied, setCopied] = useState(false);

  const isRLSError = error.includes('row-level security policy') || 
                     error.includes('políticas de segurança');

  if (!isRLSError) return null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err);
    }
  };

  const disableRLSScript = `-- Desabilitar RLS completamente na tabela users
-- Execute este script no SQL Editor do Supabase Dashboard

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Verificar se o RLS foi desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';`;

  const fixRLSScript = `-- Script para corrigir as políticas RLS da tabela users
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Desabilitar temporariamente o RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Only admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

-- 3. Habilitar RLS novamente
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas mais permissivas
CREATE POLICY "Enable read access for authenticated users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON users
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete access for authenticated users" ON users
  FOR DELETE USING (auth.role() = 'authenticated');`;

  return (
    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-red-400 font-semibold mb-2">
            Erro de Política de Segurança (RLS)
          </h3>
          <p className="text-red-300 text-sm mb-4">
            {error}
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-red-300 font-medium mb-2">Solução Rápida (Recomendada):</h4>
              <div className="bg-gray-800 rounded p-3 mb-2">
                <p className="text-gray-300 text-sm mb-2">
                  Execute este script no SQL Editor do Supabase Dashboard:
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-green-400 bg-gray-900 px-2 py-1 rounded flex-1">
                    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
                  </code>
                  <button
                    onClick={() => copyToClipboard(disableRLSScript)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar Script'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-red-300 font-medium mb-2">Solução Completa (Com Políticas):</h4>
              <div className="bg-gray-800 rounded p-3">
                <p className="text-gray-300 text-sm mb-2">
                  Execute este script para criar políticas RLS adequadas:
                </p>
                <button
                  onClick={() => copyToClipboard(fixRLSScript)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar Script Completo'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-500/30">
            <p className="text-red-300 text-xs">
              <strong>Como executar:</strong> Acesse o Supabase Dashboard → SQL Editor → Cole o script → Execute
            </p>
          </div>
        </div>
        
        <button
          onClick={onClearError}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
} 