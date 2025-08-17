-- =====================================================
-- VERIFICAR E CORRIGIR STATUS DO USUÁRIO ADMIN (CORRIGIDO)
-- =====================================================

-- 1. Verificar se o usuário existe no auth.users
SELECT 
  'AUTH.USERS' as tabela,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 2. Verificar se o perfil existe e está correto
SELECT 
  'PUBLIC.PROFILES' as tabela,
  user_id,
  full_name,
  email,
  profile_type,
  approval_status,
  is_admin,
  is_active,
  created_at
FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 3. Verificar permissões do admin (se existir)
SELECT 
  'PERMISSÕES' as tipo,
  p.full_name,
  p.profile_type,
  p.approval_status,
  perm.name as permission_name,
  perm.description
FROM public.profiles p
JOIN public.profile_permissions pp ON p.profile_type = pp.profile_type
JOIN public.permissions perm ON pp.permission_id = perm.id
WHERE p.email = 'emersonmotaramos007@gmail.com'
ORDER BY perm.name;

-- 4. CORRIGIR STATUS DO ADMIN (se necessário)
-- Descomente as linhas abaixo se o admin não estiver configurado corretamente

-- Atualizar perfil como admin aprovado
UPDATE public.profiles 
SET 
  profile_type = 'admin',
  approval_status = 'approved',
  is_admin = true,
  is_active = true,
  approved_by = user_id,
  approved_at = now()
WHERE email = 'emersonmotaramos007@gmail.com';

-- 5. Verificar se foi corrigido
SELECT 
  'VERIFICAÇÃO FINAL' as status,
  p.user_id,
  p.full_name,
  p.email,
  p.profile_type,
  p.approval_status,
  p.is_admin,
  p.is_active,
  p.approved_at
FROM public.profiles p
WHERE p.email = 'emersonmotaramos007@gmail.com';

-- 6. Testar função has_permission (se existir)
SELECT 
  'TESTE PERMISSÃO' as teste,
  public.has_permission('manage_users') as can_manage_users,
  public.has_permission('manage_news') as can_manage_news,
  public.has_permission('manage_concursos') as can_manage_concursos;

-- =====================================================
-- ALTERNATIVA: VERIFICAR POR USER_ID
-- =====================================================

-- Se o email não funcionar, vamos buscar o user_id primeiro
WITH user_info AS (
  SELECT id as user_id, email
  FROM auth.users 
  WHERE email = 'emersonmotaramos007@gmail.com'
)
SELECT 
  'USUÁRIO ENCONTRADO' as status,
  ui.user_id,
  ui.email,
  p.full_name,
  p.profile_type,
  p.approval_status,
  p.is_admin,
  p.is_active
FROM user_info ui
LEFT JOIN public.profiles p ON ui.user_id = p.user_id;

-- =====================================================
-- CORREÇÃO ALTERNATIVA POR USER_ID
-- =====================================================

-- Se precisar corrigir por user_id (substitua USER_ID_AQUI pelo ID real)
-- UPDATE public.profiles 
-- SET 
--   profile_type = 'admin',
--   approval_status = 'approved',
--   is_admin = true,
--   is_active = true,
--   approved_by = user_id,
--   approved_at = now()
-- WHERE user_id = 'USER_ID_AQUI';

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================

-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique se o usuário existe em auth.users
-- 3. Verifique se o perfil está configurado como admin
-- 4. Se não estiver, execute o UPDATE (linha 35-42)
-- 5. Se o UPDATE não funcionar, use a versão por user_id
-- 6. Verifique se as permissões estão corretas
-- 7. Teste o login novamente

-- =====================================================
-- PROBLEMAS COMUNS:
-- =====================================================

-- Problema: "Usuário não encontrado"
-- Solução: Criar usuário no Supabase Auth

-- Problema: "Perfil não existe"
-- Solução: Executar setup-admin.sql

-- Problema: "Não é admin"
-- Solução: Executar o UPDATE acima

-- Problema: "Permissões não funcionam"
-- Solução: Verificar se as migrações foram executadas
