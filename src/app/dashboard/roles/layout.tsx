'use client';

import React from 'react';
import AdminRoute from '@/components/AdminRoute';

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  // This layout ensures only admins can access the roles pages
  // The AdminRoute component handles the access control check
  return <AdminRoute>{children}</AdminRoute>;
}