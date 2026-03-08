
-- Refund requests table
CREATE TABLE public.refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  reason text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  refund_type text NOT NULL DEFAULT 'full',
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  approved_by uuid,
  approved_at timestamptz,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage refund requests"
  ON public.refund_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own refund requests"
  ON public.refund_requests FOR SELECT
  USING (customer_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

CREATE POLICY "Anyone can submit refund request"
  ON public.refund_requests FOR INSERT
  WITH CHECK (status = 'pending');
