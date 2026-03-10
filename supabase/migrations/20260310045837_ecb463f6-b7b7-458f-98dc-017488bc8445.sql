
-- Staff Tasks table
CREATE TABLE public.staff_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID,
  created_by UUID,
  related_entity_type TEXT, -- 'booking', 'corporate_event', 'inquiry', etc.
  related_entity_id UUID,
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all tasks" ON public.staff_tasks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Managers can manage all tasks" ON public.staff_tasks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Staff can view assigned tasks" ON public.staff_tasks FOR SELECT TO authenticated USING (auth.uid() = assigned_to);
CREATE POLICY "Staff can update assigned tasks" ON public.staff_tasks FOR UPDATE TO authenticated USING (auth.uid() = assigned_to);

-- Booking Email Schedule table
CREATE TABLE public.booking_email_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  email_type TEXT NOT NULL, -- 'confirmation', 'reminder', 'review_request', 'follow_up'
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed, cancelled
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_email_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email schedules" ON public.booking_email_schedule FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
