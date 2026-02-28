
-- Simply disable RLS on trip_leads - it's a public lead form
ALTER TABLE public.trip_leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_leads NO FORCE ROW LEVEL SECURITY;
