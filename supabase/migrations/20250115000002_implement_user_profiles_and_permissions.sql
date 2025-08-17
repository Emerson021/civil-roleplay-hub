-- =====================================================
-- SISTEMA DE PERFIS E PERMISSÕES - CIVIL ROLEPLAY HUB
-- =====================================================

-- 1. ENUM para tipos de perfil
CREATE TYPE user_profile_type AS ENUM ('citizen', 'agent', 'admin');

-- 2. ENUM para status de aprovação
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- 3. Atualizar tabela profiles com novos campos
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_type user_profile_type DEFAULT 'citizen';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approval_status approval_status DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(user_id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badge_number TEXT; -- Para agentes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT; -- Para agentes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank TEXT; -- Para agentes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- 4. Criar tabela de permissões
CREATE TABLE public.permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Criar tabela de permissões por perfil
CREATE TABLE public.profile_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_type user_profile_type NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_type, permission_id)
);

-- 6. Criar tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Criar tabela de comentários
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.news_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES public.profiles(user_id),
  approved_at TIMESTAMPTZ,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- Para respostas
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Inserir permissões básicas
INSERT INTO public.permissions (name, description) VALUES
('view_news', 'Visualizar notícias'),
('create_news', 'Criar notícias'),
('edit_own_news', 'Editar próprias notícias'),
('edit_all_news', 'Editar todas as notícias'),
('delete_news', 'Deletar notícias'),
('view_concursos', 'Visualizar concursos'),
('manage_concursos', 'Gerenciar concursos'),
('view_comments', 'Visualizar comentários'),
('create_comments', 'Criar comentários'),
('moderate_comments', 'Moderar comentários'),
('approve_users', 'Aprovar registros de usuários'),
('manage_users', 'Gerenciar usuários'),
('view_audit_logs', 'Visualizar logs de auditoria'),
('access_admin_panel', 'Acessar painel administrativo'),
('manage_categories', 'Gerenciar categorias'),
('upload_files', 'Fazer upload de arquivos');

-- 9. Definir permissões por perfil
-- Cidadão
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'citizen', id FROM public.permissions 
WHERE name IN ('view_news', 'view_concursos', 'view_comments', 'create_comments');

-- Agente
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'agent', id FROM public.permissions 
WHERE name IN ('view_news', 'create_news', 'edit_own_news', 'view_concursos', 
               'view_comments', 'create_comments', 'upload_files');

-- Admin
INSERT INTO public.profile_permissions (profile_type, permission_id) 
SELECT 'admin', id FROM public.permissions;

-- 10. Habilitar RLS nas novas tabelas
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 11. Políticas RLS para permissions
CREATE POLICY "Permissions are viewable by everyone" 
ON public.permissions FOR SELECT USING (true);

-- 12. Políticas RLS para profile_permissions
CREATE POLICY "Profile permissions are viewable by everyone" 
ON public.profile_permissions FOR SELECT USING (true);

-- 13. Políticas RLS para audit_logs
CREATE POLICY "Audit logs viewable by admins only" 
ON public.audit_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND profile_type = 'admin'
  )
);

CREATE POLICY "Audit logs insertable by system" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- 14. Políticas RLS para comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (is_approved = true OR 
       EXISTS (
         SELECT 1 FROM public.profiles 
         WHERE user_id = auth.uid() AND profile_type IN ('agent', 'admin')
       ));

CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND approval_status = 'approved'
  )
);

CREATE POLICY "Users can edit own comments" 
ON public.comments FOR UPDATE 
USING (author_id = auth.uid());

CREATE POLICY "Admins can moderate comments" 
ON public.comments FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND profile_type = 'admin'
  )
);

-- 15. Atualizar políticas RLS existentes para news_posts
DROP POLICY IF EXISTS "News posts are viewable by everyone" ON public.news_posts;
CREATE POLICY "News posts are viewable by everyone" 
ON public.news_posts FOR SELECT 
USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Approved users can create news posts" 
ON public.news_posts FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND approval_status = 'approved' 
    AND profile_type IN ('agent', 'admin')
  )
);

CREATE POLICY "Users can edit own news posts" 
ON public.news_posts FOR UPDATE 
USING (
  author_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND approval_status = 'approved' 
    AND profile_type IN ('agent', 'admin')
  )
);

