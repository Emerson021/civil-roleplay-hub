-- Corrigir problemas de segurança das funções
CREATE OR REPLACE FUNCTION public.soft_delete_post()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.news_posts 
  SET deleted_at = now() 
  WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_deleted_post()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.news_posts 
  SET deleted_at = NULL 
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    table_name, 
    record_id, 
    action, 
    old_data, 
    new_data, 
    user_id, 
    ip_address, 
    user_agent
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid(),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_posts_by_category(category_slug TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  content TEXT,
  slug TEXT,
  status TEXT,
  featured BOOLEAN,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  author_id UUID,
  category_id UUID,
  author_name TEXT,
  category_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.id,
    np.title,
    np.description,
    np.content,
    np.slug,
    np.status,
    np.featured,
    np.image_url,
    np.created_at,
    np.updated_at,
    np.published_at,
    np.author_id,
    np.category_id,
    p.full_name as author_name,
    c.name as category_name
  FROM public.news_posts np
  LEFT JOIN public.profiles p ON np.author_id = p.user_id
  LEFT JOIN public.categories c ON np.category_id = c.id
  WHERE c.slug = category_slug 
    AND np.status = 'published'
    AND np.deleted_at IS NULL
  ORDER BY np.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_featured_posts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  content TEXT,
  slug TEXT,
  status TEXT,
  featured BOOLEAN,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  author_id UUID,
  category_id UUID,
  author_name TEXT,
  category_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.id,
    np.title,
    np.description,
    np.content,
    np.slug,
    np.status,
    np.featured,
    np.image_url,
    np.created_at,
    np.updated_at,
    np.published_at,
    np.author_id,
    np.category_id,
    p.full_name as author_name,
    c.name as category_name
  FROM public.news_posts np
  LEFT JOIN public.profiles p ON np.author_id = p.user_id
  LEFT JOIN public.categories c ON np.category_id = c.id
  WHERE np.featured = true 
    AND np.status = 'published'
    AND np.deleted_at IS NULL
  ORDER BY np.created_at DESC
  LIMIT limit_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_system_stats()
RETURNS TABLE (
  total_posts INTEGER,
  published_posts INTEGER,
  draft_posts INTEGER,
  total_categories INTEGER,
  total_users INTEGER,
  admin_users INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.news_posts WHERE deleted_at IS NULL)::INTEGER as total_posts,
    (SELECT COUNT(*) FROM public.news_posts WHERE status = 'published' AND deleted_at IS NULL)::INTEGER as published_posts,
    (SELECT COUNT(*) FROM public.news_posts WHERE status = 'draft' AND deleted_at IS NULL)::INTEGER as draft_posts,
    (SELECT COUNT(*) FROM public.categories)::INTEGER as total_categories,
    (SELECT COUNT(*) FROM public.profiles WHERE is_active = true)::INTEGER as total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE is_admin = true AND is_active = true)::INTEGER as admin_users;
END;
$$;

CREATE OR REPLACE FUNCTION public.search_posts(search_term TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  content TEXT,
  slug TEXT,
  status TEXT,
  featured BOOLEAN,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  author_id UUID,
  category_id UUID,
  author_name TEXT,
  category_name TEXT,
  relevance_score REAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.id,
    np.title,
    np.description,
    np.content,
    np.slug,
    np.status,
    np.featured,
    np.image_url,
    np.created_at,
    np.updated_at,
    np.published_at,
    np.author_id,
    np.category_id,
    p.full_name as author_name,
    c.name as category_name,
    (
      CASE 
        WHEN np.title ILIKE '%' || search_term || '%' THEN 3.0
        WHEN np.description ILIKE '%' || search_term || '%' THEN 2.0
        WHEN np.content ILIKE '%' || search_term || '%' THEN 1.0
        ELSE 0.0
      END
    ) as relevance_score
  FROM public.news_posts np
  LEFT JOIN public.profiles p ON np.author_id = p.user_id
  LEFT JOIN public.categories c ON np.category_id = c.id
  WHERE np.status = 'published'
    AND np.deleted_at IS NULL
    AND (
      np.title ILIKE '%' || search_term || '%' OR
      np.description ILIKE '%' || search_term || '%' OR
      np.content ILIKE '%' || search_term || '%'
    )
  ORDER BY relevance_score DESC, np.created_at DESC;
END;
$$;
