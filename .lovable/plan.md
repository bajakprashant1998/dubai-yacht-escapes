
# Add TourForm Features to Service Add/Edit Pages

This plan will enhance the `/admin/services/add` page to match the functionality and UX of the `/admin/tours/add` page by creating a reusable `ServiceForm` component with all the advanced features.

---

## Overview

The current AddService page has basic functionality with tabs, but it's missing several key features from TourForm:

| Feature | TourForm | Current AddService | To Add |
|---------|----------|-------------------|--------|
| Image Upload (file) | Yes | URL input only | Yes |
| Gallery Upload (multiple) | Yes | Not present | Yes |
| Itinerary Editor | Yes | Not present | Yes |
| FAQ Editor | Yes | Not present | Yes |
| RichTextEditor | Yes | Plain textarea | Yes |
| SEO Preview | Yes | Not present | Yes |
| Character Counter | Yes | Not present | Yes |
| Auto-suggest SEO | Yes | Not present | Yes |
| Location Selector | Yes | Not present | Yes |
| Sidebar Layout | Yes | Tabs only | Yes |

---

## Implementation Approach

### Strategy: Create ServiceForm Component

Similar to TourForm, create a dedicated `ServiceForm` component that can be used for both create and edit modes. This follows the existing pattern in the codebase.

---

## Technical Details

### 1. Create ServiceForm Component

**File:** `src/components/admin/ServiceForm.tsx`

**Features to include:**

```text
+---------------------------------------------------+
|                 ServiceForm Layout                 |
+---------------------------------------------------+
|                                                   |
|  ┌─────────────────────────┐  ┌───────────────┐  |
|  │    Main Content (2/3)   │  │ Sidebar (1/3) │  |
|  │                         │  │               │  |
|  │  ┌───────────────────┐  │  │ ┌───────────┐ │  |
|  │  │ Basic Information │  │  │ │  Publish  │ │  |
|  │  │ - Title / Slug    │  │  │ │ - Active  │ │  |
|  │  │ - Subtitle        │  │  │ │ - Featured│ │  |
|  │  │ - RichText Desc.  │  │  │ │ - Buttons │ │  |
|  │  └───────────────────┘  │  │ └───────────┘ │  |
|  │                         │  │               │  |
|  │  ┌───────────────────┐  │  │ ┌───────────┐ │  |
|  │  │ Pricing & Details │  │  │ │Main Image │ │  |
|  │  │ - Price/Original  │  │  │ │ (Upload)  │ │  |
|  │  │ - Pricing Type    │  │  │ │ - Preview │ │  |
|  │  │ - Duration        │  │  │ │ - Alt Text│ │  |
|  │  │ - Category        │  │  │ └───────────┘ │  |
|  │  │ - Location        │  │  │               │  |
|  │  │ - Participants    │  │  │ ┌───────────┐ │  |
|  │  └───────────────────┘  │  │ │  Gallery  │ │  |
|  │                         │  │ │ (Upload)  │ │  |
|  │  ┌───────────────────┐  │  │ │ - Grid    │ │  |
|  │  │    Highlights     │  │  │ └───────────┘ │  |
|  │  └───────────────────┘  │  │               │  |
|  │                         │  └───────────────┘  |
|  │  ┌───────────────────┐  │                     |
|  │  │ Included/Excluded │  │                     |
|  │  │ (2 column grid)   │  │                     |
|  │  └───────────────────┘  │                     |
|  │                         │                     |
|  │  ┌───────────────────┐  │                     |
|  │  │    Itinerary      │  │                     |
|  │  │  (ItineraryEditor)│  │                     |
|  │  └───────────────────┘  │                     |
|  │                         │                     |
|  │  ┌───────────────────┐  │                     |
|  │  │      FAQs         │  │                     |
|  │  │   (FAQEditor)     │  │                     |
|  │  └───────────────────┘  │                     |
|  │                         │                     |
|  │  ┌───────────────────┐  │                     |
|  │  │   SEO Settings    │  │                     |
|  │  │ - Meta Title      │  │                     |
|  │  │ - Meta Desc       │  │                     |
|  │  │ - Keywords        │  │                     |
|  │  │ - SEOPreview      │  │                     |
|  │  └───────────────────┘  │                     |
|  └─────────────────────────┘                     |
+---------------------------------------------------+
```

