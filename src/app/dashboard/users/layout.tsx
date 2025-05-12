// src/app/users/layout.tsx
'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

/**
 * This is a Next.js App Router layout that wraps all pages 
 * under the /users route with the AdminRoute protection.
 * Note that we don't need to wrap with DashboardLayout again
 * as the /dashboard/layout.tsx will already do that.
 */
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRoute>
      {children}
    </AdminRoute>
  );
}