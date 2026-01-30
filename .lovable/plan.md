

# AI-Powered Dubai Tour Planner - Implementation Plan

## Executive Summary

This plan creates a comprehensive AI-powered travel assistant that automatically generates complete Dubai tour packages from minimal user input. The system leverages the existing database (hotels, cars, visa services, tours/activities) and integrates with Lovable AI to provide intelligent trip planning, real-time customization, and seamless booking.

---

## System Architecture Overview

```text
+------------------+     +-------------------+     +------------------+
|   Frontend UI    |     |   Edge Functions  |     |    Database      |
|                  |     |                   |     |                  |
| - Trip Planner   |<--->| - ai-trip-planner |<--->| - trip_plans     |
| - Itinerary View |     | - generate-pdf    |     | - trip_items     |
| - Chat Interface |     | - currency-rates  |     | - visa_rules     |
| - Admin Panel    |     +-------------------+     | - currency_rates |
+------------------+            |                  | - ai_config      |
        |                       v                  +------------------+
        |              +-------------------+
        +------------->|   Lovable AI      |
                       | (Gemini 3 Flash)  |
                       +-------------------+
```

---

## Phase 1: Database Schema

### New Tables Required

**1. `trip_plans` - Stores generated trip itineraries**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| visitor_id | text | Anonymous visitor identifier |
| user_id | uuid | Optional logged-in user |
| status | text | draft, confirmed, booked, cancelled |
| destination | text | Dubai (default) |
| arrival_date | date | Trip start date |
| departure_date | date | Trip end date |
| total_days | integer | Trip duration |
| travelers_adults | integer | Number of adults |
| travelers_children | integer | Number of children |
| nationality | text | Visitor's nationality |
| budget_tier | text | low, medium, luxury |
| travel_style | text | family, couple, adventure, relax, luxury |
| special_occasion | text | birthday, honeymoon, anniversary, none |
| hotel_preference | text | Optional hotel star preference |
| total_price_aed | numeric | Base price in AED |
| display_currency | text | User's display currency |
| display_price | numeric | Converted price |
| metadata | jsonb | AI generation details, version info |
| pdf_url | text | Generated PDF storage URL |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last modification |

**2. `trip_items` - Individual items in a trip plan**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| trip_id | uuid | FK to trip_plans |
| day_number | integer | Day 1, 2, 3, etc. |
| item_type | text | hotel, car, activity, visa, transfer, upsell |
| item_id | uuid | FK to source table (hotels, car_rentals, etc.) |
| title | text | Display title |
| description | text | Brief description |
| start_time | time | Scheduled start |
| end_time | time | Scheduled end |
| price_aed | numeric | Item price |
| quantity | integer | Count (nights, hours, people) |
| is_optional | boolean | Upsell/optional item |
| is_included | boolean | Currently in itinerary |
| sort_order | integer | Order within day |
| metadata | jsonb | Extra details (room type, car class, etc.) |

**3. `visa_nationality_rules` - Visa requirements by country**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| country_code | text | ISO country code |
| country_name | text | Full country name |
| visa_required | boolean | Whether visa needed |
| visa_on_arrival | boolean | VOA available |
| recommended_visa_id | uuid | FK to visa_services |
| notes | text | Special requirements |
| documents_required | text[] | Required documents |

**4. `currency_rates` - Exchange rate management**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| currency_code | text | USD, EUR, GBP, INR, etc. |
| currency_name | text | US Dollar, Euro, etc. |
| rate_to_aed | numeric | Exchange rate |
| margin_percent | numeric | Conversion margin |
| is_enabled | boolean | Available for display |
| updated_at | timestamp | Last rate update |

**5. `ai_trip_config` - Admin AI behavior controls**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| config_key | text | Unique config identifier |
| config_value | jsonb | Configuration data |
| description | text | Admin description |

---

## Phase 2: AI Trip Planner Edge Function

### `supabase/functions/ai-trip-planner/index.ts`

The core AI engine that generates complete trip plans.

**Request Payload:**
```typescript
{
  action: "generate" | "modify" | "recalculate",
  tripId?: string,
  input: {
    arrivalDate: string,
    departureDate: string,
    adults: number,
    children: number,
    nationality: string,
    budgetTier: "low" | "medium" | "luxury",
    travelStyle: "family" | "couple" | "adventure" | "relax" | "luxury",
    specialOccasion?: string,
    hotelPreference?: number,
    modifications?: string // For chat-based modifications
  }
}
```

**AI System Prompt Logic:**

The edge function will:
1. Fetch all available data (hotels, cars, activities, visa rules) from database
2. Build a comprehensive system prompt with pricing rules and availability
3. Use structured output (tool calling) to get a valid JSON trip plan
4. Apply business rules (max 2 activities/day, buffer times, logical ordering)
5. Calculate total pricing with proper margins
6. Store the generated plan in database
7. Return the complete itinerary

