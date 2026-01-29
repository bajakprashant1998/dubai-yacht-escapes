
# Extra Booking Services Enhancement Plan

This plan adds a comprehensive "Extra Services" feature inspired by Klook's Dubai offerings. This will allow the business to expand beyond yacht charters to offer additional Dubai experiences as add-ons or standalone bookings.

---

## Overview

The enhancement creates a new service type system that allows the admin to manage additional tourism services (Desert Safari, Airport Transfers, Theme Park Tickets, etc.) that customers can book alongside or instead of yacht tours.

---

## Database Schema Changes

### New Table: `services`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| title | text | Service name |
| subtitle | text | Short tagline |
| description | text | Brief description |
| long_description | text | Full details (markdown) |
| price | numeric | Base price in AED |
| original_price | numeric | Original price for discount display |
| duration | text | Duration (e.g., "6 Hours") |
| image_url | text | Main image |
| gallery | text[] | Additional images |
| category_id | uuid | FK to service_categories |
| highlights | text[] | Key features |
| included | text[] | What's included |
| excluded | text[] | What's not included |
| meeting_point | text | Pickup/meeting location |
| rating | numeric | Average rating (default 4.5) |
| review_count | integer | Number of reviews |
| is_featured | boolean | Show on homepage |
| is_active | boolean | Published status |
| booking_type | text | 'per_person', 'per_group', 'per_vehicle' |
| min_participants | integer | Minimum guests required |
| max_participants | integer | Maximum capacity |
| cancellation_policy | text | Free cancellation details |
| instant_confirmation | boolean | Instant booking |
| hotel_pickup | boolean | Includes hotel pickup |
| sort_order | integer | Display order |
| meta_title | text | SEO title |
| meta_description | text | SEO description |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |

### New Table: `service_categories`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Category name |
| slug | text | URL-friendly identifier |
| description | text | Category description |
| icon | text | Lucide icon name |
| image_url | text | Category banner image |
| is_active | boolean | Published status |
| sort_order | integer | Display order |
| created_at | timestamp | Creation date |

### Service Categories (Initial Data)

| Name | Slug | Icon |
|------|------|------|
| Desert Safari | desert-safari | sun |
| Theme Parks | theme-parks | ferris-wheel |
| Observation Decks | observation-decks | binoculars |
| Water Sports | water-sports | waves |
| Airport Transfers | airport-transfers | plane |
| City Tours | city-tours | map-pin |
| Adventure Sports | adventure-sports | mountain |
| Dining Experiences | dining-experiences | utensils |

---

## Frontend Components

### New Pages

**1. Services Listing Page (`src/pages/Services.tsx`)**
- Hero section with Dubai skyline
- Category filter tabs (similar to Tours page)
- Grid of service cards with filtering and sorting
- SEO-friendly URLs: `/dubai/services/:category/:slug`

**2. Service Detail Page (`src/pages/ServiceDetail.tsx`)**
- Image gallery with lightbox
- Key info badges (duration, pickup, cancellation)
- Description with highlights
- Booking sidebar with date picker
- Reviews section
- Related services carousel

### New Components

**1. `src/components/ServiceCard.tsx`**
- Image with category badge
- Title, rating, and review count
- Duration and key features
- Price with discount display
- "Book Now" and "Details" buttons

**2. `src/components/service-detail/ServiceBookingSidebar.tsx`**
- Date selection
- Guest count (if per_person)
- Price calculator
- Instant confirmation badge
- WhatsApp inquiry button

**3. `src/components/home/PopularServices.tsx`**
- Homepage section showcasing featured services
- Horizontal scrolling carousel on mobile
- "View All" link to services page

### Header Navigation Update

Add "Experiences" dropdown in Header.tsx:

```text
Tours (existing)
  |-- Dhow Cruises
  |-- Shared Yacht
  |-- Private Charter
  |-- Megayacht

Experiences (new)
  |-- Desert Safari
  |-- Theme Parks
  |-- Water Sports
  |-- City Tours
  |-- View All
```

---

## Admin Panel Updates

### New Admin Pages

**1. `src/pages/admin/Services.tsx`**
- List all services with search and filter
- Status toggle (active/inactive)
- Featured toggle
- Quick edit actions
- Bulk actions toolbar

