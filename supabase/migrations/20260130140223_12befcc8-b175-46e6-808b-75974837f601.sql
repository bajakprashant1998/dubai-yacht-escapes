-- Create combo_packages table
CREATE TABLE public.combo_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  combo_type TEXT NOT NULL DEFAULT 'essentials',
  duration_days INTEGER NOT NULL DEFAULT 1,
  duration_nights INTEGER NOT NULL DEFAULT 0,
  base_price_aed NUMERIC NOT NULL DEFAULT 0,
  discount_percent NUMERIC NOT NULL DEFAULT 0,
  final_price_aed NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  gallery TEXT[] DEFAULT '{}',
  includes_hotel BOOLEAN DEFAULT false,
  hotel_star_rating INTEGER,
  includes_visa BOOLEAN DEFAULT false,
  includes_transport BOOLEAN DEFAULT false,
  transport_type TEXT,
  highlights TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  seasonal_pricing JSONB DEFAULT '[]'::jsonb,
  blackout_dates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create combo_package_items table
CREATE TABLE public.combo_package_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  combo_id UUID NOT NULL REFERENCES public.combo_packages(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL DEFAULT 1,
  item_type TEXT NOT NULL,
  item_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  start_time TEXT,
  end_time TEXT,
  price_aed NUMERIC NOT NULL DEFAULT 0,
  is_mandatory BOOLEAN DEFAULT true,
  is_flexible BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create combo_ai_rules table
CREATE TABLE public.combo_ai_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  combo_id UUID NOT NULL REFERENCES public.combo_packages(id) ON DELETE CASCADE,
  priority INTEGER NOT NULL DEFAULT 0,
  max_discount_percent NUMERIC DEFAULT 25,
  upsell_combos UUID[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.combo_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_ai_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for combo_packages
CREATE POLICY "Anyone can view active combo packages"
ON public.combo_packages
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage combo packages"
ON public.combo_packages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for combo_package_items
CREATE POLICY "Anyone can view combo package items"
ON public.combo_package_items
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage combo package items"
ON public.combo_package_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for combo_ai_rules
CREATE POLICY "Admins can manage combo AI rules"
ON public.combo_ai_rules
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_combo_packages_updated_at
  BEFORE UPDATE ON public.combo_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_combo_ai_rules_updated_at
  BEFORE UPDATE ON public.combo_ai_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_combo_packages_slug ON public.combo_packages(slug);
CREATE INDEX idx_combo_packages_type ON public.combo_packages(combo_type);
CREATE INDEX idx_combo_packages_active ON public.combo_packages(is_active);
CREATE INDEX idx_combo_package_items_combo ON public.combo_package_items(combo_id);
CREATE INDEX idx_combo_package_items_day ON public.combo_package_items(day_number);
CREATE INDEX idx_combo_ai_rules_combo ON public.combo_ai_rules(combo_id);

-- Create storage bucket for combo images
INSERT INTO storage.buckets (id, name, public)
VALUES ('combo-images', 'combo-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for combo-images bucket
CREATE POLICY "Combo images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'combo-images');

CREATE POLICY "Admins can upload combo images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'combo-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update combo images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'combo-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete combo images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'combo-images' AND has_role(auth.uid(), 'admin'::app_role));