
# Dubai End-to-End Service Platform - Implementation Plan

This comprehensive plan addresses the requirements for building a secure, role-based Dubai service platform with email verification, enhanced admin controls, and integrated service categories (with Yacht under Activities).

---

## Current System Analysis

### What Already Exists

| Component | Status | Notes |
|-----------|--------|-------|
| Role System | Partial | Has `admin`, `moderator`, `user` enum. Needs `manager`, `editor` roles |
| Role Management Page | Exists | `/admin/roles` - toggles roles on/off |
| Authentication | Basic | Sign in/up works, but NO email verification enforcement |
| Services (Activities) | Exists | 14 categories including "Sightseeing Cruises" (yacht-like) |
| Admin Route Protection | Bypassed in DEV | `RequireSession` component needs proper auth checks |
| Activity Logging | Exists | `activity_logs` table with RLS |
| Profiles Table | Exists | Needs `status`, `is_verified` fields |

### What Needs to Be Built

1. **Extended Role System**: Add `manager` and `editor` roles with granular permissions
2. **Email Verification Flow**: Enforce verification before account activation
3. **Enhanced RequireSession**: Proper role-based route protection
4. **Admin User Management**: Full CRUD with status/verification controls
5. **Permission Management UI**: Editable role permissions from admin
6. **Missing Service Categories**: Luxury Cars, Cabs, Visa, Helicopter (Yacht = "Sightseeing Cruises")

---

## 1. Database Schema Updates

### 1.1 Extend app_role Enum

Add two new roles to support the permission hierarchy:

```text
Current: admin, moderator, user
New:     admin, manager, editor, moderator, user
```

### 1.2 Add Profiles Status Fields

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
```

Status values: `active`, `inactive`, `suspended`

### 1.3 Create Permissions Table

New table to store granular permissions for each role:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| role | app_role | Role this permission applies to |
| resource | text | Resource name (bookings, tours, users, etc.) |
| action | text | Action (create, read, update, delete, manage) |
| allowed | boolean | Whether permission is granted |
| created_at | timestamp | Creation timestamp |

### 1.4 Add New Service Categories

Insert categories for the new service types:

| Category | Slug | Description |
|----------|------|-------------|
| Luxury Car Rentals | luxury-cars | Premium car rentals in Dubai |
| Cab & Transfers | cabs-transfers | Taxi and private transfer services |
| Helicopter Tours | helicopter-tours | Aerial experiences over Dubai |
| Visa Services | visa-services | UAE visa assistance |

Note: Yacht services will use the existing "Sightseeing Cruises" category.

---

## 2. Email Verification System

### 2.1 Authentication Flow Update

```text
Current Flow:
User signs up -> Account created -> Can log in immediately

New Flow:
User signs up -> Verification email sent -> User clicks link 
              -> email_confirmed_at set in auth.users 
              -> Can now log in
