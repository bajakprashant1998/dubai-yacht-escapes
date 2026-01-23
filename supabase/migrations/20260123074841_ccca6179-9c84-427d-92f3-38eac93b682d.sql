-- Create storage bucket for tour images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tour-images', 'tour-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view tour images (public bucket)
CREATE POLICY "Anyone can view tour images"
ON storage.objects FOR SELECT
USING (bucket_id = 'tour-images');

-- Allow admins to upload tour images
CREATE POLICY "Admins can upload tour images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tour-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update tour images
CREATE POLICY "Admins can update tour images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tour-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete tour images
CREATE POLICY "Admins can delete tour images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tour-images' 
  AND has_role(auth.uid(), 'admin'::app_role)
);