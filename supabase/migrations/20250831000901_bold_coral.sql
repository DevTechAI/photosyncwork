/*
  # Add RBAC System to StudioSync

  1. New Tables
    - `roles` - Define available roles in the system
    - `permissions` - Define granular permissions
    - `role_permissions` - Link roles to their permissions
    - `user_roles` - Assign roles to users (many-to-many relationship)

  2. Updates to Existing Tables
    - Add role-related columns to profiles table

  3. Security
    - Enable RLS on all new tables
    - Add policies for role-based access control
    - Create functions for role checking

  4. Data Seeding
    - Insert default roles and permissions
    - Set up initial role-permission mappings
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  resource TEXT NOT NULL, -- e.g., 'estimates', 'invoices', 'team'
  action TEXT NOT NULL, -- e.g., 'create', 'read', 'update', 'delete'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, role_id)
);

-- Add role column to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'primary_role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN primary_role TEXT DEFAULT 'photographer';
  END IF;
END $$;

-- Enable RLS on all new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Anyone can view active roles" 
  ON public.roles 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Only managers can manage roles" 
  ON public.roles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'manager' 
      AND ur.is_active = true
    )
  );

-- RLS Policies for permissions table
CREATE POLICY "Anyone can view permissions" 
  ON public.permissions 
  FOR SELECT 
  USING (true);

-- RLS Policies for role_permissions table
CREATE POLICY "Anyone can view role permissions" 
  ON public.role_permissions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only managers can manage role permissions" 
  ON public.role_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'manager' 
      AND ur.is_active = true
    )
  );

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'manager' 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Only managers can assign roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'manager' 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Only managers can update role assignments" 
  ON public.user_roles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() 
      AND r.name = 'manager' 
      AND ur.is_active = true
    )
  );

-- Insert default roles
INSERT INTO public.roles (name, display_name, description) VALUES
  ('manager', 'Manager', 'Full access to all features and team management'),
  ('photographer', 'Photographer', 'Access to production workflows and portfolio management'),
  ('videographer', 'Videographer', 'Access to video production workflows'),
  ('editor', 'Editor', 'Access to post-production and editing workflows'),
  ('accounts', 'Accounts Manager', 'Access to financial management and invoicing'),
  ('crm', 'CRM Specialist', 'Access to client management and estimates')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO public.permissions (name, display_name, description, resource, action) VALUES
  -- Dashboard permissions
  ('dashboard.view', 'View Dashboard', 'Access to main dashboard', 'dashboard', 'read'),
  
  -- Estimates permissions
  ('estimates.create', 'Create Estimates', 'Create new estimates', 'estimates', 'create'),
  ('estimates.view', 'View Estimates', 'View estimates', 'estimates', 'read'),
  ('estimates.edit', 'Edit Estimates', 'Edit existing estimates', 'estimates', 'update'),
  ('estimates.delete', 'Delete Estimates', 'Delete estimates', 'estimates', 'delete'),
  ('estimates.approve', 'Approve Estimates', 'Approve or decline estimates', 'estimates', 'approve'),
  
  -- Invoices permissions
  ('invoices.create', 'Create Invoices', 'Create new invoices', 'invoices', 'create'),
  ('invoices.view', 'View Invoices', 'View invoices', 'invoices', 'read'),
  ('invoices.edit', 'Edit Invoices', 'Edit existing invoices', 'invoices', 'update'),
  ('invoices.delete', 'Delete Invoices', 'Delete invoices', 'invoices', 'delete'),
  ('invoices.payment', 'Record Payments', 'Record invoice payments', 'invoices', 'payment'),
  
  -- Finances permissions
  ('finances.view', 'View Finances', 'View financial data', 'finances', 'read'),
  ('finances.manage', 'Manage Finances', 'Full financial management', 'finances', 'manage'),
  ('finances.reports', 'View Reports', 'Access financial reports', 'finances', 'reports'),
  
  -- Workflow permissions
  ('workflow.view', 'View Workflow', 'View workflow stages', 'workflow', 'read'),
  ('workflow.manage', 'Manage Workflow', 'Manage workflow and assignments', 'workflow', 'manage'),
  ('workflow.assign', 'Assign Team', 'Assign team members to events', 'workflow', 'assign'),
  
  -- Team permissions
  ('team.view', 'View Team', 'View team members', 'team', 'read'),
  ('team.manage', 'Manage Team', 'Add, edit, delete team members', 'team', 'manage'),
  ('team.assign', 'Assign Tasks', 'Assign tasks to team members', 'team', 'assign'),
  
  -- Portfolio permissions
  ('portfolio.create', 'Create Portfolio', 'Create portfolio', 'portfolio', 'create'),
  ('portfolio.view', 'View Portfolio', 'View portfolios', 'portfolio', 'read'),
  ('portfolio.edit', 'Edit Portfolio', 'Edit portfolio', 'portfolio', 'update'),
  
  -- Client management permissions
  ('clients.view', 'View Clients', 'View client information', 'clients', 'read'),
  ('clients.manage', 'Manage Clients', 'Add, edit, delete clients', 'clients', 'manage'),
  
  -- Settings permissions
  ('settings.view', 'View Settings', 'Access settings', 'settings', 'read'),
  ('settings.manage', 'Manage Settings', 'Modify system settings', 'settings', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE 
  -- Manager gets all permissions
  (r.name = 'manager') OR
  
  -- Photographer permissions
  (r.name = 'photographer' AND p.name IN (
    'dashboard.view', 'workflow.view', 'portfolio.create', 'portfolio.view', 
    'portfolio.edit', 'clients.view', 'settings.view'
  )) OR
  
  -- Videographer permissions
  (r.name = 'videographer' AND p.name IN (
    'dashboard.view', 'workflow.view', 'portfolio.create', 'portfolio.view', 
    'portfolio.edit', 'clients.view', 'settings.view'
  )) OR
  
  -- Editor permissions
  (r.name = 'editor' AND p.name IN (
    'dashboard.view', 'workflow.view', 'portfolio.view', 'settings.view'
  )) OR
  
  -- Accounts permissions
  (r.name = 'accounts' AND p.name IN (
    'dashboard.view', 'invoices.create', 'invoices.view', 'invoices.edit', 
    'invoices.payment', 'finances.view', 'finances.manage', 'finances.reports',
    'clients.view', 'settings.view'
  )) OR
  
  -- CRM permissions
  (r.name = 'crm' AND p.name IN (
    'dashboard.view', 'estimates.create', 'estimates.view', 'estimates.edit',
    'estimates.approve', 'clients.view', 'clients.manage', 'workflow.view',
    'settings.view'
  ))
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(
  user_id UUID,
  permission_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_id
    AND ur.is_active = true
    AND p.name = permission_name
  );
END;
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TABLE (
  role_name TEXT,
  role_display_name TEXT,
  role_description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.name,
    r.display_name,
    r.description
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = user_id
  AND ur.is_active = true;
END;
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS TABLE (
  permission_name TEXT,
  permission_display_name TEXT,
  resource TEXT,
  action TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.name,
    p.display_name,
    p.resource,
    p.action
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role_id = rp.role_id
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = user_id
  AND ur.is_active = true;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON public.permissions(resource, action);