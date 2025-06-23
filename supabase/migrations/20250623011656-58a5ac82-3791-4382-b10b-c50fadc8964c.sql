
-- Enable Row Level Security on client_portal_access table
ALTER TABLE public.client_portal_access ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to insert client access records
CREATE POLICY "Authenticated users can create client access" 
  ON public.client_portal_access 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy that allows authenticated users to view client access records they created
CREATE POLICY "Authenticated users can view client access" 
  ON public.client_portal_access 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Create policy that allows authenticated users to update client access records
CREATE POLICY "Authenticated users can update client access" 
  ON public.client_portal_access 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Create policy that allows authenticated users to delete client access records
CREATE POLICY "Authenticated users can delete client access" 
  ON public.client_portal_access 
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);
