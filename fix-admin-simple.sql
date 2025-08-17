-- =====================================================
-- CORREÇÃO SIMPLES DO ADMIN
-- =====================================================

-- 1. Primeiro, vamos ver se o usuário existe
SELECT 'USUÁRIO AUTH:' as info, id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 2. Ver se o perfil existe
SELECT 'PERFIL:' as info, user_id, full_name, email, profile_type, approval_status, is_admin 
FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 3. CORRIGIR O ADMIN (execute esta parte se o perfil não estiver como admin)
UPDATE public.profiles 
SET 
  profile_type = 'admin',
  approval_status = 'approved',
  is_admin = true,
  is_active = true,
  approved_by = user_id,
  approved_at = now()
WHERE email = 'emersonmotaramos007@gmail.com';

-- 4. Verificar se foi corrigido
SELECT 'RESULTADO:' as info, user_id, full_name, email, profile_type, approval_status, is_admin, is_active
FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- =====================================================
-- SE DER ERRO, USE ESTA VERSÃO ALTERNATIVA:
-- =====================================================

-- Buscar o user_id primeiro
SELECT 'USER_ID:' as info, id as user_id, email 
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- Depois use o user_id para corrigir (substitua USER_ID_AQUI pelo ID que apareceu acima)
-- UPDATE public.profiles 
-- SET profile_type = 'admin', approval_status = 'approved', is_admin = true, is_active = true
-- WHERE user_id = 'USER_ID_AQUI';
