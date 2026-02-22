
-- 1. Promotional Banners table
CREATE TABLE public.promotional_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  link_url text,
  link_text text DEFAULT 'Learn More',
  bg_color text DEFAULT '#1a1a2e',
  text_color text DEFAULT '#ffffff',
  position text DEFAULT 'homepage_top',
  starts_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage banners" ON public.promotional_banners
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active banners" ON public.promotional_banners
  FOR SELECT USING (
    is_active = true 
    AND (starts_at IS NULL OR starts_at <= now()) 
    AND (expires_at IS NULL OR expires_at > now())
  );

-- 2. Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  link_url text,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Timestamps trigger for banners
CREATE TRIGGER update_promotional_banners_updated_at
  BEFORE UPDATE ON public.promotional_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
