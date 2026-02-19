-- ============================================
-- Script SQL para ADICIONAR campos faltantes
-- na tabela users (sem recriar a tabela)
-- ============================================

-- Adiciona coluna server se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'server') THEN
    ALTER TABLE public.users ADD COLUMN server VARCHAR(100);
  END IF;
END $$;

-- Adiciona coluna plan se não existir e atualiza constraint
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'plan') THEN
    ALTER TABLE public.users ADD COLUMN plan VARCHAR(50);
    -- Adiciona constraint se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_plan_check') THEN
      ALTER TABLE public.users ADD CONSTRAINT users_plan_check 
        CHECK (plan IS NULL OR plan IN ('Mensal', 'Trimestral', 'Semestral', 'Anual'));
    END IF;
  END IF;
END $$;

-- Adiciona coluna name se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'name') THEN
    ALTER TABLE public.users ADD COLUMN name VARCHAR(255);
  END IF;
END $$;

-- Adiciona coluna email se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'email') THEN
    ALTER TABLE public.users ADD COLUMN email VARCHAR(255) UNIQUE;
  END IF;
END $$;

-- Adiciona coluna status se não existir e atualiza constraint
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'status') THEN
    ALTER TABLE public.users ADD COLUMN status VARCHAR(50) DEFAULT 'Ativo';
    -- Adiciona constraint se não existir
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_status_check') THEN
      ALTER TABLE public.users ADD CONSTRAINT users_status_check 
        CHECK (status IS NULL OR status IN ('Ativo', 'Inativo', 'Suspenso', 'Pendente'));
    END IF;
  END IF;
END $$;

-- Adiciona coluna expiration_date se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'expiration_date') THEN
    ALTER TABLE public.users ADD COLUMN expiration_date DATE;
  END IF;
END $$;

-- Adiciona coluna devices se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'devices') THEN
    ALTER TABLE public.users ADD COLUMN devices INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adiciona coluna credits se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'credits') THEN
    ALTER TABLE public.users ADD COLUMN credits INTEGER DEFAULT 0;
  END IF;
END $$;

-- Adiciona coluna password se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'password') THEN
    ALTER TABLE public.users ADD COLUMN password VARCHAR(255);
  END IF;
END $$;

-- Adiciona coluna bouquets se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'bouquets') THEN
    ALTER TABLE public.users ADD COLUMN bouquets TEXT;
  END IF;
END $$;

-- Adiciona coluna real_name se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'real_name') THEN
    ALTER TABLE public.users ADD COLUMN real_name VARCHAR(255);
  END IF;
END $$;

-- Adiciona coluna whatsapp se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'whatsapp') THEN
    ALTER TABLE public.users ADD COLUMN whatsapp VARCHAR(20);
  END IF;
END $$;

-- Adiciona coluna telegram se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'telegram') THEN
    ALTER TABLE public.users ADD COLUMN telegram VARCHAR(100);
  END IF;
END $$;

-- Adiciona coluna observations se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'observations') THEN
    ALTER TABLE public.users ADD COLUMN observations TEXT;
  END IF;
END $$;

-- Adiciona coluna notes se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'notes') THEN
    ALTER TABLE public.users ADD COLUMN notes TEXT;
  END IF;
END $$;

-- Adiciona coluna m3u_url se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'm3u_url') THEN
    ALTER TABLE public.users ADD COLUMN m3u_url TEXT;
  END IF;
END $$;

-- Adiciona coluna renewal_date se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'renewal_date') THEN
    ALTER TABLE public.users ADD COLUMN renewal_date DATE;
  END IF;
END $$;

-- Adiciona coluna phone se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'phone') THEN
    ALTER TABLE public.users ADD COLUMN phone VARCHAR(20);
  END IF;
END $$;

-- Adiciona coluna price se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'price') THEN
    ALTER TABLE public.users ADD COLUMN price VARCHAR(20);
    RAISE NOTICE 'Coluna price adicionada com sucesso à tabela users';
  ELSE
    RAISE NOTICE 'Coluna price já existe na tabela users';
  END IF;
END $$;

-- Cria índices se não existirem
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_server ON public.users(server);
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);

-- Cria ou atualiza função de trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria trigger se não existir
DROP TRIGGER IF EXISTS set_updated_at_users ON public.users;
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIM DO SCRIPT
-- ============================================

