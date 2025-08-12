-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, badge_number)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Novo Usuário'),
    'PC' || LPAD((random() * 9999)::int::text, 4, '0')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(
      translate(title, 'ÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäçèéêëìíîïñòóôõöùúûüý', 
                     'AAAAAcEEEEIIIINOOOOOUUUUYaaaaaeeeeeiiiinooooouuuuy'),
      '[^a-z0-9\s-]', '', 'g'
    ), 
    '\s+', '-', 'g'
  ));
END;
$$;

CREATE OR REPLACE FUNCTION public.set_news_post_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = public.generate_slug(NEW.title) || '-' || substring(NEW.id::text from 1 for 8);
  END IF;
  RETURN NEW;
END;
$$;