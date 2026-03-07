
-- Group trips table
CREATE TABLE public.group_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'My Group Trip',
  share_code text NOT NULL DEFAULT encode(extensions.gen_random_bytes(8), 'hex'),
  creator_name text NOT NULL,
  creator_email text NOT NULL,
  creator_phone text,
  trip_date date,
  status text NOT NULL DEFAULT 'open',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(share_code)
);

-- Group trip members
CREATE TABLE public.group_trip_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_trip_id uuid NOT NULL REFERENCES public.group_trips(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  payment_status text NOT NULL DEFAULT 'pending',
  amount_owed numeric NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL DEFAULT 0,
  is_organizer boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

-- Group trip items (shared cart)
CREATE TABLE public.group_trip_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_trip_id uuid NOT NULL REFERENCES public.group_trips(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid,
  title text NOT NULL,
  slug text,
  image_url text,
  price_per_person numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  added_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.group_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_trip_items ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can create and view group trips (share link model)
CREATE POLICY "Anyone can create group trips" ON public.group_trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view group trips" ON public.group_trips FOR SELECT USING (true);
CREATE POLICY "Anyone can update group trips" ON public.group_trips FOR UPDATE USING (true);
CREATE POLICY "Admins can manage group trips" ON public.group_trips FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Members
CREATE POLICY "Anyone can add members" ON public.group_trip_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view members" ON public.group_trip_members FOR SELECT USING (true);
CREATE POLICY "Anyone can update members" ON public.group_trip_members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete members" ON public.group_trip_members FOR DELETE USING (true);
CREATE POLICY "Admins can manage members" ON public.group_trip_members FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Items
CREATE POLICY "Anyone can add items" ON public.group_trip_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view items" ON public.group_trip_items FOR SELECT USING (true);
CREATE POLICY "Anyone can delete items" ON public.group_trip_items FOR DELETE USING (true);
CREATE POLICY "Admins can manage items" ON public.group_trip_items FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE TRIGGER update_group_trips_updated_at BEFORE UPDATE ON public.group_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
