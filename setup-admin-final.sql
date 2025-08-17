-- =====================================================
-- CONFIGURAR USUÁRIO ADMIN FINAL
-- =====================================================

-- 1. VERIFICAR SE O USUÁRIO EXISTE NO AUTH
SELECT 'USUÁRIO AUTH:' as info, id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 2. INSERIR PERFIL ADMIN
INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    profile_type,
    approval_status,
    is_admin,
    is_active,
    approved_by,
    approved_at
) 
SELECT 
    id,
    'Emerson Mota Ramos',
    email,
    'admin',
    'approved',
    true,
    true,
    id,
    NOW()
FROM auth.users 
WHERE email = 'emersonmotaramos007@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    profile_type = 'admin',
    approval_status = 'approved',
    is_admin = true,
    is_active = true,
    approved_by = EXCLUDED.user_id,
    approved_at = NOW(),
    updated_at = NOW();

-- 3. VERIFICAR SE FOI INSERIDO CORRETAMENTE
SELECT 'PERFIL ADMIN CRIADO:' as info, user_id, full_name, email, profile_type, approval_status, is_admin, is_active
FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 4. TESTAR FUNÇÃO HAS_PERMISSION
SELECT 'TESTE PERMISSÕES ADMIN:' as info;
SELECT 
    'manage_users' as permission,
    public.has_permission('manage_users') as can_manage_users
UNION ALL
SELECT 
    'manage_news' as permission,
    public.has_permission('manage_news') as can_manage_news
UNION ALL
SELECT 
    'view_admin_panel' as permission,
    public.has_permission('view_admin_panel') as can_view_admin_panel;

-- 5. VERIFICAR PERMISSÕES DO ADMIN
SELECT 'PERMISSÕES DO ADMIN:' as info, p.name as permission_name, p.description
FROM public.permissions p
JOIN public.profile_permissions pp ON p.id = pp.permission_id
JOIN public.profiles prof ON pp.profile_type = prof.profile_type
WHERE prof.email = 'emersonmotaramos007@gmail.com'
ORDER BY p.name;

-- 6. VERIFICAR ESTRUTURA FINAL
SELECT 'ESTRUTURA FINAL:' as info;
SELECT 
    'profiles' as table_name,
    COUNT(*) as record_count
FROM public.profiles
UNION ALL
SELECT 
    'permissions' as table_name,
    COUNT(*) as record_count
FROM public.permissions
UNION ALL
SELECT 
    'profile_permissions' as table_name,
    COUNT(*) as record_count
FROM public.profile_permissions
UNION ALL
SELECT 
    'audit_logs' as table_name,
    COUNT(*) as record_count
FROM public.audit_logs;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================

-- 1. Execute PRIMEIRO o script: limpar-e-recriar-profiles.sql
-- 2. Execute ESTE script: setup-admin-final.sql
-- 3. Verifique se todas as verificações passaram
-- 4. Teste o login: emersonmotaramos007@gmail.com / 212121
-- 5. Teste o acesso ao painel admin: /admin

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================

-- ✅ Usuário encontrado em auth.users
-- ✅ Perfil admin criado em public.profiles
-- ✅ Todas as permissões funcionando
-- ✅ Função has_permission retornando true para admin
-- ✅ Estrutura das tabelas correta

-- =====================================================
-- TESTE FINAL:
-- =====================================================

-- Após executar os scripts:
-- 1. Faça logout da aplicação
-- 2. Faça login: emersonmotaramos007@gmail.com / 212121
-- 3. Verifique se os botões do painel admin aparecem
-- 4. Acesse: http://localhost:5173/admin
-- 5. Deve funcionar perfeitamente!

-- =====================================================
-- SE DER ALGUM ERRO:
-- =====================================================

-- Erro: "relation does not exist"
-- Solução: Execute primeiro o script limpar-e-recriar-profiles.sql

-- Erro: "function has_permission does not exist"
-- Solução: Execute primeiro o script limpar-e-recriar-profiles.sql

-- Erro: "permission denied"
-- Solução: Verifique se as políticas RLS foram criadas corretamente
