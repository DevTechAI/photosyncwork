/*
  # Add Portfolio Foreign Key to Freelancers Table
  
  This migration adds a foreign key relationship between freelancers and portfolios,
  allowing freelancers to showcase their work and create a proper connection
  between their profile and their portfolio.
  
  Changes:
  1. Add portfolio_id column to freelancers table
  2. Add foreign key constraint to portfolios table
  3. Update RLS policies to handle portfolio relationships
  4. Add indexes for performance
  5. Add helper functions for freelancer-portfolio management
*/

-- Add portfolio_id column to freelancers table
ALTER TABLE public.freelancers 
ADD COLUMN portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL;

-- Add user_id column to freelancers table for better user management
ALTER TABLE public.freelancers 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add additional fields for better freelancer management
ALTER TABLE public.freelancers 
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN experience_years INTEGER DEFAULT 0,
ADD COLUMN portfolio_url TEXT,
ADD COLUMN website TEXT,
ADD COLUMN linkedin TEXT,
ADD COLUMN instagram TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_freelancers_portfolio_id ON public.freelancers(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_freelancers_user_id ON public.freelancers(user_id);
CREATE INDEX IF NOT EXISTS idx_freelancers_email ON public.freelancers(email);
CREATE INDEX IF NOT EXISTS idx_freelancers_specialties ON public.freelancers USING GIN(specialties);

-- Update RLS policies for freelancers table
DROP POLICY IF EXISTS "Public can view freelancers" ON public.freelancers;
DROP POLICY IF EXISTS "Authenticated users can insert freelancers" ON public.freelancers;
DROP POLICY IF EXISTS "Authenticated users can update freelancers" ON public.freelancers;
DROP POLICY IF EXISTS "Authenticated users can delete freelancers" ON public.freelancers;

-- New RLS policies with portfolio and user relationships
CREATE POLICY "Public can view active freelancers" 
  ON public.freelancers 
  FOR SELECT 
  USING (is_available = true);

CREATE POLICY "Users can view their own freelancer profile" 
  ON public.freelancers 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own freelancer profile" 
  ON public.freelancers 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own freelancer profile" 
  ON public.freelancers 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own freelancer profile" 
  ON public.freelancers 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create function to link freelancer with portfolio
CREATE OR REPLACE FUNCTION public.link_freelancer_portfolio(
  freelancer_id UUID,
  portfolio_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the portfolio belongs to the freelancer's user
  IF NOT EXISTS (
    SELECT 1 FROM public.portfolios p
    JOIN public.freelancers f ON f.user_id = p.user_id
    WHERE p.id = portfolio_id AND f.id = freelancer_id
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Update the freelancer with the portfolio_id
  UPDATE public.freelancers 
  SET portfolio_id = link_freelancer_portfolio.portfolio_id,
      updated_at = now()
  WHERE id = freelancer_id;
  
  RETURN TRUE;
END;
$$;

-- Create function to get freelancer with portfolio data
CREATE OR REPLACE FUNCTION public.get_freelancer_with_portfolio(freelancer_id UUID)
RETURNS TABLE (
  freelancer_id UUID,
  name TEXT,
  role TEXT,
  location TEXT,
  rating NUMERIC,
  review_count INTEGER,
  hourly_rate TEXT,
  avatar TEXT,
  specialties TEXT[],
  is_available BOOLEAN,
  email TEXT,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  portfolio_url TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  portfolio_id UUID,
  portfolio_name TEXT,
  portfolio_tagline TEXT,
  portfolio_about TEXT,
  portfolio_services TEXT[],
  portfolio_contact JSONB,
  portfolio_social_links JSONB
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
    f.email,
    f.phone,
    f.bio,
    f.experience_years,
    f.portfolio_url,
    f.website,
    f.linkedin,
    f.instagram,
    f.portfolio_id,
    p.name as portfolio_name,
    p.tagline as portfolio_tagline,
    p.about as portfolio_about,
    p.services as portfolio_services,
    p.contact as portfolio_contact,
    p.social_links as portfolio_social_links
  FROM public.freelancers f
  LEFT JOIN public.portfolios p ON f.portfolio_id = p.id
  WHERE f.id = freelancer_id;
END;
$$;

-- Create function to get freelancers by specialty with portfolio data
CREATE OR REPLACE FUNCTION public.get_freelancers_by_specialty(
  specialty_filter TEXT DEFAULT NULL,
  location_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  freelancer_id UUID,
  name TEXT,
  role TEXT,
  location TEXT,
  rating NUMERIC,
  review_count INTEGER,
  hourly_rate TEXT,
  avatar TEXT,
  specialties TEXT[],
  is_available BOOLEAN,
  email TEXT,
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  portfolio_id UUID,
  portfolio_name TEXT,
  portfolio_tagline TEXT,
  portfolio_services TEXT[]
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
    f.email,
    f.phone,
    f.bio,
    f.experience_years,
    f.portfolio_id,
    p.name as portfolio_name,
    p.tagline as portfolio_tagline,
    p.services as portfolio_services
  FROM public.freelancers f
  LEFT JOIN public.portfolios p ON f.portfolio_id = p.id
  WHERE f.is_available = true
  AND (specialty_filter IS NULL OR specialty_filter = ANY(f.specialties))
  AND (location_filter IS NULL OR f.location ILIKE '%' || location_filter || '%')
  ORDER BY f.rating DESC, f.review_count DESC
  LIMIT limit_count;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_freelancers_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_freelancers_updated_at
  BEFORE UPDATE ON public.freelancers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_freelancers_updated_at();

-- Add comments for documentation
COMMENT ON COLUMN public.freelancers.portfolio_id IS 'Foreign key to portfolios table - links freelancer to their portfolio';
COMMENT ON COLUMN public.freelancers.user_id IS 'Foreign key to auth.users - links freelancer to their user account';
COMMENT ON COLUMN public.freelancers.email IS 'Freelancer contact email';
COMMENT ON COLUMN public.freelancers.phone IS 'Freelancer contact phone';
COMMENT ON COLUMN public.freelancers.bio IS 'Freelancer biography and description';
COMMENT ON COLUMN public.freelancers.experience_years IS 'Years of professional experience';
COMMENT ON COLUMN public.freelancers.portfolio_url IS 'External portfolio URL (if not using internal portfolio)';
COMMENT ON COLUMN public.freelancers.website IS 'Personal or business website';
COMMENT ON COLUMN public.freelancers.linkedin IS 'LinkedIn profile URL';
COMMENT ON COLUMN public.freelancers.instagram IS 'Instagram profile URL';

-- Update the freelancers table comment
COMMENT ON TABLE public.freelancers IS 'Freelancer profiles with portfolio links and contact information';
