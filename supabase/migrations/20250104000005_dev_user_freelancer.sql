-- Create dev user freelancer for testing
-- This migration creates a test user account and freelancer profile for development/testing

-- IMPORTANT: You must create the auth user FIRST before running this migration
-- Go to Supabase Dashboard → Authentication → Users → Add user
-- Use these exact details:
-- Email: dev@photosyncwork.com
-- Password: devpassword123
-- Email Confirmed: ✅
-- User ID: 11111111-1111-1111-1111-111111111111

-- Check if auth user exists before creating profile
DO $$
BEGIN
  -- Check if the auth user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '11111111-1111-1111-1111-111111111111'::UUID) THEN
    RAISE EXCEPTION 'Auth user with ID 11111111-1111-1111-1111-111111111111 does not exist. Please create the auth user first in Supabase Dashboard → Authentication → Users';
  END IF;
END $$;

-- Create dev user profile
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::UUID,
  'dev@photosyncwork.com',
  'Dev Photographer',
  '/photosyncwork-logo.svg',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();

-- Create dev user role (photographer)
INSERT INTO public.user_roles (
  user_id,
  role_name,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::UUID,
  'photographer',
  now()
) ON CONFLICT (user_id, role_name) DO NOTHING;

-- Create dev freelancer profile
INSERT INTO public.freelancers (
  id,
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
  portfolio_url,
  website,
  linkedin,
  instagram,
  enlist_status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111'::UUID,
  'Dev Photographer',
  'photographer',
  'San Francisco, CA',
  4.8,
  45,
  '$120-180/hour',
  '/photosyncwork-logo.svg',
  ARRAY['Portrait Photography', 'Event Photography', 'Commercial', 'Product Photography'],
  true,
  'dev@photosyncwork.com',
  '+1 (555) 000-0000',
  'Professional photographer with expertise in portrait, event, and commercial photography. Passionate about capturing authentic moments and creating compelling visual stories.',
  6,
  'https://devphotographer.com',
  'https://devphotographer.com',
  'https://linkedin.com/in/devphotographer',
  '@devphotographer',
  'enlisted',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  location = EXCLUDED.location,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  hourly_rate = EXCLUDED.hourly_rate,
  avatar = EXCLUDED.avatar,
  specialties = EXCLUDED.specialties,
  is_available = EXCLUDED.is_available,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  bio = EXCLUDED.bio,
  experience_years = EXCLUDED.experience_years,
  portfolio_url = EXCLUDED.portfolio_url,
  website = EXCLUDED.website,
  linkedin = EXCLUDED.linkedin,
  instagram = EXCLUDED.instagram,
  enlist_status = EXCLUDED.enlist_status,
  updated_at = now();

-- Create a portfolio for the dev user
INSERT INTO public.portfolios (
  id,
  user_id,
  name,
  tagline,
  about,
  services,
  contact,
  social_links,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111'::UUID,
  'Dev Photographer Portfolio',
  'Capturing Life''s Beautiful Moments',
  'Professional photographer specializing in portrait, event, and commercial photography. With over 6 years of experience, I bring creativity, technical expertise, and a passion for storytelling to every project.',
  ARRAY['Portrait Photography', 'Event Photography', 'Commercial Photography', 'Product Photography', 'Wedding Photography'],
  '{"email": "dev@photosyncwork.com", "phone": "+1 (555) 000-0000", "location": "San Francisco, CA"}',
  '{"instagram": "@devphotographer", "facebook": "", "website": "https://devphotographer.com"}',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  about = EXCLUDED.about,
  services = EXCLUDED.services,
  contact = EXCLUDED.contact,
  social_links = EXCLUDED.social_links,
  updated_at = now();

-- Link the freelancer to the portfolio
UPDATE public.freelancers 
SET portfolio_id = (
  SELECT id FROM public.portfolios WHERE user_id = 'dev-user-id-here' LIMIT 1
)
WHERE user_id = 'dev-user-id-here';

-- Add some portfolio gallery items
INSERT INTO public.portfolio_gallery (
  id,
  portfolio_id,
  url,
  title,
  category,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM public.portfolios WHERE user_id = 'dev-user-id-here' LIMIT 1),
  '/photosyncwork-logo.svg',
  'Portrait Session',
  'Portrait',
  now(),
  now()
),
(
  gen_random_uuid(),
  (SELECT id FROM public.portfolios WHERE user_id = 'dev-user-id-here' LIMIT 1),
  '/photosyncwork-logo.svg',
  'Corporate Event',
  'Event',
  now(),
  now()
),
(
  gen_random_uuid(),
  (SELECT id FROM public.portfolios WHERE user_id = 'dev-user-id-here' LIMIT 1),
  '/photosyncwork-logo.svg',
  'Product Photography',
  'Commercial',
  now(),
  now()
);

-- Add comment explaining the dev user setup
COMMENT ON TABLE public.freelancers IS 'Dev user freelancer profile created for testing purposes';
COMMENT ON TABLE public.portfolios IS 'Dev user portfolio created for testing purposes';
COMMENT ON TABLE public.portfolio_gallery IS 'Dev user portfolio gallery items for testing';
