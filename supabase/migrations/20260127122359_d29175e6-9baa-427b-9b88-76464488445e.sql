-- Add seo_slug column to tours table
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS seo_slug TEXT;

-- Create url_redirects table for mapping old URLs to new ones
CREATE TABLE IF NOT EXISTS public.url_redirects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  old_path TEXT NOT NULL UNIQUE,
  new_path TEXT NOT NULL,
  redirect_type INTEGER NOT NULL DEFAULT 301,
  hits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_url_redirects_old_path ON public.url_redirects(old_path);

-- Enable RLS on url_redirects
ALTER TABLE public.url_redirects ENABLE ROW LEVEL SECURITY;

-- Anyone can read redirects (needed for client-side redirect handling)
CREATE POLICY "Anyone can view redirects" 
ON public.url_redirects 
FOR SELECT 
USING (true);

-- Only admins can manage redirects
CREATE POLICY "Admins can manage redirects" 
ON public.url_redirects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_url_redirects_updated_at
BEFORE UPDATE ON public.url_redirects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();