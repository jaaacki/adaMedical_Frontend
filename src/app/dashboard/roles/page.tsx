'use client';

import React, { useState } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { createRole, updateRole } from '@/services/roleService';
import RolesTable from '@/components/RolesTable';
import RoleForm from '@/components/RoleForm';
import { Role } from '@/lib';

export default function RolesPage() {
  const { roles, loading, error, refetch, deleteRole } = useRoles();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle opening the form for creating a new role
  const handleAddRole = () => {
    setEditingRole(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Handle opening the form for editing an existing role
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormError(null);
    setIsFormOpen(true);
  };

  // Handle form submission for both create and edit
  const handleSubmitRole = async (name: string) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      if (editingRole) {
        // Updating existing role
        await updateRole(editingRole.id, name);
      } else {
        // Creating new role
        await createRole(name);
      }
      
      refetch(); // Refresh the roles list
      setIsFormOpen(false); // Close the form
    } catch (err: any) {
      setFormError(err.message || 'Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <button
          onClick={handleAddRole}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Role
        </button>
      </div>
      
      {/* Form for creating/editing roles */}
      {isFormOpen && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Role'}
          </h2>
          
          <RoleForm
            role={editingRole || undefined}
            onSubmit={handleSubmitRole}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
          
          {formError && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {formError}
            </div>
          )}
        </div>
      )}
      
      {/* Error display for fetch/delete errors */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <RolesTable 
          roles={roles}
          loading={loading}
          onEditRole={handleEditRole}
          onDeleteRole={deleteRole}
        />
      </div>
    </div>
  );
}