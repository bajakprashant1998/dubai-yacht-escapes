

## Plan: Lead Capture Form for AI Trip Planner + Admin Leads Management

### 1. Create `trip_leads` database table
New table to store lead submissions before trip generation:
- `id`, `name`, `email`, `phone` (optional), `travel_date` (optional), `notes` (optional)
- `trip_id` (nullable, linked after generation)
- `status` (default: 'new')
- `created_at`
- RLS: public INSERT, admin-only SELECT/UPDATE/DELETE

### 2. Add lead capture gate to TripPlanner page
- New state `leadCaptured` (default false) + `leadData` in `TripPlanner.tsx`
- Before the wizard renders, show a lead form (name*, email*, phone, travel date)
- On submit, insert into `trip_leads`, store the lead ID in state
- Only then show the 5-step wizard
- After trip generation, update the `trip_leads` row with the `trip_id`

### 3. Add Leads tab to Admin AI Trips dashboard
Update `AITripDashboard.tsx`:
- Add a **Tabs** component with "Trip Plans" and "Leads" tabs
- **Leads tab**: table showing name, email, phone, travel date, status, submitted date
- **Delete button** per row with confirmation dialog
- **Bulk select + delete** support
- **Download CSV** button to export all leads
- Lead count stat card added to the overview

### Technical Details

**Migration SQL:**
```sql
CREATE TABLE public.trip_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  travel_date date,
  notes text,
  trip_id uuid,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_leads ENABLE ROW LEVEL SECURITY;

-- Public can submit leads
CREATE POLICY "Anyone can create trip leads" ON public.trip_leads
  FOR INSERT WITH CHECK (true);

-- Admins can manage all leads
CREATE POLICY "Admins can manage trip leads" ON public.trip_leads
  FOR ALL USING (has_role(auth.uid(), 'admin'));
```

**Files to modify:**
- `src/pages/TripPlanner.tsx` — add lead form gate before wizard
- `src/pages/admin/AITripDashboard.tsx` — add Leads tab with table, delete, CSV export

