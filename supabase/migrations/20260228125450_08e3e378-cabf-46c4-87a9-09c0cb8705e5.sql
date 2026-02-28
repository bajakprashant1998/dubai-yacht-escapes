
-- Ensure proper grants for anon and authenticated roles on trip_leads
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_leads TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
