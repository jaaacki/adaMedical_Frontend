'use client';

import React from 'react';

interface RoleBadgeProps {
  name: string;
  className?: string;
}

export default function RoleBadge({ name, className = '' }: RoleBadgeProps) {
  // Get a consistent color based on the role name
  const getColorClass = (roleName: string) => {
    const roleNameLower = roleName.toLowerCase();
    
    if (roleNameLower === 'admin') {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    } else if (roleNameLower === 'user') {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    } else if (roleNameLower === 'sales') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    } else if (roleNameLower === 'operations') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    } else if (roleNameLower === 'accounts') {
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
    }
    
    // Default color for other roles
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <span 
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColorClass(name)} ${className}`}
    >
      {name}
    </span>
  );
}