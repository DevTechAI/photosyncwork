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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create portfolio_gallery table
CREATE TABLE IF NOT EXISTS public.portfolio_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_gallery ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios table
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

-- Create indexes for performance
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_portfolio_gallery_portfolio_id ON public.portfolio_gallery(portfolio_id);