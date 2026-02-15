
-- Tour Availability Calendar
CREATE TABLE public.tour_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  slots_total INTEGER NOT NULL DEFAULT 20,
  slots_booked INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  special_price NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tour_id, date),
  UNIQUE(service_id, date)
);

ALTER TABLE public.tour_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view availability" ON public.tour_availability
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage availability" ON public.tour_availability
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Photo Reviews
CREATE TABLE public.review_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view review photos" ON public.review_photos
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage review photos" ON public.review_photos
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Wishlist / Price Alerts
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  price_alert BOOLEAN NOT NULL DEFAULT false,
  alert_price NUMERIC(10,2),
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist" ON public.wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to wishlist" ON public.wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlist" ON public.wishlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from wishlist" ON public.wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Review photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('review-photos', 'review-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view review photos storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-photos');

CREATE POLICY "Authenticated users can upload review photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'review-photos' AND auth.role() = 'authenticated');

-- Triggers for updated_at
CREATE TRIGGER update_tour_availability_updated_at
  BEFORE UPDATE ON public.tour_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
