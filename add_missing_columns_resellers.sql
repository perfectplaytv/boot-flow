-- ============================================
-- Script SQL para ADICIONAR campos faltantes
-- na tabela resellers (sem recriar a tabela)
-- ============================================

-- Adiciona coluna username se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'username') THEN
    ALTER TABLE public.resellers ADD COLUMN username VARCHAR(100) NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_resellers_username_unique ON public.resellers(username);
  END IF;
END $$;

-- Adiciona coluna password se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'password') THEN
    ALTER TABLE public.resellers ADD COLUMN password VARCHAR(255);
  END IF;
END $$;

-- Adiciona coluna permission com constraint
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'permission') THEN
    ALTER TABLE public.resellers ADD COLUMN permission VARCHAR(50) DEFAULT 'reseller';
    ALTER TABLE public.resellers ADD CONSTRAINT resellers_permission_check 
      CHECK (permission IS NULL OR permission IN ('admin', 'reseller', 'subreseller'));
  END IF;
END $$;

-- Adiciona coluna credits se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'credits') THEN
    ALTER TABLE public.resellers ADD COLUMN credits INTEGER DEFAULT 10;
    ALTER TABLE public.resellers ADD CONSTRAINT resellers_credits_min CHECK (credits >= 10);
  END IF;
END $$;

-- Adiciona coluna force_password_change se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'force_password_change') THEN
    ALTER TABLE public.resellers ADD COLUMN force_password_change BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Adiciona coluna servers se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'servers') THEN
    ALTER TABLE public.resellers ADD COLUMN servers TEXT;
  END IF;
END $$;

-- Adiciona coluna master_reseller se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'master_reseller') THEN
    ALTER TABLE public.resellers ADD COLUMN master_reseller VARCHAR(100);
  END IF;
END $$;

-- Adiciona coluna disable_login_days se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'disable_login_days') THEN
    ALTER TABLE public.resellers ADD COLUMN disable_login_days INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adiciona coluna monthly_reseller se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'monthly_reseller') THEN
    ALTER TABLE public.resellers ADD COLUMN monthly_reseller BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Adiciona coluna personal_name se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'personal_name') THEN
    ALTER TABLE public.resellers ADD COLUMN personal_name VARCHAR(255);
  END IF;
END $$;

-- Adiciona coluna email se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'email') THEN
    ALTER TABLE public.resellers ADD COLUMN email VARCHAR(255);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_resellers_email_unique ON public.resellers(email) WHERE email IS NOT NULL;
  END IF;
END $$;

-- Adiciona coluna telegram se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'telegram') THEN
    ALTER TABLE public.resellers ADD COLUMN telegram VARCHAR(100);
  END IF;
END $$;

-- Adiciona coluna whatsapp se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'whatsapp') THEN
    ALTER TABLE public.resellers ADD COLUMN whatsapp VARCHAR(20);
  END IF;
END $$;

-- Adiciona coluna observations se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'observations') THEN
    ALTER TABLE public.resellers ADD COLUMN observations TEXT;
  END IF;
END $$;

-- Adiciona coluna status se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'status') THEN
    ALTER TABLE public.resellers ADD COLUMN status VARCHAR(50) DEFAULT 'Ativo';
  END IF;
END $$;

-- Adiciona colunas de timestamp se não existirem
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'created_at') THEN
    ALTER TABLE public.resellers ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'resellers' 
                 AND column_name = 'updated_at') THEN
    ALTER TABLE public.resellers ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Cria índices se não existirem
CREATE INDEX IF NOT EXISTS idx_resellers_email ON public.resellers(email);
CREATE INDEX IF NOT EXISTS idx_resellers_username ON public.resellers(username);
CREATE INDEX IF NOT EXISTS idx_resellers_status ON public.resellers(status);
CREATE INDEX IF NOT EXISTS idx_resellers_permission ON public.resellers(permission);
CREATE INDEX IF NOT EXISTS idx_resellers_master_reseller ON public.resellers(master_reseller);

-- Cria ou atualiza função de trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria trigger se não existir
DROP TRIGGER IF EXISTS set_updated_at_resellers ON public.resellers;
CREATE TRIGGER set_updated_at_resellers
  BEFORE UPDATE ON public.resellers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCRIPT
-- ============================================

