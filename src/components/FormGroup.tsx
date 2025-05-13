// src/components/FormGroup.tsx
import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
}

export function FormGroup({ 
  children, 
  label, 
  htmlFor,
  hint,
  error
}: FormGroupProps) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      {children}
      {hint && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}