-- Atualizar role do usuário para admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'pontonois@gmail.com';

-- Verificar se foi atualizado
SELECT id, email, role, full_name, created_at
FROM public.profiles
WHERE email = 'pontonois@gmail.com';

