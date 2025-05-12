'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import DashboardLayout from '@/components/DashboardLayout';

export default function RolesPage() {
  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Role Management</h1>
            
            {/* Role management content will go here */}
            <div className="bg-white shadow rounded-lg p-6">
              <p>Role management functionality will be implemented here.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}