-- =====================================================
-- SCRIPT PARA CONFIGURAR USUÁRIO ADMINISTRADOR
-- =====================================================

-- Este script deve ser executado após criar o usuário no Supabase Auth
-- e após aplicar as migrações do sistema de perfis

-- 1. Verificar se o usuário existe no auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 2. Inserir/atualizar o perfil como administrador
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

-- 3. Verificar se foi criado corretamente
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  p.profile_type,
  p.approval_status,
  p.is_admin,
  p.is_active,
  p.created_at
FROM public.profiles p
WHERE p.email = 'emersonmotaramos007@gmail.com';

-- 4. Verificar permissões do admin
SELECT 
  p.full_name,
  p.profile_type,
  perm.name as permission_name,
  perm.description
FROM public.profiles p
JOIN public.profile_permissions pp ON p.profile_type = pp.profile_type
JOIN public.permissions perm ON pp.permission_id = perm.id
WHERE p.email = 'emersonmotaramos007@gmail.com'
ORDER BY perm.name;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================
-- 1. Primeiro, crie o usuário no Supabase Auth com:
--    - Email: emersonmotaramos007@gmail.com
--    - Senha: 212121
--
-- 2. Execute as migrações na ordem:
--    - 20250115000002_implement_user_profiles_and_permissions.sql
--    - 20250115000003_add_admin_user.sql
--
-- 3. Execute este script para verificar se tudo está funcionando
--
-- 4. Teste o login com as credenciais:
--    - Email: emersonmotaramos007@gmail.com
--    - Senha: 212121
-- =====================================================
