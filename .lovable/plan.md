
# Implementation Plan: Admin CRUD Pages & Sample Data

This plan covers creating admin pages for Car Rentals, Hotels, Visa Services, and Blog sections, plus adding demo data to populate the frontend.

---

## Testing Summary (Completed)

The frontend pages have been tested and are working correctly:

| Page | Status | Notes |
|------|--------|-------|
| /car-rentals | Working | Shows filters sidebar with categories (Economy, Sedan, SUV, Luxury, Supercar), transmission, and price range. Empty state displays correctly. |
| /hotels | Working | Shows filters for category, star rating, and price range. Empty state displays correctly. |
| /visa-services | Working | Shows "How It Works" section with 4-step process. Empty state displays correctly. |
| /blog | Working | Shows sidebar with categories (Dubai Travel Guides, Best Time to Visit, etc.). Empty state displays correctly. |

All navigation links are functional and the header correctly shows Car Rentals, Hotels, Visa, Blog, and Contact.

---

## Phase 1: Admin CRUD Pages

### Car Rentals Admin (3 pages)

**1. `src/pages/admin/CarRentals.tsx`** - Car listing management
- Table with columns: Car (image + title), Category, Daily Price, Transmission, Status, Actions
- Stats cards: Total Cars, Featured, Active, Average Price
- Search and category filter
- Quick toggle for featured/active status
- Delete confirmation dialog

**2. `src/pages/admin/AddCarRental.tsx`** - Add new car form wrapper
- Back button to /admin/car-rentals
- Renders CarForm component in create mode

**3. `src/pages/admin/EditCarRental.tsx`** - Edit car form wrapper
- Fetch car by slug
- Loading and not-found states
- Renders CarForm in edit mode

**4. `src/pages/admin/CarCategories.tsx`** - Car category management
- Similar to ServiceCategories page
- Create/Edit/Delete categories with icon selection

**5. `src/components/admin/CarForm.tsx`** - Comprehensive car form
- Basic info: Title, Brand, Model, Year, Slug
- Pricing: Daily, Weekly, Monthly rates, Deposit
- Specifications: Seats, Transmission, Fuel Type
- Options: Driver available, Self-drive
- Features array with add/remove
- Requirements array (license, age, etc.)
- Image upload + Gallery
- SEO fields: Meta title, description
- Status toggles: Featured, Active

---

### Hotels Admin (4 pages)

**1. `src/pages/admin/Hotels.tsx`** - Hotel listing management
- Table: Hotel (image + name + location), Star Rating, Category, Price From, Status, Actions
- Stats: Total Hotels, Featured, 5-Star, Average Price
- Search and category/star rating filters

**2. `src/pages/admin/AddHotel.tsx`** - Add new hotel wrapper
- Renders HotelForm in create mode

**3. `src/pages/admin/EditHotel.tsx`** - Edit hotel wrapper
- Fetch by slug, loading/error states
- Renders HotelForm in edit mode

**4. `src/components/admin/HotelForm.tsx`** - Comprehensive hotel form
- Basic: Name, Slug, Category, Star Rating
- Location: Address, Latitude, Longitude
- Details: Description, Long Description
- Amenities array (Pool, WiFi, Gym, etc.)
- Highlights array
- Contact: Phone, Email
- Check-in/Check-out times
- Pricing: Price From
- Images: Main image + Gallery
- SEO fields
- Room management section (inline add rooms)

---

### Visa Services Admin (3 pages)

**1. `src/pages/admin/VisaServices.tsx`** - Visa listing management
- Table: Visa Type, Duration, Processing Time, Price, Status, Actions
- Stats: Total Visas, Express Visas, Active

**2. `src/pages/admin/AddVisaService.tsx`** - Add visa wrapper
- Renders VisaForm in create mode

**3. `src/pages/admin/EditVisaService.tsx`** - Edit visa wrapper
- Fetch by slug, renders VisaForm

**4. `src/components/admin/VisaForm.tsx`** - Comprehensive visa form
- Basic: Title, Slug, Visa Type
- Duration: Days, Validity period
- Processing: Processing time, Express option
- Pricing: Price, Original price
- Details: Description, Long description
- Requirements array (documents needed)
- Included/Excluded arrays
- FAQs editor
- Image upload
- SEO fields
- Status toggles

---

### Blog Admin (5 pages)

**1. `src/pages/admin/Blog.tsx`** - Post listing management
- Tabs: All Posts, Published, Drafts
- Table: Post (image + title + excerpt), Category, Author, Published Date, Status, Actions
- Stats: Total Posts, Published, Featured, Total Views

**2. `src/pages/admin/AddBlogPost.tsx`** - Add post wrapper
- Renders BlogPostForm in create mode

**3. `src/pages/admin/EditBlogPost.tsx`** - Edit post wrapper
- Fetch by slug, renders BlogPostForm

**4. `src/pages/admin/BlogCategories.tsx`** - Category management
- Table with CRUD for blog categories
- Similar to ServiceCategories pattern

**5. `src/components/admin/BlogPostForm.tsx`** - Comprehensive post form
- Basic: Title, Slug, Excerpt
- Content: Rich text editor for full content
- Category selection
- Tags input (multi-select/create)
- Featured image upload
- Publishing: Published/Draft toggle, Publish date
- SEO fields: Meta title, description, keywords
- Reading time (auto-calculated or manual)
- Featured toggle

---

## Phase 2: Sample/Demo Data

Insert realistic sample data to demonstrate the platform capabilities.

### Car Rentals Sample Data (6 cars)

