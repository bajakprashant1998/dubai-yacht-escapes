
## Single Booking Type Implementation Plan

### Overview
Two enhancements to the booking features system:
1. Add "Reset to Defaults" button in admin panel
2. Make MobileBookingBar use editable booking features from database

---

### 1. Admin Panel: Reset to Defaults Button

**File: `src/components/admin/TourForm.tsx`**

Add a "Reset to Defaults" button in the Booking Sidebar Features card header that resets all booking_features to their default values.

**Changes:**
- Import `RotateCcw` icon from lucide-react
- Modify the CardHeader to include a reset button alongside the title
- Add handler function to reset booking_features to `defaultBookingFeatures`

**UI Location:**
```text
┌─────────────────────────────────────────────────────────────────┐
│  Booking Sidebar Features            [Reset to Defaults]        │
├─────────────────────────────────────────────────────────────────┤
│  ... existing form fields ...                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. MobileBookingBar: Use Editable Booking Features

**File: `src/components/tour-detail/MobileBookingBar.tsx`**

**Current State:**
The expandable info panel shows hardcoded text:
- "Instant confirmation"
- "Free cancellation up to 24h"  
- "Best price guaranteed"

**Changes:**
1. Import `BookingFeatures` and `defaultBookingFeatures` from tourMapper
2. Add `bookingFeatures?: BookingFeatures` prop with default value
3. Replace hardcoded strings with values from bookingFeatures:
   - Use `bookingFeatures.cancellation_text` instead of "Free cancellation up to 24h"
   - Use `bookingFeatures.charter_features` for private charter features
   - Keep "Instant confirmation" and "Best price guaranteed" as they are (these are standard trust signals, not tour-specific)

**File: `src/pages/TourDetail.tsx`**

Pass the bookingFeatures prop to MobileBookingBar:

```tsx
<MobileBookingBar 
  price={tour.price} 
  originalPrice={tour.originalPrice}
  tourTitle={tour.title}
  tourId={tour.id}
  pricingType={tour.pricingType}
  fullYachtPrice={tour.fullYachtPrice}
  capacity={tour.capacity}
  bookingFeatures={tour.bookingFeatures}  // Add this
/>
```

---

### Summary of File Changes

| File | Change |
|------|--------|
| `src/components/admin/TourForm.tsx` | Add "Reset to Defaults" button with `RotateCcw` icon |
| `src/components/tour-detail/MobileBookingBar.tsx` | Add `bookingFeatures` prop, use dynamic values in expandable panel |
| `src/pages/TourDetail.tsx` | Pass `bookingFeatures` to MobileBookingBar |

---

### Technical Details

**Reset Handler in TourForm:**
```tsx
const resetBookingFeatures = () => {
  setFormData((prev) => ({
    ...prev,
    booking_features: defaultBookingFeatures,
  }));
  toast.success("Booking features reset to defaults");
};
```

**MobileBookingBar Props Update:**
```tsx
interface MobileBookingBarProps {
  price: number;
  originalPrice: number;
  tourTitle?: string;
  tourId?: string;
  pricingType?: "per_person" | "per_hour";
  fullYachtPrice?: number | null;
  capacity?: string;
  bookingFeatures?: BookingFeatures;  // New prop
}
```

**Expandable Panel Content (MobileBookingBar):**
- For charter tours: Show charter_features from bookingFeatures
- Show cancellation_text from bookingFeatures
- Keep static trust signals (Instant confirmation, Best price guaranteed)
