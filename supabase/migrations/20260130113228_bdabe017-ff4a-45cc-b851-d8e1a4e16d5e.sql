-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (true);

-- Only admins can view subscribers
CREATE POLICY "Admins can view all subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update subscribers
CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_newsletter_subscribers_updated_at
BEFORE UPDATE ON public.newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();