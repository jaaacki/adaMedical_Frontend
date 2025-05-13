// src/components/TableHeader.tsx
import React from 'react';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <th className={`table-header ${className}`}>
      {children}
    </th>
  );
}