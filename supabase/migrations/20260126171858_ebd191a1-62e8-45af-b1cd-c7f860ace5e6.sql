-- Add booking_features JSONB column to tours table for customizable booking sidebar content
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS booking_features jsonb DEFAULT '{
  "urgency_enabled": true,
  "urgency_text": "Only few spots left today!",
  "availability_text": "Available daily",
  "minimum_duration": "Minimum 2 Hours Required",
  "hotel_pickup": true,
  "hotel_pickup_text": "Hotel pickup included",
  "cancellation_text": "Free cancellation (24h)",
  "charter_features": ["Private experience", "Exclusive use"]
}'::jsonb;