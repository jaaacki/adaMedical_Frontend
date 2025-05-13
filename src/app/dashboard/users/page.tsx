'use client';

import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { deleteUser } from '@/services/userService';
import UsersTable from '@/components/UsersTable';
import Link from 'next/link';

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      refetch(); // Refresh the users list after deletion
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Link
          href="/dashboard/users/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add User
        </Link>
      </div>
      
      {/* Error display */}
      {(error || deleteError) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error?.message || deleteError}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <UsersTable 
          users={users} 
          loading={loading} 
          onDeleteUser={handleDeleteUser} 
        />
      </div>
    </div>
  );
}