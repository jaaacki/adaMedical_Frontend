'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import UsersTable from '@/components/UsersTable';
import DashboardLayout from '@/components/DashboardLayout';
import { useUsers } from '@/hooks/useUsers';
import { deleteUser } from '@/services/userService';

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const [deleteStatus, setDeleteStatus] = useState<{
    loading: boolean;
    error: string | null;
    success: string | null;
  }>({
    loading: false,
    error: null,
    success: null,
  });

  const handleDeleteUser = async (userId: number) => {
    setDeleteStatus({
      loading: true,
      error: null,
      success: null,
    });

    try {
      await deleteUser(userId);
      setDeleteStatus({
        loading: false,
        error: null,
        success: 'User deleted successfully',
      });
      // Refetch the users list to update the UI
      refetch();
    } catch (err: any) {
      setDeleteStatus({
        loading: false,
        error: err.message || 'Failed to delete user',
        success: null,
      });
    }
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
              <Link
                href="/users/new"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add User
              </Link>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading users: {error.message}
              </div>
            )}

            {deleteStatus.error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {deleteStatus.error}
              </div>
            )}

            {deleteStatus.success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {deleteStatus.success}
              </div>
            )}

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg">
              <UsersTable
                users={users}
                loading={loading}
                onDeleteUser={handleDeleteUser}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}