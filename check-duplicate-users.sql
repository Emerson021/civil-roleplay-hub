-- =====================================================
-- VERIFICAR USUÁRIOS DUPLICADOS E CONFLITOS
-- =====================================================

-- 1. Verificar todos os usuários no auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email LIKE '%emersonmotaramos007%'
ORDER BY created_at DESC;

-- 2. Verificar todos os usuários com o mesmo email
SELECT 
  email,
  COUNT(*) as total_users,
  STRING_AGG(id::text, ', ') as user_ids,
  STRING_AGG(created_at::text, ', ') as created_dates
FROM auth.users 
GROUP BY email 
HAVING COUNT(*) > 1
ORDER BY total_users DESC;

-- 3. Verificar perfis duplicados
SELECT 
  p.email,
  COUNT(*) as total_profiles,
  STRING_AGG(p.user_id::text, ', ') as user_ids,
  STRING_AGG(p.profile_type::text, ', ') as profile_types
FROM public.profiles p
GROUP BY p.email 
HAVING COUNT(*) > 1
ORDER BY total_profiles DESC;

-- 4. Verificar se existe perfil para o email específico
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

-- 5. Verificar se existe usuário auth para o email específico
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  updated_at
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 6. Verificar total de usuários no sistema
SELECT 
  'Total de usuários auth' as tipo,
  COUNT(*) as total
FROM auth.users
UNION ALL
SELECT 
  'Total de perfis' as tipo,
  COUNT(*) as total
FROM public.profiles;

-- =====================================================
-- SCRIPT PARA LIMPAR DUPLICADOS (SE NECESSÁRIO)
-- =====================================================

-- ATENÇÃO: Execute apenas se encontrar duplicados!

-- Remover usuários auth duplicados (manter apenas o mais recente)
-- DELETE FROM auth.users 
-- WHERE id NOT IN (
--   SELECT MAX(id) 
--   FROM auth.users 
--   WHERE email = 'emersonmotaramos007@gmail.com'
-- );

-- Remover perfis duplicados (manter apenas o mais recente)
-- DELETE FROM public.profiles 
-- WHERE user_id NOT IN (
--   SELECT MAX(user_id) 
--   FROM public.profiles 
--   WHERE email = 'emersonmotaramos007@gmail.com'
-- );

-- =====================================================
-- INSTRUÇÕES DE VERIFICAÇÃO:
-- =====================================================

-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se há usuários duplicados
-- 3. Se houver duplicados, execute os comandos DELETE (descomentados)
-- 4. Depois execute o script fix-login-simple.sql
-- 5. Teste o login novamente
