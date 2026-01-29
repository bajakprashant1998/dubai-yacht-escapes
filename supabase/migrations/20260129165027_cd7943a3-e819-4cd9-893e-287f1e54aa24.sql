-- Create service_categories table
CREATE TABLE public.service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'folder',
  image_url text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  description text,
  long_description text,
  price numeric NOT NULL,
  original_price numeric,
  duration text,
  image_url text,
  gallery text[],
  category_id uuid REFERENCES public.service_categories(id) ON DELETE SET NULL,
  highlights text[],
  included text[],
  excluded text[],
  meeting_point text,
  rating numeric DEFAULT 4.5,
  review_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  booking_type text DEFAULT 'per_person',
  min_participants integer DEFAULT 1,
  max_participants integer,
  cancellation_policy text DEFAULT 'Free cancellation up to 24 hours before',
  instant_confirmation boolean DEFAULT true,
  hotel_pickup boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_categories
CREATE POLICY "Anyone can view active service categories"
ON public.service_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage service categories"
ON public.service_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for services
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at triggers
CREATE TRIGGER update_service_categories_updated_at
  BEFORE UPDATE ON public.service_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Extend bookings table for unified booking system
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS booking_source text DEFAULT 'tour',
ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES public.services(id) ON DELETE SET NULL;

-- Insert initial service categories
INSERT INTO public.service_categories (name, slug, icon, description, sort_order) VALUES
('Desert Safari', 'desert-safari', 'sun', 'Experience the magic of the Arabian desert with thrilling adventures and cultural experiences', 1),
('Theme Parks', 'theme-parks', 'ferris-wheel', 'World-class theme parks and entertainment destinations in Dubai', 2),
('Observation Decks', 'observation-decks', 'binoculars', 'Breathtaking views from Dubai''s iconic observation points', 3),
('Water Sports', 'water-sports', 'waves', 'Exciting water activities and adventures in Dubai', 4),
('Airport Transfers', 'airport-transfers', 'plane', 'Comfortable and reliable airport transfer services', 5),
('City Tours', 'city-tours', 'map-pin', 'Explore Dubai''s landmarks and hidden gems with guided tours', 6),
('Adventure Sports', 'adventure-sports', 'mountain', 'Adrenaline-pumping adventure activities in Dubai', 7),
('Dining Experiences', 'dining-experiences', 'utensils', 'Unique culinary experiences and fine dining in Dubai', 8);