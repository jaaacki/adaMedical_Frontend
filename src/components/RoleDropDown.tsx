'use client';

import React, { useState, useEffect } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { Role } from '@/lib';

interface RoleDropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function RoleDropdown({
  value,
  onChange,
  name = 'role_id',
  id = 'role_id',
  className = '',
  required = false,
  disabled = false,
}: RoleDropdownProps) {
  const { roles, loading, error } = useRoles();
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setLoadingError('Failed to load roles. Please try again later.');
    }
  }, [error]);

  return (
    <div>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        required={required}
        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className}`}
      >
        <option value="">No Role</option>
        {loading ? (
          <option disabled>Loading roles...</option>
        ) : (
          roles.map((role: Role) => (
            <option key={role.id} value={role.id.toString()}>
              {role.name}
            </option>
          ))
        )}
      </select>
      {loadingError && <p className="mt-1 text-sm text-red-600">{loadingError}</p>}
    </div>
  );
}