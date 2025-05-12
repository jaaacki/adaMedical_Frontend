'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="py-6">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}