**2. `src/pages/admin/AddService.tsx`**
- Form similar to TourForm
- Rich text editor for descriptions
- Image upload for main image and gallery
- Category dropdown
- Pricing and availability settings
- SEO fields

**3. `src/pages/admin/EditService.tsx`**
- Pre-populated edit form
- Version history (optional)

**4. `src/pages/admin/ServiceCategories.tsx`**
- Manage service categories
- Drag-to-reorder
- Icon picker

### Admin Sidebar Update

Add "Services" section in AdminSidebar.tsx:

```text
Services (new section)
  |-- All Services
  |-- Add Service
  |-- Service Categories
```

---

## Hooks and Data Layer

### New Hooks

**`src/hooks/useServices.ts`**
- `useServices()` - Fetch all active services
- `useFeaturedServices()` - Fetch featured services
- `useService(slug)` - Fetch single service
- `useServicesByCategory(category)` - Filter by category
- `useCreateService()` - Admin mutation
- `useUpdateService()` - Admin mutation
- `useDeleteService()` - Admin mutation

**`src/hooks/useServiceCategories.ts`**
- `useServiceCategories()` - Fetch all categories
- `useActiveServiceCategories()` - Public categories
- CRUD mutations for admin

### Service Mapper

**`src/lib/serviceMapper.ts`**
- Map database records to frontend interface
- Handle image path normalization
- Default values for optional fields

---

## Booking Flow Integration

### Option A: Separate Booking System
- New `service_bookings` table
- Similar structure to `bookings` table
- Separate admin view for service bookings

### Option B: Unified Booking System (Recommended)
- Add `booking_source` column to existing `bookings` table ('tour' or 'service')
- Add `service_id` nullable foreign key
- Reuse existing booking modal with minor adaptations
- Single admin bookings view with source filter

---

## SEO and Routing

### New Routes in App.tsx

```typescript
// Service listing with category
<Route path="/dubai/services/:categoryPath" element={<Services />} />
// Individual service detail
<Route path="/dubai/services/:categoryPath/:slug" element={<ServiceDetail />} />
// General services page
<Route path="/services" element={<Services />} />
```

### URL Structure

| Page | URL |
|------|-----|
| All Services | `/services` |
| Desert Safari Category | `/dubai/services/desert-safari` |
| Specific Safari Tour | `/dubai/services/desert-safari/evening-desert-safari-bbq` |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/Services.tsx` | Services listing page |
| `src/pages/ServiceDetail.tsx` | Service detail page |
| `src/components/ServiceCard.tsx` | Service card component |
| `src/components/service-detail/ServiceBookingSidebar.tsx` | Booking sidebar |
| `src/components/service-detail/ServiceImageGallery.tsx` | Image gallery |
| `src/components/home/PopularServices.tsx` | Homepage featured services |
| `src/pages/admin/Services.tsx` | Admin services list |
| `src/pages/admin/AddService.tsx` | Add service form |
| `src/pages/admin/EditService.tsx` | Edit service form |
| `src/pages/admin/ServiceCategories.tsx` | Service categories management |
| `src/components/admin/ServiceForm.tsx` | Reusable service form |
| `src/components/admin/ServicesTable.tsx` | Services table component |
| `src/components/admin/ServiceCategoryDialog.tsx` | Category create/edit dialog |
| `src/hooks/useServices.ts` | Services data hooks |
| `src/hooks/useServiceCategories.ts` | Service categories hooks |
| `src/lib/serviceMapper.ts` | Database to frontend mapping |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add service routes |
| `src/components/layout/Header.tsx` | Add Experiences dropdown |
| `src/components/admin/AdminSidebar.tsx` | Add Services section |
| `src/pages/Home.tsx` | Add PopularServices section |
| `supabase/migrations/` | New tables and RLS policies |

---

## Implementation Priority

**Phase 1: Foundation**
1. Create database tables with RLS policies
2. Create service categories with initial data
3. Build admin CRUD for services

**Phase 2: Public Frontend**
4. Services listing page
5. Service detail page with booking
6. Header navigation update
7. Homepage integration

**Phase 3: Polish**
8. Search and advanced filtering
9. Related services recommendations
10. Analytics and reporting
