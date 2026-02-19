-- ============================================
-- Script SQL para criar tabela 'clientes' separada
-- Use este script se o código precisar da tabela 'clientes' 
-- além da tabela 'users'
-- ============================================

-- Cria a tabela clientes (se necessário como tabela separada)
CREATE TABLE IF NOT EXISTS public.clientes (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(50),
  cep VARCHAR(10),
  data_nascimento DATE,
  status VARCHAR(50) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
  plano_id VARCHAR(100),
  revendedor_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cria índices
CREATE INDEX IF NOT EXISTS idx_clientes_email ON public.clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_revendedor_id ON public.clientes(revendedor_id);

-- Aplica trigger para updated_at
DROP TRIGGER IF EXISTS set_updated_at_clientes ON public.clientes;
CREATE TRIGGER set_updated_at_clientes
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilita RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DROP POLICY IF EXISTS "Clientes can view all" ON public.clientes;
DROP POLICY IF EXISTS "Clientes can insert all" ON public.clientes;
DROP POLICY IF EXISTS "Clientes can update all" ON public.clientes;
DROP POLICY IF EXISTS "Clientes can delete all" ON public.clientes;

CREATE POLICY "Clientes can view all"
  ON public.clientes
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Clientes can insert all"
  ON public.clientes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Clientes can update all"
  ON public.clientes
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Clientes can delete all"
  ON public.clientes
  FOR DELETE
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE public.clientes IS 'Tabela de clientes (versão alternativa)';

