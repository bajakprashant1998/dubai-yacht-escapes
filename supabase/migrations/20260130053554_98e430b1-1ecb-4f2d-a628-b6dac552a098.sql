-- Create FAQs table for FAQ management
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Admins can manage FAQs
CREATE POLICY "Admins can manage faqs" 
ON public.faqs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view active FAQs
CREATE POLICY "Anyone can view active faqs" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample FAQs
INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('How do I book an experience?', 'You can book directly through our website by selecting your preferred experience and clicking "Book Now". You''ll be asked for your details and payment information.', 'booking', 1),
('What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, American Express) and bank transfers. Payment is secured with 256-bit SSL encryption.', 'payment', 1),
('Can I cancel or modify my booking?', 'Yes, you can cancel or modify your booking up to 24 hours before the scheduled time for a full refund. Please contact our support team for assistance.', 'cancellation', 1),
('Is hotel pickup included?', 'Many of our experiences include complimentary hotel pickup. Check the specific tour details for pickup information.', 'tours', 1),
('What should I bring on a cruise?', 'We recommend bringing sunscreen, comfortable clothing, a camera, and a light jacket for evening cruises. All meals and drinks are typically included.', 'tours', 2),
('How can I contact customer support?', 'You can reach us via WhatsApp, phone, or email. Our support team is available 24/7 to assist you with any questions.', 'contact', 1),
('Are children allowed on tours?', 'Yes, most of our tours are family-friendly. Some experiences may have age restrictions, which are clearly mentioned in the tour details.', 'tours', 3),
('What happens in case of bad weather?', 'Safety is our priority. If weather conditions are unsafe, we''ll reschedule your experience or provide a full refund.', 'cancellation', 2);