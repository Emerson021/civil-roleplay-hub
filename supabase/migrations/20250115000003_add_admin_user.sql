-- =====================================================
-- ADICIONAR USUÁRIO ADMINISTRADOR
-- =====================================================

-- Inserir usuário administrador
INSERT INTO public.profiles (
  user_id, 
  full_name, 
  profile_type, 
  approval_status, 
  approved_by, 
  approved_at,
  is_admin,
  is_active,
  email
) VALUES 
(
  (SELECT id FROM auth.users WHERE email = 'emersonmotaramos007@gmail.com' LIMIT 1),
  'Emerson Motaramos',
  'admin',
  'approved',
  (SELECT id FROM auth.users WHERE email = 'emersonmotaramos007@gmail.com' LIMIT 1),
  now(),
  true,
  true,
  'emersonmotaramos007@gmail.com'
) ON CONFLICT (user_id) DO UPDATE SET
  profile_type = 'admin',
  approval_status = 'approved',
  is_admin = true,
  full_name = 'Emerson Motaramos',
  email = 'emersonmotaramos007@gmail.com';

-- Comentário explicativo
COMMENT ON TABLE public.profiles IS 'Perfis de usuários com diferentes níveis de acesso - Admin: emersonmotaramos007@gmail.com';
