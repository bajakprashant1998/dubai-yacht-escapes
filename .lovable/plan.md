

# Implementation Plan: Car Rentals, Hotels, Visa Services & Blog

This comprehensive plan adds 4 major new sections to the Dubai tourism platform, with full frontend pages and admin management capabilities.

---

## Overview

| Section | Frontend Routes | Admin Routes | Database Tables |
|---------|-----------------|--------------|-----------------|
| Car Rentals | `/car-rentals`, `/car-rentals/:slug` | `/admin/car-rentals/*` | `car_rentals`, `car_categories` |
| Hotels | `/hotels`, `/hotels/:slug` | `/admin/hotels/*` | `hotels`, `hotel_rooms` |
| Visa Services | `/visa-services`, `/visa-services/:slug` | `/admin/visa-services/*` | `visa_services` |
| Blog | `/blog`, `/blog/:slug`, `/blog/category/:slug` | `/admin/blog/*` | `blog_posts`, `blog_categories`, `blog_tags` |

---

## 1. Car Rental System

### Database Schema

**`car_categories`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Economy, Sedan, SUV, Luxury, Supercar |
| slug | text | URL-friendly name |
| description | text | Category description |
| sort_order | integer | Display order |
| is_active | boolean | Visibility flag |

**`car_rentals`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| title | text | Car name (e.g., "Toyota Camry 2024") |
| brand | text | Car manufacturer |
| model | text | Car model |
| year | integer | Model year |
| category_id | uuid | FK to car_categories |
| seats | integer | Number of seats |
| transmission | text | Automatic/Manual |
| fuel_type | text | Petrol/Diesel/Electric/Hybrid |
| daily_price | numeric | Price per day |
| weekly_price | numeric | Price per week |
| monthly_price | numeric | Price per month |
| deposit | numeric | Security deposit |
| driver_available | boolean | Driver option available |
| self_drive | boolean | Self-drive available |
| features | text[] | AC, GPS, Bluetooth, etc. |
| image_url | text | Main image |
| gallery | text[] | Additional images |
| description | text | Short description |
| long_description | text | Full details |
| requirements | text[] | License, age, etc. |
| is_featured | boolean | Featured car |
| is_active | boolean | Visibility |
| meta_title | text | SEO title |
| meta_description | text | SEO description |

### Frontend Components

```text
src/pages/
├── CarRentals.tsx           # Listing page with filters
└── CarRentalDetail.tsx      # Detail page with booking

src/components/car-rentals/
├── CarCard.tsx              # Car listing card
├── CarFilters.tsx           # Filter sidebar (category, transmission, seats)
├── CarBookingModal.tsx      # Booking form + WhatsApp CTA
├── CarPricingTable.tsx      # Daily/Weekly/Monthly pricing display
└── CarSpecifications.tsx    # Seats, transmission, fuel specs
```

### Frontend Routes
```typescript
<Route path="/car-rentals" element={<CarRentals />} />
<Route path="/car-rentals/:categorySlug" element={<CarRentals />} />
<Route path="/car-rentals/:categorySlug/:slug" element={<CarRentalDetail />} />
```

### Admin Pages
```text
src/pages/admin/
├── CarRentals.tsx           # Car list with CRUD
├── AddCarRental.tsx         # Add new car form
├── EditCarRental.tsx        # Edit car form
└── CarCategories.tsx        # Manage car categories
```

---

## 2. Hotel Booking System

### Database Schema

**`hotels`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| name | text | Hotel name |
| star_rating | integer | 1-5 stars |
| category | text | Budget, 3-Star, 4-Star, 5-Star, Luxury |
| location | text | Area/neighborhood |
| address | text | Full address |
| latitude | numeric | Map coordinate |
| longitude | numeric | Map coordinate |
| description | text | Short description |
| long_description | text | Detailed info |
| amenities | text[] | Pool, WiFi, Gym, etc. |
| highlights | text[] | Key selling points |
| image_url | text | Main hotel image |
| gallery | text[] | Additional images |
| price_from | numeric | Starting price per night |
| contact_phone | text | Hotel contact |
| contact_email | text | Hotel email |
| check_in_time | text | Standard check-in |
| check_out_time | text | Standard check-out |
| is_featured | boolean | Featured hotel |
| is_active | boolean | Visibility |
| meta_title | text | SEO title |
| meta_description | text | SEO description |

**`hotel_rooms`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| hotel_id | uuid | FK to hotels |
| name | text | Room type name |
| description | text | Room description |
| max_guests | integer | Maximum occupancy |
| beds | text | Bed configuration |
| size_sqm | numeric | Room size |
| price_per_night | numeric | Nightly rate |
| amenities | text[] | Room amenities |
| image_url | text | Room image |
| is_available | boolean | Availability |

### Frontend Components

```text
src/pages/
├── Hotels.tsx               # Hotel listing with filters
└── HotelDetail.tsx          # Hotel detail with room selection

src/components/hotels/
├── HotelCard.tsx            # Hotel listing card
├── HotelFilters.tsx         # Filters (star rating, location, price)
├── HotelRoomCard.tsx        # Room type display
├── HotelAmenities.tsx       # Amenity icons grid
├── HotelEnquiryModal.tsx    # Book Now / Enquiry form
└── HotelMap.tsx             # Location map integration
```

