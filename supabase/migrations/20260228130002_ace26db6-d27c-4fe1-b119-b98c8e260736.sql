
-- Re-enable RLS but drop all old policies first
ALTER TABLE public.trip_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can insert trip leads" ON public.trip_leads;
DROP POLICY IF EXISTS "Admins can manage trip leads" ON public.trip_leads;

-- Simple permissive policies
CREATE POLICY "anon_insert_trip_leads" ON public.trip_leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_all_trip_leads" ON public.trip_leads FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
