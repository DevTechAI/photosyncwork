-- Test script to verify freelancer data is loading correctly
-- Run this in Supabase SQL Editor to check if the sample data was inserted properly

-- Check total count of freelancers
SELECT 
  COUNT(*) as total_freelancers,
  COUNT(CASE WHEN enlist_status = 'enlisted' THEN 1 END) as enlisted_count,
  COUNT(CASE WHEN enlist_status = 'delisted' THEN 1 END) as delisted_count
FROM public.freelancers;

-- Check freelancers by role
SELECT 
  role,
  COUNT(*) as count,
  AVG(rating) as avg_rating,
  AVG(experience_years) as avg_experience
FROM public.freelancers 
GROUP BY role
ORDER BY count DESC;

-- Check freelancers by location
SELECT 
  location,
  COUNT(*) as photographer_count
FROM public.freelancers 
WHERE role = 'photographer'
GROUP BY location
ORDER BY photographer_count DESC;

-- Check specialties distribution
SELECT 
  unnest(specialties) as specialty,
  COUNT(*) as count
FROM public.freelancers 
WHERE role = 'photographer'
GROUP BY specialty
ORDER BY count DESC;

-- Sample freelancer data preview
SELECT 
  name,
  role,
  location,
  rating,
  review_count,
  hourly_rate,
  specialties,
  enlist_status,
  experience_years
FROM public.freelancers 
WHERE role = 'photographer'
ORDER BY rating DESC
LIMIT 5;

-- Check job postings
SELECT 
  COUNT(*) as total_jobs,
  COUNT(CASE WHEN type = 'Contract' THEN 1 END) as contract_jobs,
  COUNT(CASE WHEN type = 'Project' THEN 1 END) as project_jobs
FROM public.job_postings;
