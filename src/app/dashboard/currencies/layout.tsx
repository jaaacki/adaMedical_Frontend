'use client';

import React from 'react';
import AdminRoute from '@/components/AdminRoute';

export default function CurrenciesLayout({ children }: { children: React.ReactNode }) {
  // This layout ensures only admins can access the currencies pages
  // The AdminRoute component handles the access control check
  return <AdminRoute>{children}</AdminRoute>;
}