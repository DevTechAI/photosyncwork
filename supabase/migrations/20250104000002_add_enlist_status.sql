-- Add enlist_status column to freelancers table
-- This allows photographers to control whether they appear in the "Browse Talent" list

ALTER TABLE public.freelancers
ADD COLUMN enlist_status TEXT DEFAULT 'enlisted' CHECK (enlist_status IN ('enlisted', 'delisted'));

-- Update the existing query to filter by enlist_status
-- Only show freelancers who are enlisted (enlist_status = 'enlisted')
-- This maintains backward compatibility - existing freelancers will be 'enlisted' by default

-- Create an index for performance
CREATE INDEX IF NOT EXISTS idx_freelancers_enlist_status ON public.freelancers(enlist_status);

-- Create a function to toggle enlist status for a freelancer
CREATE OR REPLACE FUNCTION public.toggle_freelancer_enlist_status(f_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_status TEXT;
  new_status TEXT;
BEGIN
  -- Get current enlist status
  SELECT enlist_status INTO current_status
  FROM public.freelancers
  WHERE id = f_id AND user_id = auth.uid();
  
  -- If freelancer not found or not owned by current user, return error
  IF current_status IS NULL THEN
    RETURN 'error: freelancer not found or not owned by user';
  END IF;
  
  -- Toggle the status
  IF current_status = 'enlisted' THEN
    new_status := 'delisted';
  ELSE
    new_status := 'enlisted';
  END IF;
  
  -- Update the status
  UPDATE public.freelancers
  SET enlist_status = new_status, updated_at = now()
  WHERE id = f_id AND user_id = auth.uid();
  
  RETURN new_status;
END;
$$;

-- Create a function to get current user's freelancer profile with enlist status
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
  RETURN QUERY
  SELECT
    f.id,
    f.name,
    f.role,
    f.location,
    f.rating,
    f.review_count,
    f.hourly_rate,
    f.avatar,
    f.specialties,
    f.is_available,
    f.portfolio_id,
    f.user_id,
    f.email,
    f.phone,
    f.bio,
    f.experience_years,
    f.portfolio_url,
    f.website,
    f.linkedin,
    f.instagram,
    f.enlist_status,
    f.created_at,
    f.updated_at
  FROM public.freelancers f
  WHERE f.user_id = auth.uid();
END;
$$;

-- Update RLS policies to include enlist_status considerations
-- Only show enlisted freelancers in public queries
DROP POLICY IF EXISTS "Public can view active freelancers" ON public.freelancers;
CREATE POLICY "Public can view enlisted freelancers"
  ON public.freelancers
  FOR SELECT
  USING (is_available = TRUE AND enlist_status = 'enlisted');

-- Users can view their own freelancer profile regardless of enlist status
CREATE POLICY "Users can view their own freelancer profile"
  ON public.freelancers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own freelancer profile including enlist status
DROP POLICY IF EXISTS "Users can update their own freelancer profile" ON public.freelancers;
CREATE POLICY "Users can update their own freelancer profile"
  ON public.freelancers
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add comment to explain the enlist_status column
COMMENT ON COLUMN public.freelancers.enlist_status IS 'Controls whether freelancer appears in public talent browse list. Values: enlisted (visible), delisted (hidden)';
