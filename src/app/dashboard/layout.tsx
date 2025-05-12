// src/app/dashboard/layout.tsx
'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * This is a Next.js App Router layout that wraps all pages 
 * under the /dashboard route with the DashboardLayout component.
 */
export default function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}