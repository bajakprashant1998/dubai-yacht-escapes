
# Platform Restructure Plan

## Overview

This plan restructures the website from a "yacht/cruise-focused" platform to a **complete Dubai services marketplace** covering activities, cars, cabs, airplanes, yachts, visas, and end-to-end services. Yachts and cruises will be integrated into the **Activities** (renamed from "Experiences") section rather than having a separate section.

---

## Current vs Proposed Structure

| Current | Proposed |
|---------|----------|
| Cruises (separate page & nav) | Remove - merge into Activities |
| Experiences (services) | Rename to "Activities" |
| Tours (yacht categories) | Keep for yacht/cruise items as subcategory |
| Separate yacht dropdown | Move yacht options under Activities |

---

## Changes Summary

### 1. Navigation Updates

**Header Navigation (`src/components/layout/Header.tsx`)**

Current navLinks:
- Home, Cruises, Experiences, Gallery, About Us, Contact

Proposed navLinks:
- Home, **Activities** (with dropdown including yachts), Gallery, About Us, Contact

The Activities dropdown will include:
- Desert Safari
- Theme Parks  
- Water Sports
- City Tours
- **Sightseeing Cruises** (includes dhow cruises, yachts)
- Adventure Sports
- And more...

Remove the separate `tourCategories` array and merge cruise categories into `experienceCategories`.

**Footer (`src/components/layout/Footer.tsx`)**

- Change "Cruises" link to "Activities"
- Update "Our Tours" section to show activity categories instead of yacht-specific links
- Rename section from "Our Tours" to "Popular Activities"

---

### 2. Remove/Redirect Cruises Page

**Option A (Recommended): Keep page but redirect**
- Keep `src/pages/Cruises.tsx` but update it to be a filtered view of the "Sightseeing Cruises" category
- Or redirect `/cruises` to `/dubai/services/sightseeing-cruises`

**Option B: Remove entirely**
- Delete `src/pages/Cruises.tsx`
- Update routes in `App.tsx`

**Recommended**: Keep the page but rename to "Sightseeing Cruises" and make it a subcategory landing page under Activities.

---

### 3. Experiences Page Rename

**File: `src/pages/Experiences.tsx`**

- Keep the page but update terminology from "Experiences" to "Activities" where appropriate
- The "Sightseeing Cruises" category already exists and includes dhow cruises, yacht tours, etc.
- No structural changes needed - just terminology updates in hero and headings

---

### 4. Home Page Updates

**File: `src/components/home/ExperienceCategories.tsx`**

Current structure shows 4 cruise types + 4 activity types. Update to:
- Show 8 activity categories (including Sightseeing Cruises as one category)
- Remove separate yacht/cruise categories (Dhow, Shared Yacht, Private Charter, Megayacht)
- Replace with: Desert Safari, Theme Parks, Water Sports, City Tours, Sightseeing Cruises, Adventure Sports, Observation Decks, Dining Experiences

---

### 5. Admin Panel Updates

**File: `src/components/admin/AdminSidebar.tsx`**

Current structure:
```
- Tours (with submenu)
- Services (with submenu)
```

Proposed structure (rename "Services" to "Activities"):
```
- Activities (was Services)
  - All Activities
  - Add Activity
  - Categories
- Tours (keep for legacy/cruise data if any)
```

Or consolidate to single "Activities" section if tours table isn't needed.

**File: `src/components/admin/CommandPalette.tsx`**

Update navigation items:
- Change "All Tours" to "All Activities" 
- Update paths from `/admin/tours` to `/admin/activities` (or keep paths, just rename labels)
- Update action items

**File: `src/components/admin/MobileBottomNav.tsx`**
- No changes needed (dashboard-level nav)

---

### 6. Route Updates

**File: `src/App.tsx`**

| Current Route | Action |
|---------------|--------|
| `/cruises` | Redirect to `/dubai/services/sightseeing-cruises` or keep as alias |
| `/experiences` | Keep - this is the main Activities landing page |
| `/tours` | Keep for backwards compatibility |

Add redirect:
```typescript
<Route path="/cruises" element={<Navigate to="/dubai/services/sightseeing-cruises" replace />} />
```

Or keep Cruises.tsx and update it to pull from services with category="sightseeing-cruises".

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/Header.tsx` | Remove "Cruises" nav, rename "Experiences" to "Activities", merge yacht categories into experienceCategories |
| `src/components/layout/Footer.tsx` | Update Quick Links (Cruises → Activities), rename "Our Tours" to "Popular Activities" |
| `src/components/home/ExperienceCategories.tsx` | Replace 4 yacht categories with activity categories |
| `src/components/admin/AdminSidebar.tsx` | Rename "Services" to "Activities" |
| `src/components/admin/CommandPalette.tsx` | Update labels and keywords |
| `src/pages/Experiences.tsx` | Minor text updates (optional) |
| `src/App.tsx` | Add redirect from `/cruises` to sightseeing cruises category |

### Files to Potentially Remove/Redirect

| File | Action |
|------|--------|
| `src/pages/Cruises.tsx` | Either redirect to category page OR repurpose as sightseeing cruises landing |

---

## Database Considerations

No database changes required. The current structure already supports this:
- `services` table contains all activities including yachts/cruises
- `service_categories` table has "sightseeing-cruises" category
- Yacht/cruise services can be added to the "sightseeing-cruises" category

---

## Summary of Visible Changes

### For Users:
1. "Cruises" removed from main navigation
2. "Experiences" renamed to "Activities" 
3. Dhow cruises, yachts, etc. accessible under Activities > Sightseeing Cruises
4. Cleaner navigation focusing on the full marketplace

### For Admins:
1. "Services" renamed to "Activities" in sidebar
2. Command palette updated with new labels
3. Same CRUD functionality, just renamed

---

## Implementation Order

1. **Header.tsx** - Update navigation links and dropdowns
2. **Footer.tsx** - Update links and section names  
3. **ExperienceCategories.tsx** - Update category grid
4. **AdminSidebar.tsx** - Rename Services to Activities
5. **CommandPalette.tsx** - Update labels
6. **App.tsx** - Add redirect for /cruises
7. **Cruises.tsx** - Redirect or repurpose
8. Test all navigation flows
