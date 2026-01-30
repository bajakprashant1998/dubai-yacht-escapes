-- ============================================
-- CAR RENTALS SYSTEM
-- ============================================

-- Car Categories Table
CREATE TABLE public.car_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Car Rentals Table
CREATE TABLE public.car_rentals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category_id UUID REFERENCES public.car_categories(id) ON DELETE SET NULL,
  seats INTEGER DEFAULT 5,
  transmission TEXT DEFAULT 'Automatic',
  fuel_type TEXT DEFAULT 'Petrol',
  daily_price NUMERIC NOT NULL,
  weekly_price NUMERIC,
  monthly_price NUMERIC,
  deposit NUMERIC DEFAULT 0,
  driver_available BOOLEAN DEFAULT true,
  self_drive BOOLEAN DEFAULT true,
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  description TEXT,
  long_description TEXT,
  requirements TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- HOTELS SYSTEM
-- ============================================

-- Hotels Table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  star_rating INTEGER DEFAULT 4 CHECK (star_rating >= 1 AND star_rating <= 5),
  category TEXT DEFAULT '4-Star',
  location TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  description TEXT,
  long_description TEXT,
  amenities TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  price_from NUMERIC,
  contact_phone TEXT,
  contact_email TEXT,
  check_in_time TEXT DEFAULT '3:00 PM',
  check_out_time TEXT DEFAULT '12:00 PM',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hotel Rooms Table
CREATE TABLE public.hotel_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  max_guests INTEGER DEFAULT 2,
  beds TEXT DEFAULT '1 King Bed',
  size_sqm NUMERIC,
  price_per_night NUMERIC NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- VISA SERVICES SYSTEM
-- ============================================

-- Visa Services Table
CREATE TABLE public.visa_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  duration_days INTEGER,
  validity TEXT,
  processing_time TEXT DEFAULT '2-3 business days',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  description TEXT,
  long_description TEXT,
  requirements TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  faqs JSONB DEFAULT '[]',
  image_url TEXT,
  is_express BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- BLOG SYSTEM
-- ============================================

-- Blog Categories Table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog Tags Table
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog Posts Table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  reading_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.car_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - CAR RENTALS
-- ============================================

CREATE POLICY "Anyone can view active car categories"
  ON public.car_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage car categories"
  ON public.car_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active car rentals"
  ON public.car_rentals FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage car rentals"
  ON public.car_rentals FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - HOTELS
-- ============================================

CREATE POLICY "Anyone can view active hotels"
  ON public.hotels FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage hotels"
  ON public.hotels FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view available hotel rooms"
  ON public.hotel_rooms FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins can manage hotel rooms"
  ON public.hotel_rooms FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - VISA SERVICES
-- ============================================

CREATE POLICY "Anyone can view active visa services"
  ON public.visa_services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage visa services"
  ON public.visa_services FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- RLS POLICIES - BLOG
-- ============================================

CREATE POLICY "Anyone can view active blog categories"
  ON public.blog_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage blog categories"
  ON public.blog_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view blog tags"
  ON public.blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blog tags"
  ON public.blog_tags FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE TRIGGER update_car_categories_updated_at
  BEFORE UPDATE ON public.car_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_car_rentals_updated_at
  BEFORE UPDATE ON public.car_rentals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON public.hotels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotel_rooms_updated_at
  BEFORE UPDATE ON public.hotel_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visa_services_updated_at
  BEFORE UPDATE ON public.visa_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('hotel-images', 'hotel-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('visa-images', 'visa-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies for public read access
CREATE POLICY "Public car images access" ON storage.objects FOR SELECT USING (bucket_id = 'car-images');
CREATE POLICY "Admin car images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin car images update" ON storage.objects FOR UPDATE USING (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin car images delete" ON storage.objects FOR DELETE USING (bucket_id = 'car-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Public hotel images access" ON storage.objects FOR SELECT USING (bucket_id = 'hotel-images');
CREATE POLICY "Admin hotel images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'hotel-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin hotel images update" ON storage.objects FOR UPDATE USING (bucket_id = 'hotel-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin hotel images delete" ON storage.objects FOR DELETE USING (bucket_id = 'hotel-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Public visa images access" ON storage.objects FOR SELECT USING (bucket_id = 'visa-images');
CREATE POLICY "Admin visa images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'visa-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin visa images update" ON storage.objects FOR UPDATE USING (bucket_id = 'visa-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin visa images delete" ON storage.objects FOR DELETE USING (bucket_id = 'visa-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Public blog images access" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Admin blog images upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin blog images update" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin blog images delete" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'));

-- ============================================
-- SAMPLE DATA - CAR CATEGORIES
-- ============================================

INSERT INTO public.car_categories (name, slug, description, sort_order) VALUES
  ('Economy', 'economy', 'Budget-friendly cars perfect for city driving', 1),
  ('Sedan', 'sedan', 'Comfortable sedans for business and leisure', 2),
  ('SUV', 'suv', 'Spacious SUVs for family trips and adventures', 3),
  ('Luxury', 'luxury', 'Premium luxury vehicles for executive travel', 4),
  ('Supercar', 'supercar', 'Exotic supercars for the ultimate driving experience', 5);

-- ============================================
-- SAMPLE DATA - BLOG CATEGORIES
-- ============================================

INSERT INTO public.blog_categories (name, slug, description, sort_order) VALUES
  ('Dubai Travel Guides', 'travel-guides', 'Comprehensive guides for exploring Dubai', 1),
  ('Best Time to Visit', 'best-time-to-visit', 'Seasonal guides and weather tips', 2),
  ('Top Attractions', 'top-attractions', 'Must-visit places and experiences in Dubai', 3),
  ('Visa & Travel Tips', 'visa-travel-tips', 'Essential visa and travel information', 4);

-- ============================================
-- SAMPLE DATA - BLOG TAGS
-- ============================================

INSERT INTO public.blog_tags (name, slug) VALUES
  ('Dubai', 'dubai'),
  ('Travel Tips', 'travel-tips'),
  ('Visa', 'visa'),
  ('Hotels', 'hotels'),
  ('Desert Safari', 'desert-safari'),
  ('Burj Khalifa', 'burj-khalifa'),
  ('Shopping', 'shopping'),
  ('Food', 'food');