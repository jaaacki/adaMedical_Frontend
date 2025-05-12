'use client';

import React from 'react';
import AdminRoute from '@/components/AdminRoute';

/**
 * This layout ensures that only admin users can access the roles management pages
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