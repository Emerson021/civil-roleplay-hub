-- Security Hardening Migration

-- 1. Drop insecure "Profiles are viewable by everyone" policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. Add secure profile SELECT policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- 3. Tighten Categories RLS - only admins can manage
DROP POLICY IF EXISTS "Only authenticated users can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Only authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Only authenticated users can update categories" ON public.categories;

CREATE POLICY "Only admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- 4. Harden SECURITY DEFINER functions with proper search_path
CREATE OR REPLACE FUNCTION public.soft_delete_post(post_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.news_posts 
  SET deleted_at = now() 
  WHERE id = post_id AND deleted_at IS NULL;
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.restore_deleted_post(post_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.news_posts 
  SET deleted_at = NULL 
  WHERE id = post_id AND deleted_at IS NOT NULL;
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  old_data JSONB;
  new_data JSONB;
  user_id UUID;
BEGIN
  -- Obter dados antigos e novos
  IF TG_OP = 'DELETE' THEN
    old_data = to_jsonb(OLD);
    new_data = NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    old_data = to_jsonb(OLD);
    new_data = to_jsonb(NEW);
  ELSIF TG_OP = 'INSERT' THEN
    old_data = NULL;
    new_data = to_jsonb(NEW);
  END IF;

  -- Obter user_id atual
  user_id := (select auth.uid());

  -- Inserir log de auditoria
  INSERT INTO public.audit_logs (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    user_id
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(OLD.id, NEW.id),
    TG_OP,
    old_data,
    new_data,
    user_id
  );

  RETURN COALESCE(OLD, NEW);
END;
$function$;

-- 5. Make has_permission secure by default (deny by default)
CREATE OR REPLACE FUNCTION public.has_permission(permission_name text)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  uid uuid := auth.uid();
BEGIN
  -- Deny by default if not authenticated
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  -- Only allow specific enumerated permissions
  IF permission_name IN ('approve_user', 'view_admin_panel', 'manage_users', 'manage_posts', 'admin:full_access') THEN
    RETURN public.is_admin(uid);
  END IF;

  -- Deny everything else by default
  RETURN false;
END;
$function$;

-- 6. Add profile protection trigger to prevent privilege escalation
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Only admins can modify privileged fields
  IF NOT public.is_admin(auth.uid()) THEN
    -- Prevent non-admins from changing these fields
    IF (OLD.profile_type IS DISTINCT FROM NEW.profile_type) OR
       (OLD.approval_status IS DISTINCT FROM NEW.approval_status) OR
       (OLD.is_admin IS DISTINCT FROM NEW.is_admin) OR
       (OLD.approved_by IS DISTINCT FROM NEW.approved_by) OR
       (OLD.approved_at IS DISTINCT FROM NEW.approved_at) THEN
      RAISE EXCEPTION 'Insufficient privileges to modify protected fields';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Create the protection trigger
DROP TRIGGER IF EXISTS protect_profile_privileges_trigger ON public.profiles;
CREATE TRIGGER protect_profile_privileges_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_privileges();

-- 7. Add audit triggers for security monitoring
DROP TRIGGER IF EXISTS audit_profiles_trigger ON public.profiles;
CREATE TRIGGER audit_profiles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_news_posts_trigger ON public.news_posts;
CREATE TRIGGER audit_news_posts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.news_posts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_categories_trigger ON public.categories;
CREATE TRIGGER audit_categories_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- 8. Create public author view for displaying author names without exposing PII
CREATE OR REPLACE VIEW public.public_author_profiles AS
SELECT 
  user_id,
  full_name,
  avatar_url
FROM public.profiles
WHERE approval_status = 'approved';

-- RLS policy for the view
ALTER VIEW public.public_author_profiles SET (security_barrier = true);
CREATE POLICY "Public author profiles are viewable by everyone" 
ON public.public_author_profiles 
FOR SELECT 
USING (true);