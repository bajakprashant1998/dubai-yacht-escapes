
# Enhancement & Bug Fix Plan

## Overview
This plan covers 4 areas: enhancing the "Built for Exceptional Experiences" (ValuePillars) section, removing the timeline connector line behind cards in "How It Works", fixing remaining calendar auto-close bugs, and general quality checks.

## 1. Enhance "Built for Exceptional Experiences" (ValuePillars)

The current section uses emoji placeholders (desert, phone, chat bubble) in the right-side visual card. This will be upgraded to a more polished, professional look.

**Changes to `src/components/home/ValuePillars.tsx`:**
- Replace emoji-based visuals with richer illustrated content: use gradient icon containers instead of raw emoji, add a secondary floating stat card, and a subtle animated progress bar or rating stars visual
- Improve the right-side card layout with a more structured visual hierarchy -- larger gradient icon instead of emoji, better stat card arrangement, and a testimonial-style micro-quote floating element
- Add a subtle shimmer/gradient animation to the active stat card
- Improve mobile layout so the right visual stacks cleanly below the content

## 2. Remove Background Timeline Line in "How It Works"

The horizontal timeline connector line (lines 71-82 in HowItWorks.tsx) runs behind the cards on desktop. This will be removed entirely.

**Changes to `src/components/home/HowItWorks.tsx`:**
- Remove the entire timeline connector `div` block (the `hidden md:block absolute top-1/2` element with the animated gradient line)
- Keep the mobile arrow connectors between cards as they are

## 3. Fix Calendar Auto-Close (Remaining Instances)

Two components still have calendars that stay open after date selection:

**`src/components/car-rentals/CarBookingModal.tsx`:**
- Add controlled `open`/`setOpen` state for both pickup and return date Popovers
- Close popover on date selection by wrapping `onSelect` to call `setOpen(false)` after setting the date

**`src/components/checkout/CheckoutModal.tsx`:**
- Add controlled `open`/`setOpen` state for the booking date Popover
- Close popover on date selection

## 4. Bug Fixes Summary

- **CarBookingModal calendar stays open** -- fixed as described above
- **CheckoutModal calendar stays open** -- fixed as described above
- **No console errors** detected -- clean
- **No network errors** detected -- clean
- All other calendar instances (BookingModal, ServiceBookingModal, BookingSidebar, TripPlanner) already have controlled auto-close -- confirmed working

---

## Technical Details

### Files to modify (4 files):
1. `src/components/home/ValuePillars.tsx` -- visual enhancement of right-side card
2. `src/components/home/HowItWorks.tsx` -- remove timeline connector line (lines 70-82)
3. `src/components/car-rentals/CarBookingModal.tsx` -- add calendar auto-close
4. `src/components/checkout/CheckoutModal.tsx` -- add calendar auto-close

### No new dependencies required
All changes use existing Framer Motion, Tailwind, Lucide, and Radix Popover patterns already in the codebase.
