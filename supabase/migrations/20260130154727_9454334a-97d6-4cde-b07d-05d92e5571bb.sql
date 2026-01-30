-- Create combo package types table for dynamic management
CREATE TABLE IF NOT EXISTS public.combo_package_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'sparkles',
  color TEXT DEFAULT 'bg-secondary',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.combo_package_types ENABLE ROW LEVEL SECURITY;

-- Public read policy for active types
CREATE POLICY "Anyone can view active combo package types" 
ON public.combo_package_types 
FOR SELECT 
USING (is_active = true);

-- Admin write policy
CREATE POLICY "Admins can manage combo package types" 
ON public.combo_package_types 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial data
INSERT INTO public.combo_package_types (slug, name, icon, color, sort_order) VALUES
  ('essentials', 'Essentials', 'sparkles', 'bg-secondary', 1),
  ('family', 'Family', 'users', 'bg-green-500', 2),
  ('couple', 'Romantic', 'heart', 'bg-pink-500', 3),
  ('adventure', 'Adventure', 'mountain', 'bg-orange-500', 4),
  ('luxury', 'Luxury', 'crown', 'bg-amber-500', 5)
ON CONFLICT (slug) DO NOTHING;

-- Add updated_at trigger
CREATE TRIGGER update_combo_package_types_updated_at
BEFORE UPDATE ON public.combo_package_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();