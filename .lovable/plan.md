
# Combo Tour Package Feature - Implementation Plan

## Overview

This plan implements a comprehensive **Dubai Combo Tour Packages** feature that allows customers to book pre-made bundled packages or customize them using the AI Trip Planner. The feature includes both customer-facing pages and admin management tools.

---

## Database Schema

### New Tables

#### 1. `combo_packages` - Main combo package definition
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Combo name (e.g., "Dubai Essentials") |
| slug | text | URL-friendly slug |
| description | text | Short description |
| long_description | text | Detailed description |
| combo_type | text | family / couple / adventure / luxury / essentials |
| duration_days | integer | Number of days |
| duration_nights | integer | Number of nights |
| base_price_aed | numeric | Base price before discount |
| discount_percent | numeric | Discount percentage (e.g., 20) |
| final_price_aed | numeric | Calculated final price |
| image_url | text | Main image |
| gallery | text[] | Gallery images |
| includes_hotel | boolean | Whether hotel is included |
| hotel_star_rating | integer | Star rating if hotel included |
| includes_visa | boolean | Whether visa is included |
| includes_transport | boolean | Whether transport is included |
| transport_type | text | sedan / suv / van |
| highlights | text[] | Package highlights |
| is_featured | boolean | Featured on homepage |
| is_active | boolean | Active status |
| sort_order | integer | Display order |
| meta_title | text | SEO title |
| meta_description | text | SEO description |
| seasonal_pricing | jsonb | Seasonal price adjustments |
| blackout_dates | jsonb | Dates when package unavailable |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

#### 2. `combo_package_items` - Items included in combo
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| combo_id | uuid | Foreign key to combo_packages |
| day_number | integer | Which day this item is scheduled |
| item_type | text | hotel / activity / transfer / visa |
| item_id | uuid | Reference to actual item (nullable) |
| title | text | Display title |
| description | text | Item description |
| start_time | text | Start time (e.g., "10:00 AM") |
| end_time | text | End time |
| price_aed | numeric | Individual price (for calculation) |
| is_mandatory | boolean | Cannot be removed |
| is_flexible | boolean | Time can be adjusted |
| sort_order | integer | Order within day |
| metadata | jsonb | Additional data |

#### 3. `combo_ai_rules` - AI suggestion rules
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| rule_name | text | Rule identifier |
| conditions | jsonb | Conditions to match (travelers, budget, etc.) |
| combo_id | uuid | Suggested combo package |
| priority | integer | Rule priority |
| max_discount_percent | numeric | Max allowed discount |
| upsell_combos | uuid[] | Related upsell combos |
| is_active | boolean | Active status |

#### 4. Storage Bucket
- Create `combo-images` bucket for combo package images

---

## File Structure

```text
src/
├── pages/
│   ├── ComboPackages.tsx           # Listing page
│   ├── ComboPackageDetail.tsx      # Detail page
│   └── admin/
│       ├── ComboPackages.tsx       # Admin listing
│       ├── AddComboPackage.tsx     # Create combo
│       └── EditComboPackage.tsx    # Edit combo
├── components/
│   ├── combo/
│   │   ├── ComboCard.tsx           # Package card component
│   │   ├── ComboFilters.tsx        # Filter by type/duration
│   │   ├── ComboItinerary.tsx      # Day-by-day display
│   │   ├── ComboPricing.tsx        # Pricing breakdown
│   │   ├── ComboBookingCard.tsx    # Booking sidebar
│   │   └── ComboSuggestion.tsx     # AI suggestion banner
│   └── admin/
│       ├── ComboForm.tsx           # Create/edit form
│       ├── ComboItemsBuilder.tsx   # Drag-drop item builder
│       ├── ComboPricingEditor.tsx  # Pricing rules editor
│       └── ComboAIRulesEditor.tsx  # AI rules configuration
└── hooks/
    ├── useComboPackages.ts         # CRUD hooks
    └── useComboAIRules.ts          # AI rules hooks
```

---

## Frontend Implementation

### 1. Combo Packages Listing Page (`/combo-packages`)

**Features:**
- Hero section with "Dubai Combo Tour Packages" title
- Filter chips: All, Family, Couple, Adventure, Luxury, Essentials
- Grid of combo cards showing:
  - Package image with duration badge
  - Icons for included services (Hotel, Car, Attractions, Visa)
  - Original price (strikethrough) and discounted price
  - "Save X%" badge
  - "View Details" button

**UI Design:**
```text
+------------------------------------------+
|  🏙️ Dubai Combo Tour Packages            |
|  Bundle & Save up to 25% on packages     |
+------------------------------------------+
| [All] [Family] [Couple] [Adventure] ...  |
+------------------------------------------+
| +----------------+ +----------------+    |
| | [Image]        | | [Image]        |    |
| | 4 Days Badge   | | 5 Days Badge   |    |
| | Dubai          | | Dubai Family   |    |
| | Essentials     | | Combo          |    |
| | 🏨 🚗 🎟️      | | 🏨 🚗 🎟️ 🛂   |    |
| | ̶A̶E̶D̶ ̶4̶,̶0̶0̶0̶    | | ̶A̶E̶D̶ ̶8̶,̶0̶0̶0̶    |    |
| | AED 3,200      | | AED 6,400      |    |
| | [Save 20%]     | | [Save 20%]     |    |
| | [View Details] | | [View Details] |    |
| +----------------+ +----------------+    |
+------------------------------------------+
```

### 2. Combo Package Detail Page (`/combo-packages/:slug`)

