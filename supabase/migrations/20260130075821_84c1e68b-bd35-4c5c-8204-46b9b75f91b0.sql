-- Add status and phone columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- Create permissions table for granular RBAC
CREATE TABLE IF NOT EXISTS public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  resource text NOT NULL,
  action text NOT NULL,
  allowed boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, resource, action)
);

-- Enable RLS on permissions table
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can manage permissions
CREATE POLICY "Admins can manage permissions"
  ON public.permissions
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Anyone authenticated can read permissions (needed for permission checks)
CREATE POLICY "Authenticated users can view permissions"
  ON public.permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to check permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _resource text, _action text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.permissions p ON ur.role = p.role
    WHERE ur.user_id = _user_id
      AND p.resource = _resource
      AND p.action = _action
      AND p.allowed = true
  )
$$;

-- Update RLS policies for profiles to allow admin management
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Managers can view all profiles
CREATE POLICY "Managers can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));