| Car | Category | Daily Price | Transmission |
|-----|----------|-------------|--------------|
| Toyota Corolla 2024 | Economy | AED 99 | Automatic |
| Honda Accord 2024 | Sedan | AED 149 | Automatic |
| Toyota Land Cruiser 2024 | SUV | AED 299 | Automatic |
| BMW 7 Series 2024 | Luxury | AED 599 | Automatic |
| Mercedes S-Class 2024 | Luxury | AED 699 | Automatic |
| Lamborghini Urus 2024 | Supercar | AED 2,500 | Automatic |

### Hotels Sample Data (6 hotels)

| Hotel | Category | Star Rating | Price From |
|-------|----------|-------------|------------|
| Rove Dubai Marina | Budget | 3 | AED 350 |
| Hilton Dubai Creek | 4-Star | 4 | AED 550 |
| JW Marriott Marquis | 5-Star | 5 | AED 850 |
| Atlantis The Palm | Luxury | 5 | AED 1,800 |
| Burj Al Arab | Luxury | 5 | AED 5,000 |
| Address Downtown | 5-Star | 5 | AED 1,200 |

### Visa Services Sample Data (6 visas)

| Visa Type | Duration | Processing | Price |
|-----------|----------|------------|-------|
| 14-Day Tourist Visa | 14 days | 2-3 days | AED 350 |
| 30-Day Tourist Visa | 30 days | 2-3 days | AED 450 |
| 60-Day Tourist Visa | 60 days | 3-5 days | AED 650 |
| 96-Hour Transit Visa | 4 days | 24 hours | AED 150 |
| Express 30-Day Visa | 30 days | 24 hours | AED 750 |
| Multiple Entry Visa | 90 days | 5-7 days | AED 1,200 |

### Blog Posts Sample Data (4 posts)

| Title | Category | Status |
|-------|----------|--------|
| Ultimate Guide to Dubai Marina | Dubai Travel Guides | Published |
| Best Time to Visit Dubai in 2024 | Best Time to Visit | Published |
| Top 10 Must-See Attractions in Dubai | Top Attractions | Published |
| Complete UAE Visa Guide for Tourists | Visa & Travel Tips | Published |

---

## Files to Create

### Admin Pages (12 files)

| File | Purpose |
|------|---------|
| `src/pages/admin/CarRentals.tsx` | Car listing with CRUD |
| `src/pages/admin/AddCarRental.tsx` | Add car wrapper |
| `src/pages/admin/EditCarRental.tsx` | Edit car wrapper |
| `src/pages/admin/CarCategories.tsx` | Car category management |
| `src/pages/admin/Hotels.tsx` | Hotel listing with CRUD |
| `src/pages/admin/AddHotel.tsx` | Add hotel wrapper |
| `src/pages/admin/EditHotel.tsx` | Edit hotel wrapper |
| `src/pages/admin/VisaServices.tsx` | Visa listing with CRUD |
| `src/pages/admin/AddVisaService.tsx` | Add visa wrapper |
| `src/pages/admin/EditVisaService.tsx` | Edit visa wrapper |
| `src/pages/admin/Blog.tsx` | Blog post listing |
| `src/pages/admin/AddBlogPost.tsx` | Add post wrapper |
| `src/pages/admin/EditBlogPost.tsx` | Edit post wrapper |
| `src/pages/admin/BlogCategories.tsx` | Blog category management |

### Admin Form Components (4 files)

| File | Purpose |
|------|---------|
| `src/components/admin/CarForm.tsx` | Comprehensive car rental form |
| `src/components/admin/HotelForm.tsx` | Comprehensive hotel form |
| `src/components/admin/VisaForm.tsx` | Comprehensive visa form |
| `src/components/admin/BlogPostForm.tsx` | Blog post editor with rich text |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add routes for all new admin pages |

---

## Implementation Order

### Step 1: Car Rentals Admin
1. Create CarForm component with all fields
2. Create CarRentals listing page
3. Create Add/Edit wrapper pages
4. Create CarCategories management page
5. Add routes to App.tsx

### Step 2: Hotels Admin
6. Create HotelForm component
7. Create Hotels listing page
8. Create Add/Edit wrapper pages
9. Add routes to App.tsx

### Step 3: Visa Services Admin
10. Create VisaForm component
11. Create VisaServices listing page
12. Create Add/Edit wrapper pages
13. Add routes to App.tsx

### Step 4: Blog Admin
14. Create BlogPostForm component with rich text
15. Create Blog listing page with tabs
16. Create Add/Edit wrapper pages
17. Create BlogCategories management
18. Add routes to App.tsx

### Step 5: Sample Data
19. Insert car rentals demo data
20. Insert hotels demo data with sample rooms
21. Insert visa services demo data
22. Insert blog posts demo data

---

## Technical Notes

### Form Patterns

All forms follow the existing ServiceForm pattern:
- useState for form data with comprehensive initial state
- Image upload to appropriate storage bucket
- Array field management (add/remove items)
- Rich text editor for long descriptions
- SEO preview component
- Save/Cancel buttons with loading state

### Hooks Already Exist

All necessary hooks are already created:
- `useCarRentals`, `useCarCategories`, `useAdminCarRentals`, `useCreateCarRental`, etc.
- `useHotels`, `useAdminHotels`, `useCreateHotel`, etc.
- `useVisaServices`, `useAdminVisaServices`, `useCreateVisaService`, etc.
- `useBlogPosts`, `useAdminBlogPosts`, `useCreateBlogPost`, etc.

### Storage Buckets

Already created:
- `car-images` - For car photos
- `hotel-images` - For hotel photos
- `visa-images` - For visa banners
- `blog-images` - For blog post images
