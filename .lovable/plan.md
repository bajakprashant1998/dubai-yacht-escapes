
# Admin Role Manager Feature

This plan adds a comprehensive Role Management system to the admin panel, allowing admins to manage user roles (Admin, Moderator, User) and invite new users.

---

## Overview

The feature will allow admins to:
- View all registered users with their current roles
- Assign or remove roles (admin, moderator, user)
- Search and filter users
- Add new admin/moderator users via email invitation

---

## Current System Analysis

The database already has the proper structure in place:

| Component | Status |
|-----------|--------|
| `app_role` enum | Exists: `admin`, `moderator`, `user` |
| `user_roles` table | Exists with proper schema |
| `has_role()` function | Exists (security definer) |
| RLS policies | Admins can manage all roles |

---

## Implementation Components

### 1. New Admin Page: Role Manager

**Route:** `/admin/roles`

**Features:**
- Stats cards showing: Total Users, Admins, Moderators, Regular Users
- Search bar to filter users by email/name
- Role filter dropdown
- User table with:
  - User avatar/initials
  - Email address
  - Current roles (badges)
  - Join date
  - Actions (Edit role, Remove role)
- Add role dialog for assigning roles to users

### 2. Page Layout

```text
+----------------------------------------------------------+
|                    Role Management                        |
|  Manage user roles and permissions                        |
+----------------------------------------------------------+
|                                                          |
|  +------------+  +------------+  +------------+  +------+|
|  | Total: 15  |  | Admins: 2  |  | Mods: 3    |  |Users |  |
|  +------------+  +------------+  +------------+  +------+|
|                                                          |
|  [Search users...]          [Filter: All Roles v]        |
|                                                          |
|  +------------------------------------------------------+|
|  | User               | Roles      | Joined     | Actions|
|  +------------------------------------------------------+|
|  | admin@example.com  | [Admin]    | Jan 2024   | [...]  |
|  | mod@example.com    | [Moderator]| Feb 2024   | [...]  |
|  | user@example.com   | [User]     | Mar 2024   | [...]  |
|  +------------------------------------------------------+|
|                                                          |
|  [< 1 2 3 ... >]                                         |
+----------------------------------------------------------+
```

### 3. Role Assignment Dialog

Clicking "Manage Roles" opens a dialog where admins can:
- Toggle admin role on/off
- Toggle moderator role on/off
- User role is always present (default)
- Changes are saved immediately

---

## Files to Create

| File | Description |
|------|-------------|
| `src/pages/admin/Roles.tsx` | Main role management page |
| `src/hooks/useUserRoles.ts` | Hook for fetching/mutating user roles |

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Add route for `/admin/roles` |
| `src/components/admin/AdminSidebar.tsx` | Add "Roles" nav item with Shield icon |

---

## Technical Details

### useUserRoles Hook

```typescript
interface UserWithRoles {
  id: string;
  email: string;
  created_at: string;
  roles: ('admin' | 'moderator' | 'user')[];
}

// Queries:
// 1. Fetch all users from auth.users (via profiles table)
// 2. Fetch all roles from user_roles
// 3. Join client-side to build UserWithRoles[]

// Mutations:
// - addRole(userId, role)
// - removeRole(userId, role)
```

### Database Query Strategy

Since we can't directly query `auth.users`, we'll use:
1. Query `profiles` table (has `user_id` reference)
2. Join with `user_roles` table
3. Use `supabase.auth.admin` functions if available, otherwise rely on profiles

### RLS Consideration

The existing RLS policy already allows admins to manage all roles:
```sql
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
```

This means admins can:
- SELECT all user_roles
- INSERT new roles
- UPDATE existing roles
- DELETE roles

---

## Sidebar Navigation Update

Add new nav item after "Activity Log":

```typescript
{ title: "User Roles", href: "/admin/roles", icon: Shield }
```

---

## Security Considerations

1. **Server-side validation**: All role changes are validated via RLS policies
2. **Self-demotion prevention**: Add client-side check to prevent admin from removing their own admin role
3. **Audit logging**: Log all role changes to `activity_logs` table
4. **Last admin protection**: Warn if trying to remove the last admin

---

## UI Components Used

Reusing existing components:
- `AdminLayout` - page wrapper
- `Table`, `TableRow`, `TableCell` - data display
- `Dialog` - role management modal
- `Badge` - role display
- `Switch` - toggle roles on/off
- `Avatar` - user avatars
- `Input`, `Select` - search and filter
- `TablePagination` - pagination
- `toast` - feedback messages

---

## Implementation Order

1. **Create useUserRoles hook** - Data fetching and mutations
2. **Create Roles.tsx page** - Main admin page with table and dialogs
3. **Update AdminSidebar** - Add navigation item
4. **Update App.tsx** - Add route

---

## Role Colors and Styling

| Role | Badge Color | Description |
|------|-------------|-------------|
| Admin | Red/Rose | Full system access |
| Moderator | Amber/Orange | Content management access |
| User | Blue/Secondary | Default role for all users |

---

## Summary

This implementation adds a complete role management system that:
- Integrates with the existing `app_role` enum and `user_roles` table
- Follows the established admin panel design patterns
- Provides secure role assignment via existing RLS policies
- Includes audit logging for all role changes
- Uses existing UI components for consistency

