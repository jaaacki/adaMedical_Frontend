// src/components/Button.tsx
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary',
  className = '',
  type = 'button',
  onClick,
  disabled = false
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}