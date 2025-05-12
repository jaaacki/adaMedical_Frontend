'use client';

import React from 'react';
import AdminRoute from '@/components/AdminRoute';
import Link from 'next/link';

export default function UsersPage() {
  // For simplicity, we'll show a placeholder for now
  return (
    <AdminRoute>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Link
            href="/dashboard/users/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add User
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500 text-center py-8">
            User management functionality will be implemented here.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This page displays the users in the system. We're now using the new app structure with proper nesting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}