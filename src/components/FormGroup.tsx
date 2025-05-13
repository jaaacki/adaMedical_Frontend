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
    <div className="form-group">
      {label && (
        <label htmlFor={htmlFor} className="block">
          {label}
        </label>
      )}
      {children}
      {hint && (
        <p className="form-hint">{hint}</p>
      )}
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}