

# Unified Theme Enhancement Plan

## Overview
Standardize and elevate the visual language across 8 key areas to create a cohesive, premium luxury experience. The current design has inconsistencies: some pages have rich hero sections while others are plain, animation patterns vary, and the chat widget needs polish. This plan brings everything into alignment.

## Design System Principles
- **Hero sections**: Every page gets a full-width gradient hero with the dark navy (`bg-primary`) background, decorative blur orbs, and staggered entrance animations
- **Section badges**: Consistent pill-style badges (`bg-secondary/10 text-secondary rounded-full`) before section headings
- **Cards**: Solid `bg-card` backgrounds, `border-border`, `rounded-2xl`, hover lift (`hover:-translate-y-1 hover:shadow-xl`)
- **Animations**: Framer Motion `whileInView` for scroll reveals, staggered children, spring-based hovers
- **Colors**: Navy primary, bright blue secondary, solid backgrounds (no transparency on content containers)

---

## 1. Home Page

**Current state**: Already the most polished page. Minor refinements needed.

**Changes**:
- **RecentlyViewedSection**: Add section badge and entrance animation to match ValuePillars/QuickServices pattern
- **PartnersStrip**: Add a subtle top border separator and slightly larger text for partner names
- **Consistent spacing**: Normalize all section `py-` values to `py-20` or `py-24` for rhythm

**Files**: `src/components/home/RecentlyViewedSection.tsx`, `src/components/home/PartnersStrip.tsx`

---

## 2. Services Page (`/services`)

**Current state**: Has a hero section but it's simpler than other pages -- no decorative elements or animations.

**Changes**:
- **Hero enhancement**: Add decorative blur orbs, staggered Framer Motion entrance for badge/title/description, and a subtle floating particle effect
- **Category tabs**: Add smooth scroll indicator animation and active tab transition (similar to ValuePillars tab animation with `layoutId`)
- **Empty state**: Add entrance animation

**Files**: `src/pages/Services.tsx`

---

## 3. Combo Packages Page (`/combo-packages`)

**Current state**: Light gradient hero (`from-primary/10`), minimal styling.

**Changes**:
- **Hero redesign**: Switch to full dark navy hero (`bg-primary`) matching Services and Contact pages, with decorative blur orbs and animated sparkle elements
- **Badge/title/description**: Add staggered Framer Motion entrance animations
- **Filter section**: Add a subtle card-style container with border
- **Results count badge**: Add next to the filter area

**Files**: `src/pages/ComboPackages.tsx`

---

## 4. Car Rentals Page (`/car-rentals`)

**Current state**: No hero section at all -- just plain text header on a `bg-muted/30` background.

**Changes**:
- **Add proper hero section**: Dark navy gradient hero with title, description, badge ("Premium Fleet"), and stats (vehicle count, categories)
- **Entrance animations**: Staggered reveal for hero content
- **Toolbar card**: Already has card styling -- add subtle entrance animation
- **Consistent empty state**: Match the animated empty state pattern

**Files**: `src/pages/CarRentals.tsx`

---

## 5. Hotels Page (`/hotels`)

**Current state**: Same plain header as Car Rentals -- no hero section.

**Changes**:
- **Add proper hero section**: Dark navy gradient hero with title, description, badge ("Luxury Stays"), star rating display, and property count
- **Entrance animations**: Staggered reveal for hero content
- **Toolbar card**: Add subtle entrance animation
- **Consistent empty state**: Match animated pattern

**Files**: `src/pages/Hotels.tsx`

---

## 6. Blog Page (`/blog`)

**Current state**: Simple centered header with icon, no hero background.

**Changes**:
- **Hero section upgrade**: Add dark navy gradient background with decorative elements, animated badge, and staggered text entrance
- **Blog cards grid**: Add staggered entrance animation for cards
- **Sidebar**: Add subtle card styling consistency

**Files**: `src/pages/Blog.tsx`

---

## 7. Contact Page (`/contact`)

**Current state**: Already well-designed with hero, cards, form, FAQ. Some minor polish needed.

**Changes**:
- **Hero**: Add decorative floating blur orbs (matching CTA section pattern) for more visual depth
- **Contact cards**: Add subtle gradient accent on hover (like QuickServices cards)
- **Map section**: Add section header with badge for consistency
- **FAQ section**: Add hover highlight on accordion items

**Files**: `src/pages/Contact.tsx`

---

## 8. Chat Widget Enhancement

**Current state**: Functional but lacks visual polish in the message area and lead form.

**Changes to ChatWindow**:
- **Messages area**: Replace transparent gradient background (`from-background/50`) with solid `bg-background`
- **Status banners**: Refine styling with rounded pill badges

**Changes to ChatHeader**:
- Fine -- already premium

**Changes to ChatMessage**:
- **Bot messages**: Add a subtle company avatar with "BT" initials instead of generic Bot icon
- **Message timestamps**: Improve spacing and alignment

**Changes to ChatInput**:
- Replace transparent background (`from-card to-card/80`) with solid `bg-card`
- Add "Powered by Betterview" micro-text at bottom

**Changes to QuickReplyButtons**:
- Replace transparent gradient background with solid `bg-muted/50`
- Add category-colored dot indicators next to each quick reply

**Changes to LeadCaptureForm**:
- Add a header icon (sparkle/gift) and improved description
- Style the form container with a secondary accent border-top
- Add entrance animation

**Files**: `src/components/chat/ChatWindow.tsx`, `src/components/chat/ChatMessage.tsx`, `src/components/chat/ChatInput.tsx`, `src/components/chat/QuickReplyButtons.tsx`, `src/components/chat/LeadCaptureForm.tsx`

---

## Technical Details

### Files to modify (14 files total):
1. `src/components/home/RecentlyViewedSection.tsx` -- badge, animation
2. `src/components/home/PartnersStrip.tsx` -- border, text size
3. `src/pages/Services.tsx` -- hero enhancement
4. `src/pages/ComboPackages.tsx` -- full hero redesign
5. `src/pages/CarRentals.tsx` -- add hero section
6. `src/pages/Hotels.tsx` -- add hero section
7. `src/pages/Blog.tsx` -- hero upgrade
8. `src/pages/Contact.tsx` -- decorative elements, hover effects
9. `src/components/chat/ChatWindow.tsx` -- solid backgrounds
10. `src/components/chat/ChatMessage.tsx` -- avatar refinement
11. `src/components/chat/ChatInput.tsx` -- solid background, branding
12. `src/components/chat/QuickReplyButtons.tsx` -- solid background, dots
13. `src/components/chat/LeadCaptureForm.tsx` -- header, animation, accent border

### No new dependencies required
All enhancements use existing Framer Motion, Tailwind, and Lucide icons.

