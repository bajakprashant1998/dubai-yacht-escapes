-- Create canned_responses table for quick reply templates
CREATE TABLE public.canned_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  shortcut TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.canned_responses ENABLE ROW LEVEL SECURITY;

-- Only admins can manage canned responses
CREATE POLICY "Admins can manage canned responses"
  ON public.canned_responses
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_canned_responses_updated_at
  BEFORE UPDATE ON public.canned_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default templates
INSERT INTO public.canned_responses (title, content, category, shortcut, sort_order) VALUES
  ('Greeting', 'Hello! Thank you for reaching out to Luxury Dhow Escapes. How can I assist you today?', 'Welcome', '/greet', 1),
  ('Please Wait', 'Please give me a moment while I look into this for you.', 'General', '/wait', 2),
  ('Booking Help', 'I''d be happy to help you with a booking. Could you share your preferred date and number of guests?', 'Booking', '/booking', 3),
  ('Pricing Info', 'Our packages start from AED 149 per person. You can view all our cruise options on our Tours page. Would you like me to recommend something specific?', 'Pricing', '/pricing', 4),
  ('Thank You', 'Thank you for choosing Luxury Dhow Escapes! Have a wonderful day.', 'General', '/thanks', 5),
  ('Offline Message', 'Our team is currently offline. Please leave your contact details and we''ll get back to you shortly.', 'General', '/offline', 6),
  ('Special Requests', 'We can accommodate special requests such as birthday celebrations, anniversaries, and corporate events. Please share your requirements and we''ll create a customized experience for you.', 'Booking', '/special', 7),
  ('Pickup Info', 'We offer complimentary hotel pickup from most Dubai hotels. Just share your hotel name and we''ll confirm the pickup time.', 'General', '/pickup', 8);