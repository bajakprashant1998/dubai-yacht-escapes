
CREATE TABLE public.dubai_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  long_description text,
  event_date date NOT NULL,
  end_date date,
  start_time text,
  end_time text,
  location text,
  venue text,
  image_url text,
  gallery text[] DEFAULT '{}'::text[],
  category text NOT NULL DEFAULT 'festival',
  tags text[] DEFAULT '{}'::text[],
  ticket_url text,
  price_from numeric DEFAULT 0,
  is_free boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  linked_tour_ids uuid[] DEFAULT '{}'::uuid[],
  linked_service_ids uuid[] DEFAULT '{}'::uuid[],
  linked_combo_ids uuid[] DEFAULT '{}'::uuid[],
  meta_title text,
  meta_description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.dubai_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage events" ON public.dubai_events
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active events" ON public.dubai_events
  FOR SELECT TO public
  USING (is_active = true);
