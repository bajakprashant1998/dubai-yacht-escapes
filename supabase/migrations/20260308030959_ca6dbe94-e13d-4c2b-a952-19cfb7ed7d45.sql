
-- Review Rewards System
CREATE TABLE public.review_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  review_id uuid REFERENCES public.reviews(id) ON DELETE SET NULL,
  points_earned integer NOT NULL DEFAULT 0,
  reward_type text NOT NULL DEFAULT 'review',
  badge_name text,
  discount_code text,
  discount_value numeric DEFAULT 0,
  is_redeemed boolean DEFAULT false,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.review_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage review rewards" ON public.review_rewards FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view own rewards" ON public.review_rewards FOR SELECT USING (auth.uid() = user_id);

-- Corporate Events Module
CREATE TABLE public.corporate_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  event_type text NOT NULL DEFAULT 'team_building',
  event_date date,
  guests_count integer DEFAULT 10,
  budget_range text,
  requirements text,
  selected_activities uuid[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'inquiry',
  proposal_url text,
  invoice_number text,
  invoice_amount numeric DEFAULT 0,
  invoice_status text DEFAULT 'draft',
  notes text,
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage corporate events" ON public.corporate_events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can submit corporate inquiry" ON public.corporate_events FOR INSERT WITH CHECK (status = 'inquiry');

-- Influencer Portal
CREATE TABLE public.influencer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  social_platform text NOT NULL DEFAULT 'instagram',
  social_handle text NOT NULL,
  followers_count integer DEFAULT 0,
  engagement_rate numeric DEFAULT 0,
  portfolio_url text,
  niche text DEFAULT 'travel',
  bio text,
  status text NOT NULL DEFAULT 'pending',
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.influencer_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid REFERENCES public.influencer_applications(id) ON DELETE CASCADE NOT NULL,
  campaign_name text NOT NULL,
  tour_id uuid,
  service_id uuid,
  booking_date date,
  deliverables jsonb DEFAULT '[]',
  content_links text[] DEFAULT '{}',
  views_count integer DEFAULT 0,
  engagement_count integer DEFAULT 0,
  estimated_reach integer DEFAULT 0,
  roi_value numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.influencer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage influencer applications" ON public.influencer_applications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can apply as influencer" ON public.influencer_applications FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "Admins can manage influencer campaigns" ON public.influencer_campaigns FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
