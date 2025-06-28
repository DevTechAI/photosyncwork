-- Create freelancers table
CREATE TABLE IF NOT EXISTS public.freelancers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  hourly_rate TEXT,
  avatar TEXT,
  specialties TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_postings table
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  budget TEXT NOT NULL,
  date TEXT,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for freelancers table
CREATE POLICY "Public can view freelancers" 
  ON public.freelancers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert freelancers" 
  ON public.freelancers 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update freelancers" 
  ON public.freelancers 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete freelancers" 
  ON public.freelancers 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for job_postings table
CREATE POLICY "Public can view job postings" 
  ON public.job_postings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert job postings" 
  ON public.job_postings 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update job postings" 
  ON public.job_postings 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete job postings" 
  ON public.job_postings 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_freelancers_role ON public.freelancers(role);
CREATE INDEX idx_freelancers_location ON public.freelancers(location);
CREATE INDEX idx_job_postings_type ON public.job_postings(type);
CREATE INDEX idx_job_postings_location ON public.job_postings(location);