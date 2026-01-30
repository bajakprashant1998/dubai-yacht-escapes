-- Add new columns to services table for enhanced form
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_alt text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS itinerary jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS location text;

-- Create service-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for service-images bucket
CREATE POLICY "Service images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Admins can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update service images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service images"
ON storage.objects FOR DELETE
USING (bucket_id = 'service-images' AND has_role(auth.uid(), 'admin'::app_role));