'use client';

import React from 'react';
import AdminRoute from '@/components/AdminRoute';

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  // This layout ensures only admins can access the users pages
  // The AdminRoute component handles the access control check
  return <AdminRoute>{children}</AdminRoute>;
}