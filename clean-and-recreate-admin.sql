-- =====================================================
-- LIMPAR E RECRIAR USUÁRIO ADMIN CORRETAMENTE
-- =====================================================

-- 1. Verificar usuários existentes antes da limpeza
SELECT 'ANTES DA LIMPEZA:' as status;
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 2. Verificar perfis existentes antes da limpeza
SELECT 
  user_id,
  email,
  profile_type,
  approval_status,
  is_admin
FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 3. LIMPAR USUÁRIOS DUPLICADOS
-- Remover todos os usuários auth com este email
DELETE FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 4. LIMPAR PERFIS DUPLICADOS
-- Remover todos os perfis com este email
DELETE FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 5. Verificar se foi limpo
SELECT 'APÓS LIMPEZA:' as status;
SELECT COUNT(*) as total_users FROM auth.users WHERE email = 'emersonmotaramos007@gmail.com';
SELECT COUNT(*) as total_profiles FROM public.profiles WHERE email = 'emersonmotaramos007@gmail.com';

-- =====================================================
-- INSTRUÇÕES PARA RECRIAR:
-- =====================================================

-- 1. Vá para o Supabase Dashboard
-- 2. Authentication > Users > Add User
-- 3. Preencha:
--    - Email: emersonmotaramos007@gmail.com
--    - Password: 212121
--    - Email Confirm: true
-- 4. Execute o script setup-admin.sql
-- 5. Execute o script fix-login-simple.sql
-- 6. Teste o login

-- =====================================================
-- SCRIPT ALTERNATIVO (se preferir via SQL):
-- =====================================================

-- Inserir usuário auth diretamente (se possível)
-- INSERT INTO auth.users (
--   id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at
-- ) VALUES (
--   gen_random_uuid(),
--   'emersonmotaramos007@gmail.com',
--   crypt('212121', gen_salt('bf')),
--   now(),
--   now(),
--   now()
-- );

-- =====================================================
-- VERIFICAÇÃO FINAL:
-- =====================================================

-- Execute após recriar o usuário:
-- SELECT 
--   u.id,
--   u.email,
--   u.email_confirmed_at,
--   p.profile_type,
--   p.approval_status,
--   p.is_admin
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON u.id = p.user_id
-- WHERE u.email = 'emersonmotaramos007@gmail.com';
