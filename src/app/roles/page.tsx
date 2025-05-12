'use client';

import React, { useState } from 'react';
import AdminRoute from '@/components/AdminRoute';
import DashboardLayout from '@/components/DashboardLayout';
import RolesTable from '@/components/RolesTable';
import RoleForm from '@/components/RoleForm';
import { useRoles } from '@/hooks/useRoles';
import { createRole, updateRole, deleteRole as deleteRoleService } from '@/services/roleService';
import { Role } from '@/lib';

enum FormMode {
  NONE,
  CREATE,
  EDIT
}

export default function RolesPage() {
  const { roles, loading, error, refetch } = useRoles();
  const [formMode, setFormMode] = useState<FormMode>(FormMode.NONE);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleCreateRole = async (name: string) => {
    setFormLoading(true);
    try {
      await createRole(name);
      setFormMode(FormMode.NONE);
      refetch();
      setStatusMessage({
        type: 'success',
        message: 'Role created successfully'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create role'
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateRole = async (name: string) => {
    if (!currentRole) return;
    
    setFormLoading(true);
    try {
      await updateRole(currentRole.id, name);
      setFormMode(FormMode.NONE);
      setCurrentRole(null);
      refetch();
      setStatusMessage({
        type: 'success',
        message: 'Role updated successfully'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update role'
      });
      // Don't close the form on error so user can try again
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    setFormMode(FormMode.EDIT);
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      await deleteRoleService(roleId);
      refetch();
      setStatusMessage({
        type: 'success',
        message: 'Role deleted successfully'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        message: err.message || 'Failed to delete role'
      });
    }
  };

  const cancelForm = () => {
    setFormMode(FormMode.NONE);
    setCurrentRole(null);
  };

  return (
    <AdminRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
              {formMode === FormMode.NONE && (
                <button
                  onClick={() => setFormMode(FormMode.CREATE)}
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
                  Add Role
                </button>
              )}
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                Error loading roles: {error.message}
              </div>
            )}

            {statusMessage && (
              <div
                className={`mb-4 p-4 ${
                  statusMessage.type === 'success'
                    ? 'bg-green-100 border-green-400 text-green-700'
                    : 'bg-red-100 border-red-400 text-red-700'
                } rounded border`}
              >
                {statusMessage.message}
              </div>
            )}

            {/* Role Form */}
            {formMode !== FormMode.NONE && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {formMode === FormMode.CREATE ? 'Create New Role' : 'Edit Role'}
                </h2>
                <RoleForm
                  role={currentRole || undefined}
                  onSubmit={formMode === FormMode.CREATE ? handleCreateRole : handleUpdateRole}
                  onCancel={cancelForm}
                  isLoading={formLoading}
                />
              </div>
            )}

            {/* Roles Table */}
            <div className="bg-white shadow rounded-lg">
              <RolesTable
                roles={roles}
                loading={loading}
                onEditRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AdminRoute>
  );
}