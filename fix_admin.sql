
-- Garantir que a tabela users tenha a coluna role explícita (se não tiver, o Drizzle pode ter confundido)
-- Mas assumindo que usamos 'plan' para role admin no código antigo, vamos garantir todos os campos.

UPDATE users 
SET 
  plan = 'admin',
  status = 'Ativo'
WHERE email = 'pontonois@gmail.com';

-- Se existir a tabela resellers (que tem campo permission), garantimos lá também
INSERT INTO resellers (username, email, permission, password, status)
SELECT 
  'admin_master', 
  email, 
  'admin', 
  password, 
  'Ativo'
FROM users 
WHERE email = 'pontonois@gmail.com'
ON CONFLICT(email) DO UPDATE SET permission = 'admin';
