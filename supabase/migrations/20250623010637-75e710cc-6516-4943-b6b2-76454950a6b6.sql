
-- Add RLS policy to allow inserting new client deliverables
-- Since this is for internal post-production workflow, we'll allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert deliverables" 
  ON public.client_deliverables 
  FOR INSERT 
  WITH CHECK (true);

-- Also add a policy to allow authenticated users to update deliverables
CREATE POLICY "Allow authenticated users to update deliverables" 
  ON public.client_deliverables 
  FOR UPDATE 
  USING (true);

-- And allow authenticated users to view all deliverables (for internal use)
CREATE POLICY "Allow authenticated users to view all deliverables" 
  ON public.client_deliverables 
  FOR SELECT 
  USING (true);