**Key AI Rules (Embedded in System Prompt):**
- Day 1: Arrival + light activity (1 max)
- Last Day: Free time + departure transfer
- Middle days: 2 major activities maximum
- Hotel selection based on budget tier and travel style
- Transport based on traveler count
- Auto-suggest visa if required by nationality
- Include upsell recommendations (max 25% of trip cost)

---

## Phase 3: Frontend Components

### 3.1 Trip Planner Page (`src/pages/TripPlanner.tsx`)

**Features:**
- Step-by-step wizard for trip inputs
- Minimal required fields (dates, travelers, nationality, budget)
- Auto-detect user location for currency
- "Plan My Trip" CTA triggers AI generation

**Steps:**
1. When are you traveling? (Date picker)
2. How many travelers? (Adults/Children counters)
3. What's your nationality? (Dropdown with flag icons)
4. Budget preference (Low/Medium/Luxury cards)
5. Travel style (Family/Couple/Adventure/Relax icons)
6. Special occasion? (Optional - Birthday/Honeymoon/etc.)

### 3.2 Trip Itinerary View (`src/pages/TripItinerary.tsx`)

**Features:**
- Visual day-by-day timeline
- Each day shows:
  - Hotel (if overnight)
  - Activities with times
  - Transport details
  - Meals included
- Drag-and-drop capability using @hello-pangea/dnd
- Real-time price recalculation on changes
- "Recommended for You" upsell section
- Total cost breakdown panel
- "Book Now" and "Save Trip" CTAs
- WhatsApp share button
- PDF download option

### 3.3 Trip Chat Interface (`src/components/trip/TripChatModifier.tsx`)

**Conversational AI Integration:**
- Floating chat panel on itinerary page
- Natural language commands:
  - "Change hotel to 5-star"
  - "Add Ferrari World on Day 3"
  - "Remove Desert Safari"
  - "Make this trip more luxury"
  - "Reduce the budget"
- AI processes command, updates itinerary, shows changes
- Animated diff view showing what changed

### 3.4 Currency Selector (`src/components/trip/CurrencySelector.tsx`)

- Dropdown in header/trip view
- Auto-detect from browser locale
- Persist preference in localStorage
- Real-time conversion on all prices

### 3.5 Visa Suggestion Banner (`src/components/trip/VisaSuggestion.tsx`)

- Appears after nationality selection
- Shows visa requirement status
- "Add Visa to Trip" one-click button
- Processing time and document checklist

---

## Phase 4: Admin Panel Extensions

### 4.1 AI Trip Settings (`src/pages/admin/AITripSettings.tsx`)

**Configurable Options:**
- Budget tier hotel mappings (Low→3★, Medium→4★, Luxury→5★)
- Travel style location preferences
- Max activities per day
- Travel time buffers
- Cost margin percentages
- Upsell priority and limits
- Enable/disable AI features

### 4.2 Visa Rules Management (`src/pages/admin/VisaRules.tsx`)

- Table of countries with visa requirements
- Toggle visa_required per country
- Link recommended visa product
- Manage required documents per country

### 4.3 Currency Management (`src/pages/admin/CurrencyRates.tsx`)

- Currency list with rates
- Set conversion margins
- Enable/disable currencies
- Manual rate override option

### 4.4 AI Trip Dashboard (`src/pages/admin/AITripDashboard.tsx`)

- Total AI-generated trips
- Conversion rate (generated → booked)
- Most popular activities in AI plans
- Average trip value
- Trip approval queue (optional manual review)

---

## Phase 5: PDF Generation & WhatsApp

### 5.1 PDF Edge Function (`supabase/functions/generate-trip-pdf/index.ts`)

**PDF Contents:**
- Company branding header
- Trip summary (dates, travelers, total cost)
- Day-by-day detailed itinerary
- Hotel details with images
- Activity descriptions
- Transport information
- Emergency contacts
- QR code linking to online itinerary
- Booking reference number

### 5.2 WhatsApp Integration

Using existing WhatsApp pattern:
- "Share via WhatsApp" button
- Pre-formatted message with trip highlights
- Deep link to PDF or online itinerary
- Follow-up message template for admins

---

## Phase 6: Upsell & Recommendations

### AI-Driven Upsell Logic

**Trigger Conditions (configured in admin):**
| Profile | Recommendation |
|---------|----------------|
| Couple + Honeymoon | Yacht dinner, helicopter tour |
| Luxury budget | Private transfers, premium experiences |
| Family + Kids | Theme park VIP, private tours |
| Adventure style | ATV, skydiving, jet ski |
| Evening free | Dhow cruise, Marina dinner |

