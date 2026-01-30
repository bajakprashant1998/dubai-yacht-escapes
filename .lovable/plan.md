

# Fix: Booking Error When Attempting to Book

## Problem Identified

The booking fails because of a Row Level Security (RLS) policy conflict:

### What's Happening

1. User fills out the booking form and clicks "Confirm Booking"
2. The code attempts to INSERT a booking AND then SELECT it back (`.select().single()`)
3. The INSERT succeeds (there's a valid "Guests can create bookings" policy)
4. The SELECT fails because there's no policy allowing anonymous users to read back their booking

### Root Cause

The SELECT policy "Users can view own bookings" has condition: `auth.uid() = user_id`

For anonymous bookings where `user_id = NULL`:
- `auth.uid()` returns NULL for anonymous users
- `NULL = NULL` evaluates to NULL (not TRUE) in PostgreSQL
- The policy denies the SELECT

---

## Solution

### Option A: Remove the SELECT from INSERT (Recommended)

Modify `BookingModal.tsx` to not require reading the booking back:

| Before | After |
|--------|-------|
| `.insert(bookingData).select().single()` | `.insert(bookingData).select('id')` with error handling |

This approach:
- Removes the `.single()` call that throws on no results
- Only needs the booking ID for the email function
- If select fails, booking still succeeded - just skip email

### Option B: Add RLS Policy for Anonymous SELECT

Add a policy allowing users to read bookings by matching on other criteria (like customer_email), but this is more complex and less secure.

---

## Implementation Details

### File: `src/components/tour-detail/BookingModal.tsx`

**Change the INSERT logic (lines 192-211):**

```text
Current code:
+----------------------------------------------+
| const { data: savedBooking, error } =        |
|   await supabase.from("bookings")            |
|     .insert(bookingData)                     |
|     .select()                                |
|     .single();                               |
+----------------------------------------------+

New code:
+----------------------------------------------+
| const { error: insertError } = await         |
|   supabase.from("bookings")                  |
|     .insert(bookingData);                    |
|                                              |
| if (insertError) {                           |
|   // Handle insert error                     |
| }                                            |
|                                              |
| // Booking succeeded - email is optional     |
+----------------------------------------------+
```

### Key Changes

1. **Remove `.select().single()`** - This is causing the RLS error
2. **Handle INSERT error separately** - Check only for insert failure
3. **Make email sending optional** - Since we can't get the booking ID back reliably for anonymous users
4. **Add alternative email approach** - Either:
   - Skip email for anonymous bookings
   - Use a server-side approach (Edge Function) that has service role access

---

## Alternative: Fix via Database Policy

If email confirmation is critical, add a new SELECT policy:

```sql
CREATE POLICY "Guests can view recently created bookings"
ON bookings
FOR SELECT
TO anon, authenticated
USING (
  customer_email = current_setting('request.headers', true)::json->>'x-customer-email'
  AND created_at > now() - interval '5 seconds'
);
```

This is complex and requires passing custom headers. **Not recommended.**

---

## Recommended Implementation

### Step 1: Update BookingModal.tsx

```text
Changes to handleSubmit function:
+--------------------------------------------------+
| 1. Split insert and select into separate calls   |
| 2. Don't fail if select fails (booking worked)   |
| 3. Make email sending non-blocking              |
| 4. Show success message even without booking ID |
+--------------------------------------------------+
```

### Step 2: Handle Email Gracefully

Since we may not get the booking ID back for anonymous users:
- Option A: Skip confirmation email for non-logged-in users
- Option B: Create an Edge Function that handles email after insert using service role

### Step 3: Consider Adding User Login Prompt

After successful booking, prompt users to create an account to:
- View their booking history
- Receive updates on their booking
- Manage future bookings

---

## Technical Details

### Why `.single()` Fails

```text
PostgreSQL RLS Evaluation:
+-----------------------+------------------------+
| auth.uid()            | NULL (anonymous)       |
| user_id               | NULL (not set)         |
| Policy check:         | NULL = NULL -> NULL    |
| Result:               | DENIED (not TRUE)      |
+-----------------------+------------------------+
```

### Safe Pattern for Anonymous Inserts

```typescript
// Insert without expecting to read back
const { error: insertError } = await supabase
  .from("bookings")
  .insert(bookingData);

if (insertError) {
  throw new Error(insertError.message);
}

// Booking succeeded! Email is a bonus feature.
toast({ 
  title: "Booking submitted!", 
  description: "We'll send confirmation shortly." 
});
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/components/tour-detail/BookingModal.tsx` | Fix INSERT/SELECT logic |

---

## Expected Outcome

After this fix:
- Anonymous users can successfully create bookings
- No more "Unable to create booking" error
- Booking confirmation shows success
- Email notifications work when possible (optional fallback)

