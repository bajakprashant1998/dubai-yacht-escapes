
# Home Page Overhaul & Booking Verification Plan

## Overview
Four interconnected tasks: fix mobile layout stability, replace hero background with the uploaded image, add an Activities section, and verify booking flows.

---

## 1. Fix Mobile Layout Stability

**Root cause**: The hero section uses `overflow-visible` combined with absolutely positioned category cards at `bottom: -80px`, plus parallax transforms (`useScroll`/`useTransform`) that shift content during scroll. On mobile, this creates layout jumping.

**Changes to `src/components/home/HeroSection.tsx`:**
- Change the section from `overflow-visible` to `overflow-hidden` (the overlapping cards will move outside the hero)
- Remove the parallax `useScroll`/`useTransform` on mobile -- these cause the shifting. Use `style={{ y: backgroundY }}` only on larger screens, or remove parallax entirely for a stable experience
- Remove the Ken Burns `scale` animation on the background image (infinite scale 1.1 to 1 causes repaints and jank on mobile)

**Changes to `src/pages/Home.tsx`:**
- Move the category quick cards OUT of HeroSection into Home.tsx as a standalone component rendered after the hero, removing the absolute positioning hack and the spacer div `pt-32`
- This eliminates the overflow/positioning conflict entirely

## 2. Replace Hero Background with Uploaded Image

**Changes to `src/components/home/HeroSection.tsx`:**
- Copy the uploaded image to `src/assets/hero-dubai-skyline.png`
- Remove all video-related code: the `<video>` element, `videoRef`, `videoLoaded`, `videoError`, `prefersReducedMotion`, the IntersectionObserver for video, and the `showVideo` logic
- Remove imports for `useRef` (if no longer needed), video-related state
- Replace the background with a single static `<img>` tag using the new uploaded image, with `object-cover` and a subtle CSS-only zoom animation (using Tailwind `animate-` or a simple framer-motion scale from 1 to 1.03 over 20s, non-repeating)
- Keep the gradient overlays and floating light particles (they are lightweight)

## 3. Add "Activities" Section (6 Cards)

**New component: `src/components/home/PopularActivities.tsx`**

A section with 6 activity cards using existing category images from `src/assets/services/`. Layout:
- Section header with badge ("Top Activities") and title "Popular Activities"
- Grid: `grid-cols-2 sm:grid-cols-3` for 6 cards in a clean 2x3 / 3x2 layout
- Each card: image background, gradient overlay, icon, title, short description, and a "From AED X" price tag
- Cards link to `/experiences?category={slug}`
- Activities: Desert Safari, Theme Parks, Water Sports, Dhow Cruises, City Tours, Adventure Sports
- Uses existing imported images (desert-safari.jpg, theme-parks.jpg, etc.)
- Framer Motion staggered entrance animations
- Consistent with the luxury card style: `rounded-2xl`, `hover:-translate-y-1`, `shadow-lg`

**Changes to `src/pages/Home.tsx`:**
- Import and add `PopularActivities` between `QuickServices` and `PopularDestinations`

## 4. Verify Booking Flows

Based on code review, the booking components (`BookingModal`, `ServiceBookingModal`, `CheckoutModal`, `CarBookingModal`) all properly:
- Insert into the `bookings` table with correct fields
- Have controlled calendar auto-close (already fixed)
- Show toast notifications on success/failure

**One issue found**: `HeroSearchBar` navigates to `/services?q=...` on search but the services page route is `/experiences` based on the category card links. This mismatch means the hero search may not work correctly. Fix: update the search navigation to `/experiences?q=...`.

**Additional check**: The `ComboBookingCard` component should be verified to ensure it passes correct data to `CheckoutModal`.

---

## Technical Details

### Files to create (1 file):
1. `src/components/home/PopularActivities.tsx` -- new Activities section with 6 cards

### Files to modify (3 files):
1. `src/components/home/HeroSection.tsx` -- remove video, use uploaded image, remove parallax, extract category cards
2. `src/pages/Home.tsx` -- add PopularActivities, restructure category cards placement, remove spacer div
3. `src/components/home/HeroSearchBar.tsx` -- fix search navigation path from `/services` to `/experiences`

### Asset to copy:
- `user-uploads://Gemini_Generated_Image_pvc7ltpvc7ltpvc7.png` to `src/assets/hero-dubai-skyline.png`

### No new dependencies required
All changes use existing Framer Motion, Tailwind, Lucide icons, and local image assets.
