
-- Drop ALL existing policies on trip_leads
DROP POLICY IF EXISTS "Admins can manage trip leads" ON public.trip_leads;
DROP POLICY IF EXISTS "Anyone can create trip leads" ON public.trip_leads;

-- Disable and re-enable RLS to reset
ALTER TABLE public.trip_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_leads ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner too (important for Supabase)
ALTER TABLE public.trip_leads FORCE ROW LEVEL SECURITY;

-- Create permissive INSERT policy for everyone
CREATE POLICY "Public can insert trip leads"
ON public.trip_leads
FOR INSERT
TO public
WITH CHECK (true);

-- Create admin management policy
CREATE POLICY "Admins can manage trip leads"
ON public.trip_leads
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Ensure grants
GRANT INSERT ON public.trip_leads TO anon;
GRANT INSERT ON public.trip_leads TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.trip_leads TO authenticated;
