
-- Create client portal access table
CREATE TABLE public.client_portal_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  access_code TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  password_hash TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client deliverables table
CREATE TABLE public.client_deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_watermarked BOOLEAN NOT NULL DEFAULT true,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client feedback table
CREATE TABLE public.client_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  deliverable_id UUID REFERENCES public.client_deliverables(id) ON DELETE CASCADE,
  feedback_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, revision_requested
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.client_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for client portal access
CREATE POLICY "Public can view active access codes" 
  ON public.client_portal_access 
  FOR SELECT 
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- RLS policies for client deliverables (public access for now, will be restricted by access code)
CREATE POLICY "Public can view approved deliverables" 
  ON public.client_deliverables 
  FOR SELECT 
  USING (is_approved = true);

-- RLS policies for client feedback
CREATE POLICY "Public can create feedback" 
  ON public.client_feedback 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can view feedback" 
  ON public.client_feedback 
  FOR SELECT 
  USING (true);

-- Add indexes for performance
CREATE INDEX idx_client_portal_access_code ON public.client_portal_access(access_code);
CREATE INDEX idx_client_portal_event_id ON public.client_portal_access(event_id);
CREATE INDEX idx_client_deliverables_event_id ON public.client_deliverables(event_id);
CREATE INDEX idx_client_feedback_event_id ON public.client_feedback(event_id);