### Frontend Routes
```typescript
<Route path="/hotels" element={<Hotels />} />
<Route path="/hotels/:category" element={<Hotels />} />
<Route path="/hotels/:category/:slug" element={<HotelDetail />} />
```

### Admin Pages
```text
src/pages/admin/
├── Hotels.tsx               # Hotel list management
├── AddHotel.tsx             # Add new hotel
├── EditHotel.tsx            # Edit hotel details
└── HotelRooms.tsx           # Manage rooms for a hotel
```

---

## 3. Visa Services System

### Database Schema

**`visa_services`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| title | text | Visa type name |
| visa_type | text | Tourist, Express, Multiple Entry |
| duration_days | integer | 14, 30, 60 days |
| validity | text | Visa validity period |
| processing_time | text | 2-3 business days |
| price | numeric | Service fee |
| original_price | numeric | For discount display |
| description | text | Short description |
| long_description | text | Full details |
| requirements | text[] | Required documents |
| included | text[] | What's included |
| excluded | text[] | What's not included |
| faqs | jsonb | Common questions |
| image_url | text | Banner image |
| is_express | boolean | Express processing |
| is_featured | boolean | Featured service |
| is_active | boolean | Visibility |
| sort_order | integer | Display order |
| meta_title | text | SEO title |
| meta_description | text | SEO description |

### Frontend Components

```text
src/pages/
├── VisaServices.tsx         # Visa listing page
└── VisaServiceDetail.tsx    # Visa detail with application

src/components/visa/
├── VisaCard.tsx             # Visa service card
├── VisaComparisonTable.tsx  # Compare visa types
├── VisaRequirements.tsx     # Document checklist
├── VisaApplicationForm.tsx  # Apply Now form
└── VisaProcessTimeline.tsx  # Processing steps
```

### Frontend Routes
```typescript
<Route path="/visa-services" element={<VisaServices />} />
<Route path="/visa-services/:slug" element={<VisaServiceDetail />} />
```

### Admin Pages
```text
src/pages/admin/
├── VisaServices.tsx         # Visa services list
├── AddVisaService.tsx       # Add new visa service
└── EditVisaService.tsx      # Edit visa service
```

---

## 4. Blog System

### Database Schema

**`blog_categories`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Category name |
| slug | text | URL-friendly name |
| description | text | Category description |
| image_url | text | Category image |
| sort_order | integer | Display order |
| is_active | boolean | Visibility |

**`blog_tags`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Tag name |
| slug | text | URL-friendly tag |

**`blog_posts`**
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| slug | text | URL-friendly identifier |
| title | text | Post title |
| excerpt | text | Short summary |
| content | text | Full content (rich text) |
| featured_image | text | Hero image |
| author_id | uuid | FK to profiles |
| category_id | uuid | FK to blog_categories |
| tags | text[] | Tag slugs array |
| reading_time | integer | Estimated minutes |
| published_at | timestamp | Publish date |
| is_featured | boolean | Featured post |
| is_published | boolean | Published status |
| view_count | integer | Page views |
| meta_title | text | SEO title |
| meta_description | text | SEO description |
| meta_keywords | text[] | SEO keywords |

### Frontend Components

```text
src/pages/
├── Blog.tsx                 # Blog listing with sidebar
├── BlogPost.tsx             # Single post view
└── BlogCategory.tsx         # Category archive

src/components/blog/
├── BlogCard.tsx             # Post preview card
├── BlogSidebar.tsx          # Categories, tags, recent posts
├── BlogHero.tsx             # Featured post banner
├── TableOfContents.tsx      # Post navigation
├── ShareButtons.tsx         # Social sharing
├── RelatedPosts.tsx         # Related articles
└── AuthorCard.tsx           # Author bio
```

### SEO-Friendly Routes
```typescript
<Route path="/blog" element={<Blog />} />
<Route path="/blog/category/:categorySlug" element={<BlogCategory />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/blog/tag/:tagSlug" element={<BlogTag />} />
```

### Admin Pages
```text
src/pages/admin/
├── Blog.tsx                 # Post list with draft/published filters
├── AddBlogPost.tsx          # Rich text editor for new posts
├── EditBlogPost.tsx         # Edit existing post
├── BlogCategories.tsx       # Manage categories
└── BlogTags.tsx             # Manage tags
```

---

## Navigation Updates

### Frontend Header
Add new navigation items to `src/components/layout/Header.tsx`:

```typescript
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Activities", path: "/experiences", hasDropdown: true },
  { name: "Car Rentals", path: "/car-rentals" },
  { name: "Hotels", path: "/hotels" },
  { name: "Visa Services", path: "/visa-services" },
  { name: "Blog", path: "/blog" },
  // ... existing links
];
```

### Admin Sidebar
Add new sections to `src/components/admin/AdminSidebar.tsx`:

