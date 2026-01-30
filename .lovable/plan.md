
# Implementation Plan: Testing, Profile Dropdown & Video Background

This plan covers testing the recently implemented features and adding the video background hero section and enhanced profile dropdown.

---

## Summary of Changes

| # | Request | Type | Scope |
|---|---------|------|-------|
| 1 | Test Invite User feature | Testing | Browser automation |
| 2 | Test Permissions tab | Testing | Browser automation |
| 3 | Test home page search | Testing | Browser automation |
| 4 | Enhanced User Profile Dropdown | Feature | Admin header UI |
| 5 | Dubai Video Background Hero | Feature | Home page enhancement |

---

## 1-3. Testing Tasks

These tests will be performed using browser automation to verify the implementations work correctly:

### Test 1: Invite User Feature
- Navigate to `/admin/users`
- Click "Invite User" button
- Verify dialog opens with email input and role checkboxes
- Test form validation

### Test 2: Permissions Tab
- Navigate to `/admin/roles`
- Switch to "Permissions" tab
- Verify permission matrix displays for all roles
- Test toggling permissions (non-admin roles)

### Test 3: Home Page Search
- Navigate to home page
- Enter "desert safari" in search
- Verify redirect to `/services?q=desert+safari`
- Confirm filtered results display

---

## 4. Enhanced User Profile Dropdown

Enhance the existing user dropdown in `AdminTopBar.tsx` with additional quick actions and user profile information.

### Current Implementation
The dropdown already has Settings and Logout options. We'll enhance it with:
- User avatar with profile image or initials
- Full name display
- Role badge
- Quick links to common actions
- Dividers for organization

### New Dropdown Structure

```text
+--------------------------------+
| 👤  Admin User                 |
|     admin@example.com          |
|     [Admin Badge]              |
+--------------------------------+
| 📊  Dashboard                  |
| 👥  User Management            |
| 📋  Bookings                   |
+--------------------------------+
| ⚙️  Settings                   |
| 🔔  Notification Preferences   |
+--------------------------------+
| 🚪  Logout                     |
+--------------------------------+
```

### File to Modify
- `src/components/admin/AdminTopBar.tsx`

### Changes
1. Add profile header section with name and email
2. Add role badge from user_roles table
3. Add quick navigation links
4. Add notification preferences link
5. Improve visual styling with proper spacing

### Code Approach
```typescript
// Fetch user profile and roles
const { data: profile } = useQuery({
  queryKey: ["admin-profile"],
  queryFn: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("user_roles").select("role").eq("user_id", user.id)
    ]);
    
    return {
      ...profileRes.data,
      email: user.email,
      roles: rolesRes.data?.map(r => r.role) || []
    };
  }
});
```

---

## 5. Dubai Video Background Hero Section

Replace the static hero image with an autoplay, muted, looping video background showcasing Dubai attractions.

### Approach Options

#### Option A: External Video URL (Recommended)
Use a free stock video URL from a CDN or video service. This avoids adding large files to the repository.

**Suggested sources:**
- Pexels (free, high-quality Dubai videos)
- Pixabay (free stock videos)
- Custom YouTube video URL converted to embed

#### Option B: Self-hosted Video
Upload a video file to the `public/assets` folder. This increases bundle size but provides reliability.

### Implementation Design

```text
+----------------------------------------------------------+
|  [Video Background - Autoplay, Muted, Loop]              |
|  ┌────────────────────────────────────────────────────┐  |
|  │  Dark overlay gradient for text readability        │  |
|  │                                                    │  |
|  │    🌟 Dubai's Premier Experiences Marketplace      │  |
|  │                                                    │  |
|  │    Discover Dubai's                               │  |
|  │    Best Adventures                                │  |
|  │                                                    │  |
|  │    [Search Bar]                                   │  |
|  │                                                    │  |
|  │    [Explore Experiences] [View All Activities]    │  |
|  └────────────────────────────────────────────────────┘  |
|  Fallback image loads if video fails                     |
+----------------------------------------------------------+
```

### Video Requirements
- Format: MP4 (best compatibility)
- Resolution: 1920x1080 or 4K
- Duration: 10-30 seconds (loop)
- File size: 5-15MB optimized
- Content: Dubai skyline, Burj Khalifa, desert, yacht, etc.

### File to Modify
- `src/components/home/HeroSection.tsx`

### Code Implementation
```typescript
// Video background component
<motion.div className="absolute inset-0" style={{ y: backgroundY }}>
  {/* Video Background */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover scale-110"
    poster={heroBurjKhalifa}
  >
    <source src="/assets/dubai-hero-video.mp4" type="video/mp4" />
  </video>
  
  {/* Fallback Image (if video fails) */}
  <OptimizedImage
    src={heroBurjKhalifa}
    alt="Dubai experiences"
    priority
    objectFit="cover"
    containerClassName="w-full h-full scale-110 video-fallback"
  />
  
  {/* Overlay gradients */}
  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/30" />
  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
</motion.div>
```

### Handling Video Loading States
1. Show poster image (existing hero image) while video loads
2. Graceful fallback if video fails to load
3. Respect user's `prefers-reduced-motion` setting
4. Pause video when not visible (Intersection Observer)

### Performance Considerations
- Use `loading="lazy"` behavior for non-critical content
- Implement video preload strategy (`preload="metadata"` or `preload="none"`)
- Consider connection speed detection to skip video on slow connections

---

## Implementation Order

### Phase 1: Testing (Browser Automation)
1. Test User Management invite feature at /admin/users
2. Test Permissions tab at /admin/roles
3. Test home page search flow

### Phase 2: Enhanced Profile Dropdown
4. Create useAdminProfile hook for fetching profile + roles
5. Update AdminTopBar with enhanced dropdown
6. Add quick navigation links
7. Style with role badges

### Phase 3: Video Background
8. Add video URL configuration (or upload video)
9. Update HeroSection with video element
10. Add fallback handling
11. Implement reduced-motion support

---

## Technical Details

### Files to Create
| File | Purpose |
|------|---------|
| `public/assets/dubai-hero-video.mp4` | Video file (if self-hosted) |

### Files to Modify
| File | Changes |
|------|---------|
| `src/components/admin/AdminTopBar.tsx` | Enhanced profile dropdown with name, roles, quick links |
| `src/components/home/HeroSection.tsx` | Video background with fallback image |

### Dependencies
No new dependencies required. Using native HTML5 video element.

### Video Source Options
For the video, we have several options:

**Free Stock Video Sources:**
1. **Pexels** - Search "Dubai aerial" or "Dubai skyline"
2. **Pixabay** - Search "Dubai 4k"
3. **Coverr** - Premium-looking free videos

**Example URLs that could work:**
- Videos should show iconic Dubai landmarks
- Drone/aerial footage works best
- Sunset/night shots add luxury feel

### CSS for Video Background
```css
.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-fallback {
  display: none;
}

.hero-video:not([data-loaded="true"]) + .video-fallback {
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .hero-video {
    display: none;
  }
  .video-fallback {
    display: block;
  }
}
```

---

## User Experience Considerations

### Video Background
- Video autoplays muted (required by browsers)
- No play button visible - seamless background
- Parallax effect maintained with video
- Overlay ensures text remains readable
- Mobile devices get optimized experience

### Profile Dropdown
- Shows full user context at a glance
- Quick access to frequently used pages
- Clear role indication for permissions awareness
- Consistent with existing design language
