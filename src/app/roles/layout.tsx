// src/app/roles/layout.tsx
'use client';

import React from 'react';
import AdminRoute from '@/components/AdminRoute';

/**
 * This is a Next.js App Router layout that wraps all pages 
 * under the /roles route with the AdminRoute protection.
 * Note that we don't need to wrap with DashboardLayout again
 * as the /dashboard/layout.tsx will already do that.
 */
export default function RolesLayout({
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