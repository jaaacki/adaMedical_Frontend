'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import RoleBadge from '@/components/RoleBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role?.name === 'Admin';

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">User Profile</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your account details and preferences
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.name}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.email}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <RoleBadge name={user?.role?.name || 'No Role'} />
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Account status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.is_active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Currency preference</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user?.currency_context || 'Not set'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Admin Quick Links Section */}
          {isAdmin && (
            <div className="bg-white shadow sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Admin Tools</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Quick links to administrative functions
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Link
                    href="/users"
                    className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      View, edit, create and remove users from the system
                    </p>
                  </Link>
                  
                  <Link
                    href="/roles"
                    className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <h3 className="text-lg font-medium text-gray-900">Role Management</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Manage roles and permissions for system users
                    </p>
                  </Link>
                  
                  {/* More admin links will go here */}
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}