-- Auto-create freelancer profile for photographer roles
-- This function creates a freelancer profile if the user has a photographer role and doesn't have one yet

CREATE OR REPLACE FUNCTION public.ensure_freelancer_profile()
RETURNS TABLE (
  id UUID,
  name TEXT,
  role TEXT,
  location TEXT,
  rating NUMERIC(3,1),
  review_count INTEGER,
  hourly_rate TEXT,
  avatar TEXT,
  specialties TEXT[],
  is_available BOOLEAN,
  portfolio_id UUID,
  user_id UUID,
  email TEXT,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  portfolio_url TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  enlist_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  user_role TEXT;
  freelancer_record RECORD;
BEGIN
  -- Get current user's profile and role
  SELECT 
    p.full_name,
    p.email,
    p.phone,
    p.location,
    ur.role_name
  INTO user_profile, user_role
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE u.id = auth.uid();
  
  -- Check if user has photographer-related role
  IF user_role NOT IN ('photographer', 'videographer', 'editor') THEN
    -- Return empty result if user doesn't have photographer role
    RETURN;
  END IF;
  
  -- Check if freelancer profile already exists
  SELECT * INTO freelancer_record
  FROM public.freelancers
  WHERE user_id = auth.uid();
  
  -- If freelancer profile exists, return it
  IF freelancer_record IS NOT NULL THEN
    RETURN QUERY SELECT * FROM public.freelancers WHERE user_id = auth.uid();
    RETURN;
  END IF;
  
  -- Create freelancer profile if it doesn't exist
  INSERT INTO public.freelancers (
    user_id,
    name,
    role,
    location,
    rating,
    review_count,
    hourly_rate,
    avatar,
    specialties,
    is_available,
    email,
    phone,
    bio,
    experience_years,
    enlist_status,
    created_at,
    updated_at
  ) VALUES (
    auth.uid(),
    COALESCE(user_profile.full_name, 'Photographer'),
    user_role,
    COALESCE(user_profile.location, 'Location not specified'),
    0.0,
    0,
    '$50-100/hour',
    '/photosyncwork-logo.svg',
    CASE 
      WHEN user_role = 'photographer' THEN ARRAY['Photography', 'Portrait', 'Event']
      WHEN user_role = 'videographer' THEN ARRAY['Videography', 'Cinematography', 'Editing']
      WHEN user_role = 'editor' THEN ARRAY['Photo Editing', 'Video Editing', 'Retouching']
      ELSE ARRAY['Creative Services']
    END,
    true,
    user_profile.email,
    user_profile.phone,
    'Professional ' || user_role || ' with expertise in creative services.',
    0,
    'enlisted',
    now(),
    now()
  );
  
  -- Return the newly created freelancer profile
  RETURN QUERY SELECT * FROM public.freelancers WHERE user_id = auth.uid();
END;
$$;

-- Create a function to get or create freelancer profile
CREATE OR REPLACE FUNCTION public.get_or_create_freelancer_profile()
RETURNS TABLE (
  id UUID,
  name TEXT,
  role TEXT,
  location TEXT,
  rating NUMERIC(3,1),
  review_count INTEGER,
  hourly_rate TEXT,
  avatar TEXT,
  specialties TEXT[],
  is_available BOOLEAN,
  portfolio_id UUID,
  user_id UUID,
  email TEXT,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  portfolio_url TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  enlist_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to get existing freelancer profile
  RETURN QUERY SELECT * FROM public.freelancers WHERE user_id = auth.uid();
  
  -- If no profile found, create one
  IF NOT FOUND THEN
    RETURN QUERY SELECT * FROM public.ensure_freelancer_profile();
  END IF;
END;
$$;

-- Update the existing get_current_user_freelancer_profile function to use the new logic
DROP FUNCTION IF EXISTS public.get_current_user_freelancer_profile();

CREATE OR REPLACE FUNCTION public.get_current_user_freelancer_profile()
RETURNS TABLE (
  id UUID,
  name TEXT,
  role TEXT,
  location TEXT,
  rating NUMERIC(3,1),
  review_count INTEGER,
  hourly_rate TEXT,
  avatar TEXT,
  specialties TEXT[],
  is_available BOOLEAN,
  portfolio_id UUID,
  user_id UUID,
  email TEXT,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  portfolio_url TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  enlist_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.get_or_create_freelancer_profile();
END;
$$;

-- Add comment explaining the auto-creation functionality
COMMENT ON FUNCTION public.ensure_freelancer_profile() IS 'Automatically creates a freelancer profile for users with photographer roles if one does not exist';
COMMENT ON FUNCTION public.get_or_create_freelancer_profile() IS 'Gets existing freelancer profile or creates one automatically for photographer roles';
COMMENT ON FUNCTION public.get_current_user_freelancer_profile() IS 'Gets or creates freelancer profile for current user - now includes auto-creation for photographer roles';
