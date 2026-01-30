-- =====================================================
-- AI TRIP PLANNER DATABASE SCHEMA
-- =====================================================

-- 1. TRIP PLANS - Main itinerary storage
CREATE TABLE public.trip_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'booked', 'cancelled')),
  destination TEXT NOT NULL DEFAULT 'Dubai',
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  total_days INTEGER GENERATED ALWAYS AS (departure_date - arrival_date + 1) STORED,
  travelers_adults INTEGER NOT NULL DEFAULT 1,
  travelers_children INTEGER NOT NULL DEFAULT 0,
  nationality TEXT NOT NULL,
  budget_tier TEXT NOT NULL DEFAULT 'medium' CHECK (budget_tier IN ('low', 'medium', 'luxury')),
  travel_style TEXT NOT NULL DEFAULT 'relax' CHECK (travel_style IN ('family', 'couple', 'adventure', 'relax', 'luxury')),
  special_occasion TEXT DEFAULT 'none' CHECK (special_occasion IN ('birthday', 'honeymoon', 'anniversary', 'none')),
  hotel_preference TEXT,
  total_price_aed NUMERIC DEFAULT 0,
  display_currency TEXT DEFAULT 'AED',
  display_price NUMERIC DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. TRIP ITEMS - Individual items in a trip
CREATE TABLE public.trip_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trip_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('hotel', 'car', 'activity', 'visa', 'transfer', 'upsell', 'tour')),
  item_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIME,
  end_time TIME,
  price_aed NUMERIC NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  is_included BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. VISA NATIONALITY RULES - Visa requirements by country
CREATE TABLE public.visa_nationality_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  visa_required BOOLEAN NOT NULL DEFAULT true,
  visa_on_arrival BOOLEAN NOT NULL DEFAULT false,
  recommended_visa_id UUID REFERENCES public.visa_services(id) ON DELETE SET NULL,
  notes TEXT,
  documents_required TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. CURRENCY RATES - Exchange rate management
CREATE TABLE public.currency_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_code TEXT NOT NULL UNIQUE,
  currency_name TEXT NOT NULL,
  currency_symbol TEXT NOT NULL DEFAULT '$',
  rate_to_aed NUMERIC NOT NULL DEFAULT 1,
  margin_percent NUMERIC NOT NULL DEFAULT 2,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. AI TRIP CONFIG - Admin AI behavior controls
CREATE TABLE public.ai_trip_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_trip_plans_visitor_id ON public.trip_plans(visitor_id);
CREATE INDEX idx_trip_plans_user_id ON public.trip_plans(user_id);
CREATE INDEX idx_trip_plans_status ON public.trip_plans(status);
CREATE INDEX idx_trip_plans_created_at ON public.trip_plans(created_at DESC);
CREATE INDEX idx_trip_items_trip_id ON public.trip_items(trip_id);
CREATE INDEX idx_trip_items_day_number ON public.trip_items(day_number);
CREATE INDEX idx_visa_rules_country_code ON public.visa_nationality_rules(country_code);
CREATE INDEX idx_currency_rates_code ON public.currency_rates(currency_code);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.trip_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_nationality_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_trip_config ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - TRIP PLANS
-- =====================================================

-- Anyone can create trip plans (visitors generate trips)
CREATE POLICY "Anyone can create trip plans"
ON public.trip_plans
FOR INSERT
WITH CHECK (true);

-- Anyone can view their own trip plans by visitor_id
CREATE POLICY "Anyone can view own trip plans"
ON public.trip_plans
FOR SELECT
USING (true);

-- Anyone can update their own trip plans
CREATE POLICY "Anyone can update own trip plans"
ON public.trip_plans
FOR UPDATE
USING (true);

-- Admins can manage all trip plans
CREATE POLICY "Admins can manage all trip plans"
ON public.trip_plans
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- RLS POLICIES - TRIP ITEMS
-- =====================================================

-- Anyone can create trip items
CREATE POLICY "Anyone can create trip items"
ON public.trip_items
FOR INSERT
WITH CHECK (true);

-- Anyone can view trip items
CREATE POLICY "Anyone can view trip items"
ON public.trip_items
FOR SELECT
USING (true);

-- Anyone can update trip items
CREATE POLICY "Anyone can update trip items"
ON public.trip_items
FOR UPDATE
USING (true);

-- Anyone can delete trip items
CREATE POLICY "Anyone can delete trip items"
ON public.trip_items
FOR DELETE
USING (true);

-- Admins can manage all trip items
CREATE POLICY "Admins can manage all trip items"
ON public.trip_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- RLS POLICIES - VISA NATIONALITY RULES
-- =====================================================

-- Anyone can view active visa rules
CREATE POLICY "Anyone can view active visa rules"
ON public.visa_nationality_rules
FOR SELECT
USING (is_active = true);

-- Admins can manage visa rules
CREATE POLICY "Admins can manage visa rules"
ON public.visa_nationality_rules
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- RLS POLICIES - CURRENCY RATES
-- =====================================================

-- Anyone can view enabled currencies
CREATE POLICY "Anyone can view enabled currencies"
ON public.currency_rates
FOR SELECT
USING (is_enabled = true);

-- Admins can manage currency rates
CREATE POLICY "Admins can manage currency rates"
ON public.currency_rates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- RLS POLICIES - AI TRIP CONFIG
-- =====================================================

-- Anyone can view AI config (needed for frontend)
CREATE POLICY "Anyone can view AI config"
ON public.ai_trip_config
FOR SELECT
USING (true);

-- Admins can manage AI config
CREATE POLICY "Admins can manage AI config"
ON public.ai_trip_config
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_trip_plans_updated_at
BEFORE UPDATE ON public.trip_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visa_nationality_rules_updated_at
BEFORE UPDATE ON public.visa_nationality_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_currency_rates_updated_at
BEFORE UPDATE ON public.currency_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_trip_config_updated_at
BEFORE UPDATE ON public.ai_trip_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ENABLE REALTIME FOR TRIP PLANS
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_items;