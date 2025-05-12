# Migration Guide: Restructured Frontend

This guide outlines the changes made to restructure the frontend application to follow a cleaner, more organized Next.js app directory structure.

## Directory Structure Changes

The application has been restructured to follow this pattern:

```
src/app
├─ layout.tsx                 ← root: AuthProviderWrapper + Global CSS
├─ middleware.ts              ← server-side redirect for protected routes
│
├─ page.tsx                   ← public home
├─ auth/                      ← public auth pages
│  ├─ login/
│  │  └─ page.tsx
│  └─ google/
│     └─ callback/
│        └─ page.tsx
│
└─ dashboard/                 ← protected area (nav + guard)
   ├─ layout.tsx              ← wraps in ProtectedRoute + DashboardLayout
   ├─ page.tsx                ← /dashboard home
   │
   ├─ users/                  ← admin section
   │  ├─ layout.tsx           ← wraps in AdminRoute
   │  ├─ page.tsx             ← /dashboard/users
   │  ├─ new/
   │  │  └─ page.tsx
   │  └─ edit/
   │     └─ [id]/
   │        └─ page.tsx
   │
   └─ roles/                  ← admin section
      ├─ layout.tsx           ← wraps in AdminRoute
      └─ page.tsx             ← /dashboard/roles
```

## Key Changes

1. **Route Structure**:
   - All admin pages moved under `/dashboard` namespace
   - Authentication pages consolidated under `/auth`
   - Better use of Next.js App Router layout nesting

2. **Authentication Flow**:
   - Added middleware for route protection
   - Improved login redirect handling with return URLs
   - Updated Google OAuth flow with better redirect support

3. **UI Components**:
   - Updated navigation paths in links and components
   - Improved layout structure with proper nesting
   - Enhanced route protection with role-based guards

## Migration Steps for Existing Code

1. **Update Import Paths**:
   If you've created custom components that reference the old paths, update imports to reflect the new structure.

2. **Update Route References**:
   Change any hardcoded routes in your code:
   - `/users` → `/dashboard/users`
   - `/roles` → `/dashboard/roles`
   - `/login` → `/auth/login`

3. **Authentication Changes**:
   - JWT tokens are still stored in localStorage
   - The auth context provider now supports redirect URLs

4. **Component Updates**:
   - `NavLink` component now handles nested routes better
   - `ProtectedRoute` and `AdminRoute` handle redirects with return paths

## Testing Your Changes

After implementing these changes, you should test:

1. Public routes (`/` and `/auth/login`)
2. Authentication flow (including Google SSO)
3. Protected route access and redirects
4. Admin-only route protection
5. All CRUD operations on users and roles

## Troubleshooting

- If routes aren't working, check that you're using the updated paths
- Authentication issues may be related to token handling in the updated context
- Remember that the dashboard layout is now applied at the `/dashboard` level