CREATE POLICY "Admins can edit all news posts" 
ON public.news_posts FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND profile_type = 'admin'
  )
);

CREATE POLICY "Admins can delete news posts" 
ON public.news_posts FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND profile_type = 'admin'
  )
);

-- 16. Atualizar políticas RLS para concursos
DROP POLICY IF EXISTS "Only admins can insert concursos" ON public.concursos;
CREATE POLICY "Only admins can manage concursos" 
ON public.concursos FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND profile_type = 'admin'
  )
);

-- 17. Criar índices para performance
CREATE INDEX idx_profiles_profile_type ON public.profiles(profile_type);
CREATE INDEX idx_profiles_approval_status ON public.profiles(approval_status);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_author_id ON public.comments(author_id);
CREATE INDEX idx_comments_is_approved ON public.comments(is_approved);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- 18. Função para verificar permissões
CREATE OR REPLACE FUNCTION public.has_permission(permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.profile_permissions pp ON p.profile_type = pp.profile_type
    JOIN public.permissions perm ON pp.permission_id = perm.id
    WHERE p.user_id = auth.uid() 
    AND p.approval_status = 'approved'
    AND perm.name = permission_name
  );
END;
$$;

-- 19. Função para registrar logs de auditoria
CREATE OR REPLACE FUNCTION public.log_audit_event(
  action_name TEXT,
  table_name TEXT DEFAULT NULL,
  record_id UUID DEFAULT NULL,
  old_data JSONB DEFAULT NULL,
  new_data JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    action_name,
    table_name,
    record_id,
    old_data,
    new_data,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;

-- 20. Triggers para auditoria automática
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.log_audit_event(
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 21. Aplicar trigger de auditoria nas tabelas principais
CREATE TRIGGER audit_news_posts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.news_posts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_concursos_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.concursos
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_comments_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- 22. Função para aprovar usuários
CREATE OR REPLACE FUNCTION public.approve_user(
  user_id_to_approve UUID,
  new_profile_type user_profile_type DEFAULT 'citizen',
  rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND profile_type = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem aprovar usuários';
  END IF;

  -- Atualizar o perfil do usuário
  UPDATE public.profiles 
  SET 
    approval_status = CASE 
      WHEN rejection_reason IS NULL THEN 'approved'::approval_status
      ELSE 'rejected'::approval_status
    END,
    profile_type = new_profile_type,
    approved_by = auth.uid(),
    approved_at = now(),
    rejection_reason = rejection_reason
  WHERE user_id = user_id_to_approve;

  -- Registrar log de auditoria
  PERFORM public.log_audit_event(
    'user_approval',
    'profiles',
    user_id_to_approve,
    NULL,
    jsonb_build_object(
      'approval_status', CASE WHEN rejection_reason IS NULL THEN 'approved' ELSE 'rejected' END,
      'profile_type', new_profile_type,
      'rejection_reason', rejection_reason
    )
  );

  RETURN FOUND;
END;
$$;

-- 23. Inserir dados de exemplo
INSERT INTO public.profiles (
  user_id, 
  full_name, 
  profile_type, 
  approval_status, 
  approved_by, 
  approved_at,
  is_admin,
  is_active
) VALUES 
-- Admin padrão (se existir)
(
  (SELECT id FROM auth.users WHERE email = 'admin@policiacivil.gov.br' LIMIT 1),
  'Administrador Sistema',
  'admin',
  'approved',
  (SELECT id FROM auth.users WHERE email = 'admin@policiacivil.gov.br' LIMIT 1),
  now(),
  true,
  true
) ON CONFLICT (user_id) DO UPDATE SET
  profile_type = 'admin',
  approval_status = 'approved',
  is_admin = true;

-- 24. Comentário explicativo
COMMENT ON TABLE public.profiles IS 'Perfis de usuários com diferentes níveis de acesso';
COMMENT ON COLUMN public.profiles.profile_type IS 'Tipo de perfil: citizen, agent, admin';
COMMENT ON COLUMN public.profiles.approval_status IS 'Status de aprovação do registro';
COMMENT ON COLUMN public.profiles.badge_number IS 'Número do distintivo (apenas para agentes)';
COMMENT ON COLUMN public.profiles.department IS 'Departamento (apenas para agentes)';
COMMENT ON COLUMN public.profiles.rank IS 'Patente/graduação (apenas para agentes)';