```typescript
const navItems = [
  // ... existing items
  {
    title: "Car Rentals",
    icon: Car,
    children: [
      { title: "All Cars", href: "/admin/car-rentals" },
      { title: "Add Car", href: "/admin/car-rentals/add" },
      { title: "Categories", href: "/admin/car-rentals/categories" },
    ],
  },
  {
    title: "Hotels",
    icon: Building,
    children: [
      { title: "All Hotels", href: "/admin/hotels" },
      { title: "Add Hotel", href: "/admin/hotels/add" },
    ],
  },
  {
    title: "Visa Services",
    icon: FileText,
    children: [
      { title: "All Visas", href: "/admin/visa-services" },
      { title: "Add Visa", href: "/admin/visa-services/add" },
    ],
  },
  {
    title: "Blog",
    icon: BookOpen,
    children: [
      { title: "All Posts", href: "/admin/blog" },
      { title: "Add Post", href: "/admin/blog/add" },
      { title: "Categories", href: "/admin/blog/categories" },
      { title: "Tags", href: "/admin/blog/tags" },
    ],
  },
];
```

---

## Storage Buckets

Create new storage buckets for each section:
- `car-images` - Car rental photos
- `hotel-images` - Hotel and room photos
- `visa-images` - Visa service banners
- `blog-images` - Blog post images

---

## Implementation Order

### Phase 1: Database Setup
1. Create all database tables with proper relationships
2. Set up RLS policies for public read and admin write
3. Create storage buckets with public access
4. Add sample data for testing

### Phase 2: Car Rentals (Frontend + Admin)
5. Create car rental listing and detail pages
6. Build car booking form with WhatsApp integration
7. Create admin CRUD pages for cars
8. Add car categories management

### Phase 3: Hotels (Frontend + Admin)
9. Create hotel listing and detail pages
10. Build room cards and enquiry form
11. Create admin hotel management
12. Add room management per hotel

### Phase 4: Visa Services (Frontend + Admin)
13. Create visa services listing page
14. Build visa detail with application form
15. Create admin visa management

### Phase 5: Blog (Frontend + Admin)
16. Create blog listing with category sidebar
17. Build single post view with TOC
18. Create rich text editor for admin
19. Add category and tag management

### Phase 6: Navigation & Polish
20. Update header navigation
21. Update admin sidebar
22. Add sections to homepage
23. SEO optimization

---

## Files Summary

### New Files to Create (70+ files)

**Frontend Pages (10 files)**
- `src/pages/CarRentals.tsx`
- `src/pages/CarRentalDetail.tsx`
- `src/pages/Hotels.tsx`
- `src/pages/HotelDetail.tsx`
- `src/pages/VisaServices.tsx`
- `src/pages/VisaServiceDetail.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogPost.tsx`
- `src/pages/BlogCategory.tsx`
- `src/pages/BlogTag.tsx`

**Admin Pages (15 files)**
- `src/pages/admin/CarRentals.tsx`
- `src/pages/admin/AddCarRental.tsx`
- `src/pages/admin/EditCarRental.tsx`
- `src/pages/admin/CarCategories.tsx`
- `src/pages/admin/Hotels.tsx`
- `src/pages/admin/AddHotel.tsx`
- `src/pages/admin/EditHotel.tsx`
- `src/pages/admin/HotelRooms.tsx`
- `src/pages/admin/VisaServices.tsx`
- `src/pages/admin/AddVisaService.tsx`
- `src/pages/admin/EditVisaService.tsx`
- `src/pages/admin/Blog.tsx`
- `src/pages/admin/AddBlogPost.tsx`
- `src/pages/admin/EditBlogPost.tsx`
- `src/pages/admin/BlogCategories.tsx`

**Components (25+ files)**
- Car rental components (5 files)
- Hotel components (6 files)
- Visa components (5 files)
- Blog components (7 files)

**Hooks (8 files)**
- `src/hooks/useCarRentals.ts`
- `src/hooks/useCarCategories.ts`
- `src/hooks/useHotels.ts`
- `src/hooks/useHotelRooms.ts`
- `src/hooks/useVisaServices.ts`
- `src/hooks/useBlogPosts.ts`
- `src/hooks/useBlogCategories.ts`
- `src/hooks/useBlogTags.ts`

**Mappers (4 files)**
- `src/lib/carMapper.ts`
- `src/lib/hotelMapper.ts`
- `src/lib/visaMapper.ts`
- `src/lib/blogMapper.ts`

### Files to Modify
- `src/App.tsx` - Add all new routes
- `src/components/layout/Header.tsx` - Update navigation
- `src/components/admin/AdminSidebar.tsx` - Add admin sections

---

## WhatsApp Integration

All booking forms will include a WhatsApp CTA using the existing pattern:

```typescript
const handleWhatsApp = () => {
  const message = encodeURIComponent(
    `Hello! I'm interested in booking:\n\n` +
    `${itemType}: ${itemName}\n` +
    `Date: ${selectedDate}\n` +
    `Details: ${formDetails}`
  );
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
};
```

This ensures instant communication while the booking form captures lead data.
