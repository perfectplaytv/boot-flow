-- ============================================
-- Script SQL para ADICIONAR coluna 'price'
-- na tabela users (sem recriar a tabela)
-- ============================================

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

-- Verifica se a coluna foi criada
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name = 'price';

