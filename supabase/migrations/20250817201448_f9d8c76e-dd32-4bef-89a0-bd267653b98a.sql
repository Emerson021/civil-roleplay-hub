
-- 1) Enums para tipo de perfil e status de aprovação
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'profile_type_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.profile_type_enum AS ENUM ('citizen','agent','admin');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'approval_status_enum' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.approval_status_enum AS ENUM ('pending','approved','rejected');
  END IF;
END
$$;

-- 2) Colunas novas em profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS profile_type public.profile_type_enum NOT NULL DEFAULT 'citizen',
  ADD COLUMN IF NOT EXISTS approval_status public.approval_status_enum NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;

-- 3) Garantir unicidade de user_id (necessário para FK aprovada_por -> profiles.user_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND indexname = 'profiles_user_id_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX profiles_user_id_unique_idx ON public.profiles(user_id);
  END IF;
END
$$;

-- 4) FK approved_by -> profiles.user_id (para join approved_by_profile)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_approved_by_fkey'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_approved_by_fkey
      FOREIGN KEY (approved_by) REFERENCES public.profiles(user_id) ON DELETE SET NULL;
  END IF;
END
$$;

-- 5) Backfill simples (opcional): marcar existentes como aprovados e ajustar admin
UPDATE public.profiles
SET profile_type = CASE WHEN is_admin = true THEN 'admin' ELSE profile_type END,
    approval_status = COALESCE(approval_status, 'approved')
WHERE approval_status IS NULL OR (is_admin = true AND profile_type <> 'admin');

-- 6) Atualizar a função de criação de profile no signup e criar trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    badge_number,
    profile_type,
    approval_status,
    is_active,
    is_admin
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Novo Usuário'),
    NEW.email,
    'PC' || LPAD((random() * 9999)::int::text, 4, '0'),
    COALESCE((NEW.raw_user_meta_data ->> 'profile_type')::public.profile_type_enum, 'citizen'),
    'pending',
    true,
    false
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END
$$;

-- 7) Helper para verificar admin sem recursão em RLS
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = _user_id
      AND (p.is_admin = true OR p.profile_type = 'admin')
  );
$$;

-- 8) RPC de permissões
CREATE OR REPLACE FUNCTION public.has_permission(permission_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  IF permission_name IN ('approve_user', 'view_admin_panel', 'manage_users', 'manage_posts')
     OR permission_name LIKE 'admin:%' THEN
    RETURN public.is_admin(uid);
  END IF;

  RETURN true; -- permissões básicas para autenticados
END;
$$;

-- 9) RPC para aprovar/rejeitar usuários
CREATE OR REPLACE FUNCTION public.approve_user(
  user_id_to_approve uuid,
  new_profile_type public.profile_type_enum DEFAULT 'citizen',
  rejection_reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  approver uuid := auth.uid();
BEGIN
  IF approver IS NULL OR NOT public.is_admin(approver) THEN
    RAISE EXCEPTION 'Only admins can approve or reject users';
  END IF;

  IF rejection_reason IS NULL THEN
    UPDATE public.profiles
    SET approval_status = 'approved',
        profile_type    = new_profile_type,
        approved_by     = approver,
        approved_at     = now(),
        rejection_reason = NULL
    WHERE user_id = user_id_to_approve;
  ELSE
    UPDATE public.profiles
    SET approval_status = 'rejected',
        approved_by     = approver,
        approved_at     = now(),
        rejection_reason = rejection_reason
    WHERE user_id = user_id_to_approve;
  END IF;

  RETURN FOUND;
END;
$$;

-- 10) RLS: permitir admin atualizar qualquer perfil (além do usuário atualizar o próprio)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='profiles' AND policyname='Admins can update any profile'
  ) THEN
    CREATE POLICY "Admins can update any profile"
      ON public.profiles
      FOR UPDATE
      USING (public.is_admin(auth.uid()));
  END IF;
END
$$;

-- 11) Índice para facilitar listagem por status
CREATE INDEX IF NOT EXISTS profiles_approval_status_idx ON public.profiles(approval_status);
