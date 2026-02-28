
-- Grant table access to anon and authenticated roles
GRANT SELECT, INSERT ON public.trip_leads TO anon;
GRANT SELECT, INSERT ON public.trip_leads TO authenticated;
GRANT ALL ON public.trip_leads TO authenticated;