**Display:**
- "Recommended for You" section below itinerary
- "Most travelers add this" social proof badge
- One-click "Add to Trip" button
- Show price difference clearly

---

## Implementation Phases

### Phase 1: Database & Core Backend (Week 1)
1. Create all new database tables with RLS
2. Seed visa nationality rules (50+ countries)
3. Seed initial currency rates
4. Create ai_trip_config with default values
5. Build `ai-trip-planner` edge function

### Phase 2: Trip Planner Frontend (Week 2)
6. Create TripPlanner wizard page
7. Create TripItinerary view component
8. Implement day timeline with drag-and-drop
9. Build price calculation engine (client-side)
10. Add currency conversion

### Phase 3: AI Chat Modifier (Week 3)
11. Create TripChatModifier component
12. Extend edge function for modifications
13. Implement diff view for changes
14. Add visa suggestion flow

### Phase 4: Admin Panel (Week 4)
15. AI Trip Settings page
16. Visa Rules management
17. Currency Rates management
18. AI Trip Dashboard with analytics

### Phase 5: PDF & WhatsApp (Week 5)
19. PDF generation edge function
20. WhatsApp share integration
21. Email itinerary feature
22. Storage bucket for PDFs

### Phase 6: Polish & Testing (Week 6)
23. Mobile responsive optimization
24. Performance tuning
25. Error handling improvements
26. End-to-end testing

---

## Technical Implementation Details

### Files to Create

**Edge Functions (4 files):**
- `supabase/functions/ai-trip-planner/index.ts`
- `supabase/functions/generate-trip-pdf/index.ts`
- `supabase/functions/update-currency-rates/index.ts`
- `supabase/functions/whatsapp-share/index.ts`

**Frontend Pages (6 files):**
- `src/pages/TripPlanner.tsx`
- `src/pages/TripItinerary.tsx`
- `src/pages/admin/AITripSettings.tsx`
- `src/pages/admin/AITripDashboard.tsx`
- `src/pages/admin/VisaRules.tsx`
- `src/pages/admin/CurrencyRates.tsx`

**Frontend Components (15+ files):**
- `src/components/trip/TripWizard.tsx`
- `src/components/trip/DateSelector.tsx`
- `src/components/trip/TravelerCounter.tsx`
- `src/components/trip/NationalitySelector.tsx`
- `src/components/trip/BudgetSelector.tsx`
- `src/components/trip/TravelStyleSelector.tsx`
- `src/components/trip/DayTimeline.tsx`
- `src/components/trip/TripItemCard.tsx`
- `src/components/trip/TripChatModifier.tsx`
- `src/components/trip/CurrencySelector.tsx`
- `src/components/trip/VisaSuggestion.tsx`
- `src/components/trip/PriceBreakdown.tsx`
- `src/components/trip/UpsellSection.tsx`
- `src/components/trip/TripActions.tsx`
- `src/components/trip/TripSkeleton.tsx`

**Hooks (5 files):**
- `src/hooks/useTripPlanner.ts`
- `src/hooks/useTripModifier.ts`
- `src/hooks/useCurrency.ts`
- `src/hooks/useVisaRules.ts`
- `src/hooks/useAITripConfig.ts`

### Files to Modify

- `src/App.tsx` - Add trip planner routes
- `src/components/layout/Header.tsx` - Add "Plan My Trip" CTA
- `src/components/admin/AdminSidebar.tsx` - Add AI Trip settings section

---

## Existing Resources to Leverage

The system will integrate with existing database tables:
- `hotels` (3 properties with rooms)
- `car_rentals` (4 vehicles)
- `visa_services` (3 visa types)
- `services` (5+ activities)
- `tours` (yacht cruises, dhow cruises)
- `site_settings` (contact info, WhatsApp number)

---

## AI Model Configuration

Using Lovable AI with `google/gemini-3-flash-preview`:
- Fast response times for real-time planning
- Structured output via tool calling for reliable JSON
- Context window sufficient for inventory data
- Cost-effective for high-volume usage

**Note:** The Gemini API key provided in the request will NOT be used. The system uses the pre-configured LOVABLE_API_KEY which provides access to supported AI models without additional setup.

---

## Success Metrics

The implementation achieves the stated goal:
> "Mujhe sirf Dubai bolna pada, baaki sab automatically ho gaya."

- **Minimal Input**: Only 5-6 fields required
- **Maximum Automation**: Complete itinerary generated in seconds
- **Luxury Feel**: Premium UI with animations and polish
- **Fast Decisions**: Clear pricing, easy modifications
- **Trust Building**: Professional PDF, WhatsApp follow-up

