-- =====================================================
-- DEBUG REGISTRO - IDENTIFICAR PROBLEMAS
-- =====================================================

-- 1. VERIFICAR ESTRUTURA ATUAL DAS TABELAS
SELECT 'ESTRUTURA ATUAL:' as info;
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. VERIFICAR SE AS TABELAS EXISTEM
SELECT 'TABELAS EXISTENTES:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'permissions', 'profile_permissions', 'audit_logs');

-- 3. VERIFICAR FUNÇÕES EXISTENTES
SELECT 'FUNÇÕES EXISTENTES:' as info;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('has_permission', 'approve_user', 'log_audit_event');

-- 4. VERIFICAR POLÍTICAS RLS
SELECT 'POLÍTICAS RLS:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 5. VERIFICAR SE O USUÁRIO ADMIN EXISTE
SELECT 'USUÁRIO ADMIN:' as info;
SELECT user_id, full_name, email, rg, profile_type, approval_status, is_admin
FROM public.profiles 
WHERE email = 'emersonmotaramos007@gmail.com';

-- 6. TESTAR INSERÇÃO MANUAL (SIMULAR REGISTRO)
SELECT 'TESTE INSERÇÃO MANUAL:' as info;
-- Vamos tentar inserir um perfil de teste para ver onde está o erro

-- 7. VERIFICAR LOGS DE ERRO (se existir)
SELECT 'ÚLTIMAS ATIVIDADES:' as info;
SELECT * FROM public.audit_logs 
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================

-- 1. Execute este script no SQL Editor do Supabase
-- 2. Copie TODOS os resultados
-- 3. Me envie os resultados para identificar o problema
-- 4. Especialmente importante: estrutura da tabela profiles

-- =====================================================
-- PROBLEMAS COMUNS:
-- =====================================================

-- ❌ "relation does not exist" = Tabela não foi criada
-- ❌ "column does not exist" = Estrutura incorreta
-- ❌ "function does not exist" = Função não foi criada
-- ❌ "permission denied" = Política RLS incorreta
-- ❌ "duplicate key" = Usuário já existe

-- =====================================================
-- SOLUÇÃO RÁPIDA:
-- =====================================================

-- Se der erro, execute primeiro:
-- 1. corrigir-estrutura-banco.sql
-- 2. setup-admin-corrigido.sql
-- 3. Depois execute este script novamente
