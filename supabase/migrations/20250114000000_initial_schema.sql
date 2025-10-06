-- Initial schema setup for PhotoWorkSync
-- This migration creates all essential tables

-- Drop existing problematic functions
DROP FUNCTION IF EXISTS public.get_user_profile();
DROP FUNCTION IF EXISTS public.create_user_profile();
DROP FUNCTION IF EXISTS public.update_user_profile();

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 5368709120,
  plan_type TEXT DEFAULT 'pilot',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create scheduled_events table
CREATE TABLE IF NOT EXISTS public.scheduled_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  starttime TIME NOT NULL,
  endtime TIME NOT NULL,
  location TEXT NOT NULL,
  clientname TEXT NOT NULL,
  clientphone TEXT NOT NULL,
  clientemail TEXT,
  clientrequirements TEXT,
  photographerscount INTEGER DEFAULT 1,
  videographerscount INTEGER DEFAULT 0,
  stage TEXT DEFAULT 'planning',
  assignments JSONB DEFAULT '{}',
  deliverables JSONB,
  timetracking JSONB,
  notes TEXT,
  estimateid TEXT NOT NULL,
  estimatepackage TEXT,
  guestcount TEXT,
  reference_images TEXT[],
  datacopied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on scheduled_events
ALTER TABLE public.scheduled_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for scheduled_events
CREATE POLICY "Users can view all events" ON public.scheduled_events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert events" ON public.scheduled_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update events" ON public.scheduled_events
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete events" ON public.scheduled_events
  FOR DELETE USING (true);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_number TEXT,
  client TEXT NOT NULL,
  client_email TEXT,
  date DATE NOT NULL,
  amount TEXT NOT NULL,
  paid_amount TEXT DEFAULT '0',
  balance_amount TEXT DEFAULT '0',
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  gst_rate TEXT,
  payment_date DATE,
  payment_method TEXT,
  payments JSONB,
  estimate_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view all invoices" ON public.invoices
  FOR SELECT USING (true);

CREATE POLICY "Users can insert invoices" ON public.invoices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update invoices" ON public.invoices
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete invoices" ON public.invoices
  FOR DELETE USING (true);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  role TEXT NOT NULL,
  is_freelancer BOOLEAN DEFAULT false,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for team_members
CREATE POLICY "Users can view all team members" ON public.team_members
  FOR SELECT USING (true);

CREATE POLICY "Users can insert team members" ON public.team_members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update team members" ON public.team_members
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete team members" ON public.team_members
  FOR DELETE USING (true);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  about TEXT,
  services TEXT[] DEFAULT '{}',
  contact JSONB DEFAULT '{"email":"", "phone":"", "location":""}',
  social_links JSONB DEFAULT '{"instagram":"", "facebook":"", "website":""}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_gallery table
CREATE TABLE IF NOT EXISTS public.portfolio_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on portfolio tables
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_gallery ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios table
DROP POLICY IF EXISTS "Users can view their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can insert their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete their own portfolios" ON public.portfolios;

CREATE POLICY "Users can view their own portfolios" 
  ON public.portfolios 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolios" 
  ON public.portfolios 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
  ON public.portfolios 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
  ON public.portfolios 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for portfolio_gallery table
DROP POLICY IF EXISTS "Users can view their own gallery items" ON public.portfolio_gallery;
DROP POLICY IF EXISTS "Users can insert their own gallery items" ON public.portfolio_gallery;
DROP POLICY IF EXISTS "Users can update their own gallery items" ON public.portfolio_gallery;
DROP POLICY IF EXISTS "Users can delete their own gallery items" ON public.portfolio_gallery;

CREATE POLICY "Users can view their own gallery items" 
  ON public.portfolio_gallery 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_gallery.portfolio_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own gallery items" 
  ON public.portfolio_gallery 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_gallery.portfolio_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own gallery items" 
  ON public.portfolio_gallery 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_gallery.portfolio_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own gallery items" 
  ON public.portfolio_gallery 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios 
      WHERE id = portfolio_gallery.portfolio_id 
      AND user_id = auth.uid()
    )
  );

-- Create client_portal_access table
CREATE TABLE IF NOT EXISTS public.client_portal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  event_id TEXT NOT NULL,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on client_portal_access
ALTER TABLE public.client_portal_access ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for client_portal_access
CREATE POLICY "Users can view all client portal access" ON public.client_portal_access
  FOR SELECT USING (true);

CREATE POLICY "Users can insert client portal access" ON public.client_portal_access
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update client portal access" ON public.client_portal_access
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete client portal access" ON public.client_portal_access
  FOR DELETE USING (true);

-- Create realtime_messages table
CREATE TABLE IF NOT EXISTS public.realtime_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on realtime_messages
ALTER TABLE public.realtime_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for realtime_messages
CREATE POLICY "Users can view all messages" ON public.realtime_messages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert messages" ON public.realtime_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" ON public.realtime_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON public.realtime_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for settings
CREATE POLICY "Users can view settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Users can update settings" ON public.settings
  FOR UPDATE USING (true);

-- Insert default settings
INSERT INTO public.settings (settings) VALUES ('{}') ON CONFLICT DO NOTHING;
