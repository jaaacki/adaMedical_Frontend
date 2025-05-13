// src/components/TableHeader.tsx
import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function TableHeader({ 
  children, 
  className = '',
  align = 'left'
}: TableHeaderProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  return (
    <th className={`px-6 py-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${alignClasses[align]} ${className}`}>
      {children}
    </th>
  );
}