// src/components/RolesTable.tsx (Updated with new components)
import React from 'react';
import { Role } from '@/lib';
import RoleBadge from './RoleBadge';
import { TableHeader } from './TableHeader';
import { Badge } from './Badge';
import { Button } from './Button';

interface RolesTableProps {
  roles: Role[];
  loading: boolean;
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: number) => void;
}

export default function RolesTable({ roles, loading, onEditRole, onDeleteRole }: RolesTableProps) {
  // Helper function to determine if a role is protected
  const isProtectedRole = (roleName: string): boolean => {
    const protectedRoles = ['admin', 'user'];
    return protectedRoles.includes(roleName.toLowerCase());
  };

  // Handle role deletion with confirmation
  const handleDeleteClick = (role: Role) => {
    if (isProtectedRole(role.name)) {
      alert(`Cannot delete the "${role.name}" role as it is a protected system role.`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      onDeleteRole(role.id);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 py-4 px-6">
        <div className="h-8 bg-gray-200 rounded"></div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  // Empty state UI
  if (roles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-700 text-lg">No roles found.</p>
        <p className="text-secondary text-sm mt-2">Create a new role to get started.</p>
      </div>
    );
  }

  // Table with roles
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Role Name</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {roles.map((role) => {
            const isProtected = isProtectedRole(role.name);
            
            return (
              <tr key={role.id} className={`hover:bg-gray-50 ${isProtected ? 'bg-gray-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-heading">{role.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">
                    <RoleBadge name={role.name} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isProtected ? (
                    <Badge variant="info">System Role</Badge>
                  ) : (
                    <Badge variant="success">Custom Role</Badge>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditRole(role)}
                    className="text-primary-600 hover:text-primary-900 mr-4 focus:outline-none focus:underline"
                    title={isProtected ? "System roles can be edited but name changes may be restricted" : "Edit role"}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(role)}
                    className={`text-red-600 hover:text-red-900 focus:outline-none focus:underline ${
                      isProtected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isProtected}
                    title={isProtected ? "System roles cannot be deleted" : "Delete role"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}