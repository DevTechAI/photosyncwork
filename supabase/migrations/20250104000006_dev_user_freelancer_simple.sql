-- Create dev user freelancer for testing (Simplified Version)
-- This migration creates freelancer data for an existing auth user

-- First, let's find or create a dev user profile
-- We'll use the email to identify the user instead of a specific UUID

-- Create dev user profile (this will work with any auth user that has the dev email)
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  avatar_url,
  created_at,
  updated_at
) 
SELECT 
  u.id,
  'dev@photosyncwork.com',
  'Dev Photographer',
  '/photosyncwork-logo.png',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'dev@photosyncwork.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();

-- Create dev user role (photographer) - using the user's actual ID
INSERT INTO public.user_roles (
  user_id,
  role_name,
  created_at
) 
SELECT 
  u.id,
  'photographer',
  now()
FROM auth.users u
WHERE u.email = 'dev@photosyncwork.com'
ON CONFLICT (user_id, role_name) DO NOTHING;

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
) 
SELECT 
  gen_random_uuid(),
  u.id,
  'Dev Photographer',
  'photographer',
  'San Francisco, CA',
  4.8,
  45,
  '$120-180/hour',
  '/photosyncwork-logo.png',
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
FROM auth.users u
WHERE u.email = 'dev@photosyncwork.com'
ON CONFLICT (user_id) DO UPDATE SET
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
) 
SELECT 
  gen_random_uuid(),
  u.id,
  'Dev Photographer Portfolio',
  'Capturing Life''s Beautiful Moments',
  'Professional photographer specializing in portrait, event, and commercial photography. With over 6 years of experience, I bring creativity, technical expertise, and a passion for storytelling to every project.',
  ARRAY['Portrait Photography', 'Event Photography', 'Commercial Photography', 'Product Photography', 'Wedding Photography'],
  '{"email": "dev@photosyncwork.com", "phone": "+1 (555) 000-0000", "location": "San Francisco, CA"}',
  '{"instagram": "@devphotographer", "facebook": "", "website": "https://devphotographer.com"}',
  now(),
  now()
FROM auth.users u
WHERE u.email = 'dev@photosyncwork.com'
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  about = EXCLUDED.about,
  services = EXCLUDED.services,
  contact = EXCLUDED.contact,
  social_links = EXCLUDED.social_links,
  updated_at = now();

-- Link the freelancer to the portfolio
UPDATE public.freelancers 
SET portfolio_id = p.id
FROM public.portfolios p
JOIN auth.users u ON p.user_id = u.id
WHERE freelancers.user_id = u.id 
AND u.email = 'dev@photosyncwork.com';

-- Add some portfolio gallery items
INSERT INTO public.portfolio_gallery (
  id,
  portfolio_id,
  url,
  title,
  category,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  p.id,
  '/photosyncwork-logo.png',
  'Portrait Session',
  'Portrait',
  now(),
  now()
FROM public.portfolios p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'dev@photosyncwork.com'

UNION ALL

SELECT 
  gen_random_uuid(),
  p.id,
  '/photosyncwork-logo.png',
  'Corporate Event',
  'Event',
  now(),
  now()
FROM public.portfolios p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'dev@photosyncwork.com'

UNION ALL

SELECT 
  gen_random_uuid(),
  p.id,
  '/photosyncwork-logo.png',
  'Product Photography',
  'Commercial',
  now(),
  now()
FROM public.portfolios p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'dev@photosyncwork.com';

-- Add comment explaining the dev user setup
COMMENT ON TABLE public.freelancers IS 'Dev user freelancer profile created for testing purposes';
COMMENT ON TABLE public.portfolios IS 'Dev user portfolio created for testing purposes';
COMMENT ON TABLE public.portfolio_gallery IS 'Dev user portfolio gallery items for testing';
