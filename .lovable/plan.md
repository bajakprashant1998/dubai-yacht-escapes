
# Fix: AI Rules Not Working + Create Demo Combo Packages

## Issues Identified

### Issue 1: Missing AI Rules Admin Page
The admin panel has a button linking to `/admin/combo-packages/ai-rules`, but this route and page do not exist. This is why AI rules are not working - there's no way to create or manage them.

### Issue 2: AI Rules Not Integrated in Trip Planner
The `useMatchCombo` hook exists in `useComboAIRules.ts`, but it's never called in the Trip Planner flow. The combo suggestion logic is not connected to the user's trip preferences.

### Issue 3: No Demo Combo Packages
The `combo_packages` table is empty - no packages have been created yet.

---

## Solution

### Part 1: Create AI Rules Admin Page

**New File: `src/pages/admin/ComboAIRules.tsx`**

Build an admin page that allows:
- View all AI rules in a table format
- Create new rules with conditions (trip days, travel style, budget tier, has children)
- Link rules to existing combo packages
- Set priority and max discount
- Toggle active/inactive status
- Delete rules

The form will include:
- Rule Name
- Conditions selector (trip days min/max, travel style, budget tier, has children)
- Combo Package selector (dropdown of existing packages)
- Priority (higher = matched first)
- Max Discount Percent
- Active toggle

### Part 2: Add Route for AI Rules Page

**File: `src/App.tsx`**

Add lazy import and route:
```text
const AdminComboAIRules = lazy(() => import("./pages/admin/ComboAIRules"));

<Route path="/admin/combo-packages/ai-rules" 
  element={<RequireSession><AdminComboAIRules /></RequireSession>} 
/>
```

### Part 3: Integrate AI Combo Suggestions in Trip Planner

**File: `src/pages/TripPlanner.tsx`**

After user selects their preferences (Step 5), before generating the trip:
1. Call `useMatchCombo` hook with user preferences
2. If a matching combo is found, display `ComboSuggestion` component
3. User can view the combo or dismiss and continue with AI generation

Flow change:
```text
Step 5 → Check for matching combo → Show suggestion (if found) → Generate Trip
```

### Part 4: Create 3 Demo Combo Packages via Database Seed

Insert demo packages directly into the database:

**Package 1: Dubai Essentials (4 Days)**
- Type: essentials
- Duration: 4 days / 3 nights
- Includes: 4-star hotel, sedan transport
- Base Price: 3,500 AED
- Discount: 15%
- Highlights: Burj Khalifa, Dubai Mall, Marina Cruise, Desert Safari

**Package 2: Dubai Family Fun (5 Days)**
- Type: family
- Duration: 5 days / 4 nights
- Includes: 4-star hotel, SUV transport, visa
- Base Price: 8,500 AED
- Discount: 20%
- Highlights: Theme parks, aquarium, kid-friendly activities

**Package 3: Dubai Romantic Escape (4 Days)**
- Type: couple
- Duration: 4 days / 3 nights
- Includes: 5-star hotel, luxury transport
- Base Price: 6,000 AED
- Discount: 18%
- Highlights: Sunset cruise, fine dining, spa experience

### Part 5: Create Default AI Rules

After creating demo packages, set up matching rules:

| Rule | Conditions | Target Combo |
|------|------------|--------------|
| Short Trip Essentials | trip_days <= 4, budget = low/medium | Dubai Essentials |
| Family with Kids | has_children = true | Dubai Family Fun |
| Romantic Couple | travel_style = couple | Dubai Romantic Escape |

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/pages/admin/ComboAIRules.tsx` | Create | AI Rules management page |
| `src/App.tsx` | Modify | Add route for AI Rules page |
| `src/pages/TripPlanner.tsx` | Modify | Integrate combo suggestion on Step 5 |
| Database | Seed | Insert 3 demo combo packages |
| Database | Seed | Insert 3 default AI rules |

---

## Technical Implementation

### AI Rules Page Components

```text
+--------------------------------------------------+
| Combo AI Rules                      [+ Add Rule] |
+--------------------------------------------------+
| Rule Name    | Conditions        | Combo | Prio  |
|--------------|-------------------|-------|-------|
| Family Rule  | has_children=true | Fam.. | 100   |
| Essentials   | days<=4, budget.. | Ess.. | 90    |
| Couple Rule  | style=couple      | Rom.. | 80    |
+--------------------------------------------------+
```

### Trip Planner Integration

On Step 5, after user selects travel style:

```text
+--------------------------------------------------+
|  Almost done! What kind of experience?           |
+--------------------------------------------------+
|  [Travel Style Selector]                         |
|  [Special Occasion Selector]                     |
+--------------------------------------------------+
|  ✨ Suggested Combo Package                      |
|  ┌───────────────────────────────────────────┐  |
|  │ Most travelers with your plan choose:     │  |
|  │ Dubai Family Fun - Save 20%               │  |
|  │ [View Package] [Dismiss]                  │  |
|  └───────────────────────────────────────────┘  |
+--------------------------------------------------+
|  [Back]              [Generate My Trip]          |
+--------------------------------------------------+
```

### Database Seed Query

```sql
-- Demo Combo Packages
INSERT INTO combo_packages (name, slug, description, combo_type, 
  duration_days, duration_nights, base_price_aed, discount_percent, 
  final_price_aed, includes_hotel, hotel_star_rating, includes_transport,
  transport_type, is_active, highlights) 
VALUES 
  ('Dubai Essentials', 'dubai-essentials', 
   'Perfect 4-day introduction to Dubai', 'essentials',
   4, 3, 3500, 15, 2975, true, 4, true, 'sedan', true,
   ARRAY['Burj Khalifa Visit', 'Dubai Mall Shopping', 
         'Marina Dhow Cruise', 'Desert Safari']);
-- ... (2 more packages)

-- AI Rules linking to packages
INSERT INTO combo_ai_rules (rule_name, conditions, combo_id, priority, is_active)
VALUES 
  ('Short Trip Essentials', 
   '{"trip_days_max": 4, "budget_tier": "medium"}', 
   (SELECT id FROM combo_packages WHERE slug = 'dubai-essentials'),
   90, true);
-- ... (2 more rules)
```

---

## Expected Behavior After Fix

1. Admin can access `/admin/combo-packages/ai-rules` to manage suggestion rules
2. When user fills trip preferences in `/plan-trip`:
   - System checks AI rules against preferences
   - If match found, shows combo suggestion banner
   - User can view combo or dismiss and generate custom trip
3. Three demo packages are available immediately for testing
4. Default AI rules automatically suggest packages based on:
   - Short trips (4 days or less) with medium budget → Essentials
   - Families with children → Family Fun
   - Couples → Romantic Escape
