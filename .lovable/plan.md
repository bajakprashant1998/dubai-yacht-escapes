
# Booking Flow Fix & Task Status

## Current Status

There are no pending tasks tracked in the system. All previously planned work (hero overhaul, mobile stability, ValuePillars enhancement, HowItWorks cleanup, calendar auto-close) has been completed.

## Booking Flow Bug Found

Two out of four booking modals have a critical bug that causes bookings to fail for guest (non-authenticated) users:

### Root Cause
The database has RLS (Row Level Security) policies that only allow SELECT on the `bookings` table for admins or the booking owner (`auth.uid() = user_id`). When a guest user (not logged in) submits a booking, the INSERT succeeds, but if the code chains `.select().single()` after the insert, the subsequent SELECT fails with a permission error because there is no authenticated user.

### Affected Components

| Component | File | Issue | Status |
|-----------|------|-------|--------|
| BookingModal (Tours) | `src/components/tour-detail/BookingModal.tsx` | Uses `.insert()` only (no `.select()`) | Working |
| ServiceBookingModal | `src/components/service-detail/ServiceBookingModal.tsx` | Uses `.insert().select().single()` on line 198 | **BROKEN** |
| CheckoutModal (Combos) | `src/components/checkout/CheckoutModal.tsx` | Uses `.insert().select().single()` on lines 121-140 | **BROKEN** |
| CarBookingModal | `src/components/car-rentals/CarBookingModal.tsx` | Uses WhatsApp redirect, no DB insert | Working (different flow) |

### The Fix

**File: `src/components/service-detail/ServiceBookingModal.tsx`** (line 198)
- Change: `await supabase.from("bookings").insert(bookingData).select().single()` 
- To: `await supabase.from("bookings").insert(bookingData)` 
- Remove the `savedBooking` variable and the email-sending block that depends on it (lines 209-217), since we cannot retrieve the booking ID without SELECT permission
- This matches the pattern already used in BookingModal

**File: `src/components/checkout/CheckoutModal.tsx`** (lines 121-140)
- Change: `await supabase.from("bookings").insert({...}).select().single()`
- To: `await supabase.from("bookings").insert({...})`
- Remove the `setBookingId(data.id)` line since `data` will no longer be returned
- Keep the success step (step 4) but remove the booking ID display since it is unavailable
- Show a generic "We'll email your confirmation" message instead

## Technical Details

### Files to modify (2 files):
1. `src/components/service-detail/ServiceBookingModal.tsx` -- Remove `.select().single()` from insert query and remove email-sending block
2. `src/components/checkout/CheckoutModal.tsx` -- Remove `.select().single()` from insert query, remove booking ID display from confirmation step

### No new dependencies or database changes required
The RLS policies are correct as-is. The fix is purely in the frontend query pattern.
