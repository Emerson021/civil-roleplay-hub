-- =====================================================
-- CORRIGIR ESTRUTURA DO BANCO DE DADOS
-- =====================================================

-- 1. LIMPAR ESTRUTURA ATUAL (se existir)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.profile_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CRIAR TABELA PERMISSIONS CORRETA
CREATE TABLE public.permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR TABELA PROFILE_PERMISSIONS CORRETA
CREATE TABLE public.profile_permissions (
    id SERIAL PRIMARY KEY,
    profile_type VARCHAR(20) NOT NULL,
    permission_id INTEGER NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_type, permission_id)
);

-- 4. CRIAR TABELA PROFILES CORRETA (com colunas necessárias)
CREATE TABLE public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    rg VARCHAR(20) NOT NULL,
    profile_type VARCHAR(20) NOT NULL DEFAULT 'citizen' CHECK (profile_type IN ('citizen', 'agent', 'admin')),
    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES public.profiles(user_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRIAR TABELA AUDIT_LOGS CORRETA
CREATE TABLE public.audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INSERIR PERMISSÕES BÁSICAS
INSERT INTO public.permissions (name, description) VALUES
('view_news', 'Visualizar notícias'),
('create_news', 'Criar notícias'),
('edit_news', 'Editar notícias'),
('delete_news', 'Deletar notícias'),
('manage_concursos', 'Gerenciar concursos'),
('view_users', 'Visualizar usuários'),
('manage_users', 'Gerenciar usuários'),
('approve_users', 'Aprovar usuários'),
('view_admin_panel', 'Acessar painel administrativo'),
('manage_system', 'Gerenciar sistema');

-- 7. INSERIR PERMISSÕES POR TIPO DE PERFIL
-- CIDADÃO
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'citizen', id FROM public.permissions WHERE name IN ('view_news');

-- AGENTE
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'agent', id FROM public.permissions WHERE name IN ('view_news', 'create_news', 'edit_news', 'manage_concursos', 'view_users');

-- ADMIN
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'admin', id FROM public.permissions;

-- 8. CRIAR FUNÇÃO HAS_PERMISSION CORRIGIDA
CREATE OR REPLACE FUNCTION public.has_permission(permission_name VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_profile_type VARCHAR;
    has_perm BOOLEAN;
BEGIN
    -- Obter o tipo de perfil do usuário atual
    SELECT profile_type INTO user_profile_type
    FROM public.profiles
    WHERE user_id = auth.uid();
    
    -- Se não encontrou perfil, retorna false
    IF user_profile_type IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar se o usuário tem a permissão
    SELECT EXISTS(
        SELECT 1
        FROM public.profile_permissions pp
        JOIN public.permissions p ON pp.permission_id = p.id
        WHERE pp.profile_type = user_profile_type
        AND p.name = permission_name
    ) INTO has_perm;
    
    RETURN COALESCE(has_perm, FALSE);
END;
$$;

-- 9. CRIAR FUNÇÃO APPROVE_USER CORRIGIDA
CREATE OR REPLACE FUNCTION public.approve_user(
    user_id_to_approve UUID,
    new_profile_type VARCHAR DEFAULT 'citizen',
    rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_profile_type VARCHAR;
BEGIN
    -- Verificar se o usuário atual é admin
    SELECT profile_type INTO current_user_profile_type
    FROM public.profiles
    WHERE user_id = auth.uid();
    
    IF current_user_profile_type != 'admin' THEN
        RAISE EXCEPTION 'Apenas administradores podem aprovar usuários';
    END IF;
    
    -- Atualizar o perfil do usuário
    UPDATE public.profiles
    SET 
        profile_type = new_profile_type,
        approval_status = CASE 
            WHEN rejection_reason IS NULL THEN 'approved'
            ELSE 'rejected'
        END,
        approved_by = auth.uid(),
        approved_at = NOW(),
        rejection_reason = rejection_reason,
        is_admin = (new_profile_type = 'admin'),
        updated_at = NOW()
    WHERE user_id = user_id_to_approve;
    
    RETURN TRUE;
END;
$$;

-- 10. CRIAR FUNÇÃO LOG_AUDIT_EVENT CORRIGIDA
CREATE OR REPLACE FUNCTION public.log_audit_event(
    action_name VARCHAR,
    table_name VARCHAR,
    record_id VARCHAR,
    old_values JSONB DEFAULT NULL,
    new_values JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address
    ) VALUES (
        auth.uid(),
        action_name,
        table_name,
        record_id,
        old_values,
        new_values,
        inet_client_addr()
    );
END;
$$;

-- 11. CRIAR TRIGGER PARA AUDITORIA
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_audit_event('INSERT', TG_TABLE_NAME, NEW.user_id::VARCHAR, NULL, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM public.log_audit_event('UPDATE', TG_TABLE_NAME, NEW.user_id::VARCHAR, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.log_audit_event('DELETE', TG_TABLE_NAME, OLD.user_id::VARCHAR, to_jsonb(OLD), NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- 12. APLICAR TRIGGER NA TABELA PROFILES
CREATE TRIGGER audit_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- 13. CONFIGURAR RLS (ROW LEVEL SECURITY)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 14. CRIAR POLÍTICAS RLS CORRETAS
-- PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND profile_type = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- PROFILE_PERMISSIONS
CREATE POLICY "Anyone can view profile permissions" ON public.profile_permissions
    FOR SELECT USING (true);

-- PERMISSIONS
CREATE POLICY "Anyone can view permissions" ON public.permissions
    FOR SELECT USING (true);

-- AUDIT_LOGS
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE user_id = auth.uid() AND profile_type = 'admin'
        )
    );

-- 15. VERIFICAR SE FOI CRIADO CORRETAMENTE
SELECT 'TABELAS CRIADAS:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'permissions', 'profile_permissions', 'audit_logs');

SELECT 'ESTRUTURA PROFILES:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 'PERMISSÕES INSERIDAS:' as info;
SELECT * FROM public.permissions;

SELECT 'PERFIL PERMISSÕES INSERIDAS:' as info;
SELECT pp.profile_type, p.name as permission_name
FROM public.profile_permissions pp
JOIN public.permissions p ON pp.permission_id = p.id
ORDER BY pp.profile_type, p.name;

-- =====================================================
-- INSTRUÇÕES DE USO:
-- =====================================================

-- 1. Execute este script completo no SQL Editor do Supabase
-- 2. Verifique se todas as tabelas foram criadas
-- 3. Verifique se a estrutura da tabela profiles está correta
-- 4. Agora execute o script para criar o usuário admin
-- 5. Teste o sistema de autenticação

-- =====================================================
-- PRÓXIMO PASSO:
-- =====================================================

-- Após executar este script, execute o próximo para criar o usuário admin:
-- setup-admin-corrigido.sql
