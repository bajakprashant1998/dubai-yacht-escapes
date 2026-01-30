
# Services Feature Enhancement Plan

This plan covers testing the services feature, adding sample data, integrating booking functionality, and generating category images.

---

## Current Status

The services feature infrastructure is complete:
- Database tables (`services`, `service_categories`) created with RLS policies
- 8 service categories exist in the database (Desert Safari, Theme Parks, etc.)
- Bookings table extended with `booking_source` and `service_id` columns
- Frontend pages created (Services listing, ServiceDetail, Admin pages)
- Hooks and data layer implemented

The services table is currently empty, so the listing pages show "No experiences found."

---

## Implementation Plan

### Phase 1: Add Service Booking Modal Integration

Create a new `ServiceBookingModal` component that adapts the existing `BookingModal` for services with different booking types (per_person, per_group, per_vehicle).

**Files to create:**
- `src/components/service-detail/ServiceBookingModal.tsx` - Booking modal adapted for services

**Files to modify:**
- `src/pages/ServiceDetail.tsx` - Add state and button to open booking modal

**Key differences from tour booking:**
| Feature | Tours | Services |
|---------|-------|----------|
| Booking types | per_person, full_yacht | per_person, per_group, per_vehicle |
| Guest counters | Adults, Children, Infants | Varies by booking type |
| Database field | tour_id | service_id |
| Source tracking | 'tour' | 'service' |

---

### Phase 2: Add Sample Services via Database

Insert sample services directly into the database to test the complete flow. Each service will be associated with a category.

**Sample services to add:**

| Title | Category | Price (AED) | Booking Type |
|-------|----------|-------------|--------------|
| Evening Desert Safari with BBQ Dinner | Desert Safari | 250 | per_person |
| Ferrari World Abu Dhabi | Theme Parks | 345 | per_person |
| Burj Khalifa At The Top (Levels 124+125) | Observation Decks | 189 | per_person |
| Jet Ski Adventure | Water Sports | 450 | per_person |
| Dubai City Tour - Half Day | City Tours | 150 | per_person |
| Private Airport Transfer - Sedan | Airport Transfers | 180 | per_vehicle |
| Dinner in the Sky Dubai | Dining Experiences | 699 | per_person |
| Skydiving Dubai | Adventure Sports | 2,199 | per_person |

---

### Phase 3: Generate Category Hero Images

Use AI image generation to create premium hero images for each service category. Images will be generated with a luxury Dubai tourism aesthetic.

**Categories needing images:**
1. Desert Safari - Golden dunes with 4x4 vehicles at sunset
2. Theme Parks - Colorful roller coasters and attractions
3. Observation Decks - Panoramic Dubai skyline view
4. Water Sports - Jet ski or parasailing on blue waters
5. Airport Transfers - Luxury car at Dubai airport
6. City Tours - Dubai landmarks collage
7. Adventure Sports - Skydiving over Palm Jumeirah
8. Dining Experiences - Luxury rooftop dining setup

---

## Technical Details

### ServiceBookingModal Component

```text
Props:
- isOpen: boolean
- onClose: () => void
- service: Service (from useService hook)

Key adaptations:
1. Dynamic guest counter based on bookingType:
   - per_person: Show Adults, Children, Infants
   - per_group: Show single "Group Size" counter
   - per_vehicle: No guest counter, fixed price

2. Price calculation:
   - per_person: price * adults + (price * 0.5 * children)
   - per_group: Fixed price regardless of group size
   - per_vehicle: Fixed price

3. Database insert:
   - booking_source: 'service'
   - service_id: service.id
   - tour_id: service.slug (for backward compatibility)
   - tour_name: service.title
```

### ServiceDetail Page Changes

```text
Add:
1. Import ServiceBookingModal
2. State: const [isBookingOpen, setIsBookingOpen] = useState(false)
3. Update "Check Availability" button to open modal
4. Render ServiceBookingModal at bottom of component
```

### Database Insert for Sample Services

Each service record will include:
- Full details (description, highlights, included/excluded)
- SEO metadata
- Realistic pricing
- Proper category assignment
- Active and featured flags

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/components/service-detail/ServiceBookingModal.tsx` | Create | Booking modal for services |
| `src/pages/ServiceDetail.tsx` | Modify | Integrate booking modal |
| Database migration | Create | Insert sample services |
| `src/hooks/useServices.ts` | Modify | Add booking_source to service bookings (optional) |

---

## Testing Checklist

After implementation:

1. Navigate to `/services` - Should show sample services
2. Navigate to `/dubai/services/desert-safari` - Should show Desert Safari services
3. Click on a service card - Should open service detail page
4. Click "Check Availability" - Should open booking modal
5. Complete booking flow - Should create booking with `booking_source: 'service'`
6. Check `/admin/services` - Should show all services
7. Edit a service via admin - Should update successfully
8. Check `/admin/bookings` - Should show service bookings with proper source

---

## Image Generation Prompts

For AI image generation, each category will use prompts like:

```text
"Luxury desert safari experience in Dubai at golden hour, 
premium 4x4 vehicles on pristine sand dunes, 
dramatic sunset sky, 
cinematic quality, ultra-realistic photography style"
```

Images will be stored in Supabase Storage and URLs updated in the `service_categories` table.
