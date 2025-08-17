-- =====================================================
-- SCRIPT SIMPLES PARA RESOLVER PROBLEMA DE LOGIN
-- =====================================================

-- 1. Confirmar email do usuário admin
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'emersonmotaramos007@gmail.com';

-- 2. Verificar se foi confirmado
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 3. Verificar perfil do usuário
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
-- INSTRUÇÕES VIA DASHBOARD (MAIS FÁCIL):
-- =====================================================

-- 1. Acesse: https://supabase.com/dashboard
-- 2. Vá para: Authentication > Users
-- 3. Encontre: emersonmotaramos007@gmail.com
-- 4. Clique no usuário
-- 5. Procure por "Email Confirmed" e marque como TRUE
-- 6. Salve as alterações
-- 7. Teste o login novamente

-- =====================================================
-- SE AINDA NÃO FUNCIONAR:
-- =====================================================

-- Desabilitar confirmação de email temporariamente
-- Vá para: Authentication > Settings
-- Desabilite: "Enable email confirmations"
