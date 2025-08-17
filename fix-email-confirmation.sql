-- =====================================================
-- SCRIPT PARA RESOLVER PROBLEMA DE CONFIRMAÇÃO DE EMAIL
-- =====================================================

-- 1. Verificar configurações atuais de autenticação
SELECT 
  name,
  value,
  description
FROM auth.config 
WHERE name LIKE '%email%';

-- 2. Desabilitar confirmação de email (temporariamente)
UPDATE auth.config 
SET value = 'false' 
WHERE name = 'enable_signup' AND value = 'true';

-- 3. Confirmar email do usuário admin manualmente
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'emersonmotaramos007@gmail.com';

-- 4. Verificar se foi confirmado
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 5. Verificar perfil do usuário
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  p.profile_type,
  p.approval_status,
  p.is_admin,
  p.is_active
FROM public.profiles p
WHERE p.email = 'emersonmotaramos007@gmail.com';

-- =====================================================
-- INSTRUÇÕES ALTERNATIVAS (via Dashboard):
-- =====================================================

-- 1. Acesse: https://supabase.com/dashboard
-- 2. Vá para: Authentication > Settings
-- 3. Desabilite: "Enable email confirmations"
-- 4. Vá para: Authentication > Users
-- 5. Encontre: emersonmotaramos007@gmail.com
-- 6. Clique no usuário e confirme o email
-- 7. Teste o login novamente

-- =====================================================
-- SE AINDA NÃO FUNCIONAR:
-- =====================================================

-- Recriar o usuário com email já confirmado
DELETE FROM auth.users WHERE email = 'emersonmotaramos007@gmail.com';

-- Depois execute o script setup-admin.sql novamente
