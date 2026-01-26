
## Replace "per yacht" with "Per Hour" for Private Charter Tours

### Overview
Update the pricing label displayed for private charter tours from "per yacht" to "Per Hour" across all UI components.

---

### Changes Required

| File | Current Text | New Text |
|------|-------------|----------|
| `src/components/TourCard.tsx` (line 113) | `per yacht` | `Per Hour` |
| `src/components/tour-detail/BookingSidebar.tsx` (line 147) | `per yacht (entire charter)` | `Per Hour` |
| `src/components/tour-detail/MobileBookingBar.tsx` (line 40) | `per yacht` | `Per Hour` |

---

### File-by-File Changes

**1. TourCard.tsx**
```tsx
// Line 113
// From:
<p className="text-secondary text-[10px] sm:text-xs font-medium flex items-center gap-1">
  <Ship className="w-3 h-3" />
  per yacht
</p>

// To:
<p className="text-secondary text-[10px] sm:text-xs font-medium flex items-center gap-1">
  <Ship className="w-3 h-3" />
  Per Hour
</p>
```

**2. BookingSidebar.tsx**
```tsx
// Line 147
// From:
<p className="text-muted-foreground text-sm">per yacht (entire charter)</p>

// To:
<p className="text-muted-foreground text-sm">Per Hour</p>
```

**3. MobileBookingBar.tsx**
```tsx
// Lines 39-41
// From:
const priceLabel = isFullYacht 
  ? "per yacht" 
  : (pricingType === "per_hour" ? "per hour" : "per person");

// To:
const priceLabel = isFullYacht 
  ? "Per Hour" 
  : (pricingType === "per_hour" ? "per hour" : "per person");
```

---

### Summary
Simple text replacement in 3 files. No logic changes required - just updating the display label from "per yacht" to "Per Hour" for private charter tours.
