
-- Create function to get user profile
CREATE OR REPLACE FUNCTION public.get_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  storage_used BIGINT,
  storage_limit BIGINT,
  plan_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.storage_used,
    p.storage_limit,
    p.plan_type,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = user_id;
END;
$$;

-- Create function to create user profile
CREATE OR REPLACE FUNCTION public.create_user_profile(profile_data JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    storage_used,
    storage_limit,
    plan_type,
    created_at,
    updated_at
  ) VALUES (
    (profile_data->>'id')::UUID,
    profile_data->>'email',
    profile_data->>'full_name',
    profile_data->>'avatar_url',
    COALESCE((profile_data->>'storage_used')::BIGINT, 0),
    COALESCE((profile_data->>'storage_limit')::BIGINT, 5368709120),
    COALESCE(profile_data->>'plan_type', 'pilot'),
    COALESCE((profile_data->>'created_at')::TIMESTAMP WITH TIME ZONE, NOW()),
    COALESCE((profile_data->>'updated_at')::TIMESTAMP WITH TIME ZONE, NOW())
  );
END;
$$;

-- Create function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(profile_id UUID, updates JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    email = COALESCE(updates->>'email', email),
    full_name = COALESCE(updates->>'full_name', full_name),
    avatar_url = COALESCE(updates->>'avatar_url', avatar_url),
    storage_used = COALESCE((updates->>'storage_used')::BIGINT, storage_used),
    storage_limit = COALESCE((updates->>'storage_limit')::BIGINT, storage_limit),
    plan_type = COALESCE(updates->>'plan_type', plan_type),
    updated_at = NOW()
  WHERE id = profile_id;
END;
$$;
