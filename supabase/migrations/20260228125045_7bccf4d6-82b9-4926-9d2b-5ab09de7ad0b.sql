
-- Drop the restrictive INSERT policy and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can create trip leads" ON public.trip_leads;

CREATE POLICY "Anyone can create trip leads"
ON public.trip_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
