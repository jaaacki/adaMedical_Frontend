'use client';

import React, { useState, useEffect } from 'react';
import { Role } from '@/lib';

interface RoleFormProps {
  role?: Role; // If provided, we're editing; otherwise, creating new
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function RoleForm({ role, onSubmit, onCancel, isLoading }: RoleFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }
    
    setError('');
    
    try {
      await onSubmit(name);
    } catch (err: any) {
      setError(err.message || 'Failed to save role');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <input
          type="text"
          id="roleName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter role name"
          disabled={isLoading}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
        </button>
      </div>
    </form>
  );
}