**Key features:**

1. **Image Upload System**
   - Hidden file input with ref
   - Upload to Supabase Storage bucket `service-images`
   - Main image with preview, change, remove buttons
   - Gallery with multi-file upload
   - Image alt text with auto-suggest

2. **RichTextEditor Integration**
   - Replace plain Textarea with RichTextEditor for descriptions
   - Markdown toolbar with formatting buttons
   - Preview mode toggle
   - Content templates (can be customized for services)

3. **Itinerary Editor**
   - Reuse existing `ItineraryEditor` component
   - Time + Activity pairs
   - Add/remove functionality

4. **FAQ Editor**
   - Reuse existing `FAQEditor` component
   - Accordion-based Q&A management

5. **SEO Enhancements**
   - CharacterCounter for meta fields
   - Auto-suggest buttons for meta title/description
   - SEOPreview component showing Google result

6. **Location Selector**
   - Use `useActiveLocations` hook
   - Dropdown with MapPin icons

### 2. Update Database Schema

The services table needs additional columns:

```sql
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_alt text;
ALTER TABLE services ADD COLUMN IF NOT EXISTS itinerary jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS location text;
```

### 3. Update Service Mapper

Add new fields to the Service interface and mapper:

```typescript
// Add to Service interface:
imageAlt: string | null;
itinerary: ItineraryItem[];
faqs: FAQItem[];
location: string | null;

// Update mapServiceFromRow to include these
```

### 4. Update Hooks

Update `useCreateService` and `useUpdateService` to handle new fields:
- itinerary (jsonb)
- faqs (jsonb)
- image_alt
- location

### 5. Create Storage Bucket

Ensure `service-images` storage bucket exists with public access (similar to `tour-images`).

### 6. Update AddService Page

Simplify to use the new ServiceForm component:

```tsx
const AddService = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/services">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Service</h1>
            <p className="text-muted-foreground">Create a new activity or experience</p>
          </div>
        </div>
        <ServiceForm mode="create" />
      </div>
    </AdminLayout>
  );
};
```

### 7. Update EditService Page

Update to use ServiceForm in edit mode:

```tsx
<ServiceForm mode="edit" service={service} />
```

---

## Files to Create

| File | Description |
|------|-------------|
| `src/components/admin/ServiceForm.tsx` | Main reusable form component |

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/admin/AddService.tsx` | Simplify to use ServiceForm |
| `src/pages/admin/EditService.tsx` | Update to use ServiceForm |
| `src/lib/serviceMapper.ts` | Add new fields to interface and mapper |
| `src/hooks/useServices.ts` | Update create/update mutations for new fields |

## Database Changes

| Change | SQL |
|--------|-----|
| Add image_alt column | `ALTER TABLE services ADD COLUMN image_alt text;` |
| Add itinerary column | `ALTER TABLE services ADD COLUMN itinerary jsonb;` |
| Add faqs column | `ALTER TABLE services ADD COLUMN faqs jsonb;` |
| Add location column | `ALTER TABLE services ADD COLUMN location text;` |
| Create storage bucket | `INSERT INTO storage.buckets...` |

---

## Implementation Order

1. **Database Migration** - Add new columns to services table
2. **Storage Bucket** - Create service-images bucket
3. **Service Mapper** - Update interface and mapper function
4. **useServices Hook** - Update mutations for new fields
5. **ServiceForm Component** - Create the main form component
6. **AddService Page** - Simplify to use ServiceForm
7. **EditService Page** - Update to use ServiceForm

---

## Component Reuse

The following existing components will be reused:

- `ItineraryEditor` - Time-based activity editor
- `FAQEditor` - Q&A accordion editor
- `RichTextEditor` - Markdown editor with toolbar
- `SEOPreview` - Google search result preview
- `CharacterCounter` - SEO field length indicator
- `KeywordsInput` - Tag-style keyword input

This ensures consistency with the tour form UX and reduces code duplication.

