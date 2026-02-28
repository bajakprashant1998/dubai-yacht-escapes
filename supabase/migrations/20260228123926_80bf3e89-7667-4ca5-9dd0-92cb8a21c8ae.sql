
CREATE TABLE public.trip_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  travel_date date,
  notes text,
  trip_id uuid,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_leads ENABLE ROW LEVEL SECURITY;

-- Public can submit leads
CREATE POLICY "Anyone can create trip leads" ON public.trip_leads
  FOR INSERT WITH CHECK (true);

-- Admins can manage all leads
CREATE POLICY "Admins can manage trip leads" ON public.trip_leads
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