```

### 2.2 Auth Page Changes (`src/pages/Auth.tsx`)

- After signup, show "Check your email" message instead of redirecting
- On login, check if email is verified before allowing access
- Add "Resend verification email" option
- Configure Supabase to require email confirmation

### 2.3 Configure Auth Settings

Use the configure-auth tool to:
- Disable auto-confirm for email signups (require verification)
- Set email verification as mandatory

---

## 3. Role-Based Access Control (RBAC)

### 3.1 Permission Matrix

| Resource | Admin | Manager | Editor | Moderator | User |
|----------|-------|---------|--------|-----------|------|
| **Users** | CRUD + Roles | Read | - | - | Own profile |
| **Bookings** | CRUD | CRUD | Read | Read | Own bookings |
| **Activities/Tours** | CRUD | CRUD | CRUD | Read | Read |
| **Content (Pages/Blog)** | CRUD | Read | CRUD | - | Read |
| **Reviews** | CRUD | CRUD | Approve | Approve | Create |
| **Analytics** | Full | Read | - | - | - |
| **Settings** | Full | - | - | - | - |
| **Roles** | Manage | - | - | - | - |
| **Financial Data** | Full | Read | - | - | - |

### 3.2 Permission Check Hook

Create `src/hooks/usePermissions.ts`:

```typescript
interface PermissionCheck {
  hasPermission: (resource: string, action: string) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEditor: boolean;
  userRoles: string[];
  isLoading: boolean;
}
```

### 3.3 Protected Route Component

Update `src/components/admin/RequireSession.tsx`:

```typescript
interface RequireSessionProps {
  children: ReactNode;
  requiredRoles?: AppRole[];
  requiredPermission?: { resource: string; action: string };
}
```

- Check user is authenticated
- Check email is verified
- Check user has required role OR permission
- Redirect to login/access-denied as appropriate

---

## 4. Admin Panel Enhancements

### 4.1 User Management Page (`/admin/users`)

Create comprehensive user management with:

| Feature | Description |
|---------|-------------|
| User List Table | Name, email, roles, status, verified, joined date |
| Search & Filter | By name, email, role, status |
| User Actions | Edit roles, activate/deactivate, resend verification |
| Bulk Actions | Activate/deactivate multiple users |
| User Detail Modal | Full profile with activity history |

### 4.2 Enhanced Role Management (`/admin/roles`)

Extend existing page with:

| Feature | Description |
|---------|-------------|
| Permission Editor | Toggle permissions per role |
| Role Statistics | Users per role, permission counts |
| Role Templates | Quick-apply common permission sets |
| Safety Checks | Cannot remove last admin |

### 4.3 Dashboard Updates

Update `/admin` dashboard with:

- User statistics (total, verified, by role)
- Recent registrations widget
- Verification pending count

---

## 5. Frontend Route Structure

### 5.1 Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page |
| `/activities` | Services | All activities listing |
| `/activities/yacht` | Services | Redirects to sightseeing-cruises |
| `/activities/desert-safari` | Services | Category view |
| `/activities/luxury-cars` | Services | Luxury car rentals |
| `/activities/cabs-transfers` | Services | Transfer services |
| `/activities/helicopter-tours` | Services | Helicopter experiences |
| `/activities/visa-services` | Services | Visa assistance |
| `/auth` | Auth | Login/Register |
| `/auth/verify-email` | VerifyEmail | Verification pending page |

### 5.2 Protected Admin Routes

| Route | Required Role | Description |
|-------|---------------|-------------|
| `/admin` | Any admin role | Dashboard |
| `/admin/users` | admin, manager | User management |
| `/admin/roles` | admin | Role management |
| `/admin/bookings` | admin, manager | Booking management |
| `/admin/services/*` | admin, manager, editor | Activity management |
| `/admin/settings/*` | admin | System settings |
| `/admin/analytics` | admin, manager | Reports & analytics |

---

## 6. Implementation Files

### New Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/usePermissions.ts` | Permission checking hook |
| `src/hooks/useUserManagement.ts` | User CRUD operations |
| `src/pages/admin/Users.tsx` | User management page |
| `src/pages/auth/VerifyEmail.tsx` | Email verification pending page |
| `src/components/admin/UserDialog.tsx` | Edit user modal |
| `src/components/admin/PermissionEditor.tsx` | Role permissions UI |

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Auth.tsx` | Add verification check, resend email |
| `src/components/admin/RequireSession.tsx` | Add role/permission checks |
| `src/components/admin/AdminSidebar.tsx` | Add User Management nav item |
| `src/pages/admin/Roles.tsx` | Add permission editing UI |
| `src/pages/admin/Dashboard.tsx` | Add user stats widgets |
| `src/App.tsx` | Add new routes |
| `src/hooks/useUserRoles.ts` | Extend for new roles |

---

## 7. Security Considerations

### 7.1 Server-Side Validation

- All role checks via RLS policies and `has_role()` function
- Never trust client-side role storage
- Activity logging for all admin actions

### 7.2 Authentication Security

- Email verification required before login
- Verification token expiry (handled by Supabase)
- Rate limiting on auth endpoints

### 7.3 Route Protection

```text
Layer 1: RequireSession component (client-side)
Layer 2: RLS policies (server-side)
Layer 3: has_role() security definer function
```

### 7.4 Admin Activity Logging

All admin actions logged with:
- User ID and email
- Action type
- Entity affected
- Old/new data
- Timestamp
- IP address (where available)

---

## 8. UI/UX Design Guidelines

### 8.1 Theme

- Premium Dubai luxury aesthetic
- Dark navy/blue primary color (already in place)
- Gold/amber accents for CTAs
- Clean, modern typography

### 8.2 Mobile-First

- Responsive admin tables
- Touch-friendly action buttons
- Mobile navigation menu
- Floating book/WhatsApp buttons

### 8.3 CTA Elements

- "Book Now" prominent on all service cards
- WhatsApp quick contact widget
- Contact form on every page
- Live chat integration

---

## 9. Implementation Order

### Phase 1: Authentication & Security
1. Configure Supabase auth to require email verification
2. Update Auth.tsx with verification flow
3. Enhance RequireSession with proper checks
4. Add email verification page

### Phase 2: Role System Extension
1. Add new roles to app_role enum
2. Create permissions table
3. Create usePermissions hook
4. Update RLS policies for new roles

### Phase 3: Admin User Management
1. Create Users admin page
2. Create UserDialog component
3. Add user CRUD operations
4. Integrate with existing role management

### Phase 4: Permission Management
1. Create PermissionEditor component
2. Extend Roles page with permissions UI
3. Add permission templates

### Phase 5: Service Categories
1. Add new service categories (Cars, Cabs, Visa, Helicopter)
2. Update URL routing for /activities paths
3. Ensure yacht links redirect to sightseeing-cruises

---

## Summary

This plan transforms the existing platform into a comprehensive Dubai service hub with:

- **Extended RBAC**: 5 roles (Admin, Manager, Editor, Moderator, User) with granular permissions
- **Email Verification**: Mandatory before account activation
- **Full Admin User Management**: View, edit, activate, deactivate users
- **Unified Activities Structure**: All services including yacht under /activities
- **Secure Route Protection**: Server-side validation via RLS
- **Premium UI**: Luxury Dubai theme with clear CTAs

The implementation follows security best practices with server-side role validation, activity logging, and proper separation of concerns.