**Sections:**
1. **Hero** - Large image, title, duration, savings badge
2. **What's Included** - Grid of included items with icons
3. **Day-by-Day Itinerary** - Collapsible timeline view
4. **Pricing** - Per person and group pricing with breakdown
5. **Booking Card** (sticky sidebar) - WhatsApp CTA, Customize button
6. **FAQ** - Common questions
7. **Similar Packages** - Related combos

### 3. AI Integration

**Smart Suggestion Banner:**
When user inputs trip preferences in the AI Trip Planner:
- Detect matching combo based on:
  - `trip_days ≤ 4` → Essentials Combo
  - `family + kids` → Family Combo
  - `couple` → Romantic Combo
  - `budget = luxury` → Luxury Combo
- Show suggestion card:
  ```text
  ✨ Most travelers with your plan choose this combo
  [Dubai Family Combo - Save 20%] [View Package]
  ```

**Customize Combo Flow:**
- "Customize This Combo" button loads combo into Trip Itinerary page
- Allows drag-drop reordering
- Add/remove activities
- Upgrade hotel tier
- Real-time price recalculation

---

## Admin Panel Implementation

### 1. Combo Package Management (`/admin/combo-packages`)

**Features:**
- Table view with columns: Name, Type, Duration, Price, Status, Actions
- Quick actions: Edit, Duplicate, Toggle Status
- Filters by type and status

### 2. Combo Creation Form (`/admin/combo-packages/add`)

**Form Sections:**

**Basic Info:**
- Combo Name
- Slug (auto-generated)
- Type (Family / Couple / Adventure / Luxury / Essentials)
- Duration (Days/Nights)
- Description & Long Description

**Pricing:**
- Base Price (AED)
- Discount Percentage
- Final Price (auto-calculated)
- Seasonal Pricing (date ranges with multipliers)
- Blackout Dates

**Content Builder (Drag & Drop):**
- Add days dynamically
- For each day:
  - Add items from existing services/activities
  - Set times
  - Mark as mandatory/flexible
  - Reorder via drag-drop

**Inclusions:**
- Hotel Selection (star rating or specific hotel)
- Transport Type (Sedan / SUV / Van)
- Visa Inclusion toggle
- Activities multi-select

**Media:**
- Main Image upload (auto WebP conversion)
- Gallery images

**SEO:**
- Meta Title
- Meta Description

### 3. AI Rules Configuration (`/admin/combo-packages/ai-rules`)

**Rule Builder:**
- Condition: When traveler type = X AND budget = Y AND days ≤ Z
- Action: Suggest combo_id with priority
- Max discount allowed
- Upsell suggestions

---

## Navigation Updates

### Header Menu Addition
Add "Combos" or "Packages" to the main navigation:

```typescript
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Plan Trip", path: "/plan-trip", highlight: true },
  { name: "Combo Packages", path: "/combo-packages" }, // NEW
  { name: "Activities", path: "/experiences", hasDropdown: true },
  // ... rest
];
```

### Admin Sidebar Addition
Add under Tours section:
```typescript
{
  title: "Combo Packages",
  icon: Package,
  children: [
    { title: "All Combos", href: "/admin/combo-packages" },
    { title: "Add Combo", href: "/admin/combo-packages/add" },
    { title: "AI Rules", href: "/admin/combo-packages/ai-rules" },
  ],
}
```

---

## Pricing Logic

### Combo Price Calculation
```typescript
const calculateComboPrice = (items: ComboItem[], discount: number) => {
  const totalItemsPrice = items.reduce((sum, item) => sum + item.price_aed, 0);
  const discountAmount = totalItemsPrice * (discount / 100);
  return {
    originalPrice: totalItemsPrice,
    discountAmount,
    finalPrice: totalItemsPrice - discountAmount,
    savings: `Save ${discount}%`
  };
};
```

### Validation Rule
```typescript
// Ensure combo price is always less than individual total
if (comboFinalPrice >= individualTotal) {
  throw new Error("Combo price must be less than individual items total");
}
```

---

## Technical Notes

### RLS Policies
- `combo_packages`: Public read, admin write
- `combo_package_items`: Public read, admin write
- `combo_ai_rules`: Admin only

### Storage
- `combo-images` bucket with public access
- Auto-generate WebP versions at upload (480, 768, 1280, 1920)

### Integration Points
- Links to existing `services`, `hotels`, `car_rentals`, `visa_services` tables
- Integrates with existing `trip_plans` for customization flow
- Uses existing currency conversion via `useCurrency` hook

---

## Implementation Order

1. **Phase 1: Database** - Create tables, RLS policies, storage bucket
2. **Phase 2: Hooks** - Create `useComboPackages.ts` with CRUD operations
3. **Phase 3: Admin** - Build admin forms and listing
4. **Phase 4: Frontend** - Create listing and detail pages
5. **Phase 5: Navigation** - Add to header and admin sidebar
6. **Phase 6: AI Integration** - Add suggestion logic to Trip Planner
7. **Phase 7: Testing** - End-to-end flow verification

---

## Estimated Scope

| Component | Files | Complexity |
|-----------|-------|------------|
| Database Migration | 1 | Medium |
| Hooks | 2 | Low |
| Admin Pages | 3 | High |
| Admin Components | 4 | High |
| Frontend Pages | 2 | Medium |
| Frontend Components | 6 | Medium |
| Navigation Updates | 2 | Low |
| AI Integration | 2 | Medium |

**Total: ~22 new/modified files**
