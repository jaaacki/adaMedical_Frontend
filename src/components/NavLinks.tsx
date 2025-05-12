'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export default function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Check if the user has admin role - very important for showing admin links
  // Important: Check for both 'Admin' and 'Administrator' role names
  const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Administrator';
  
  // Check if this is an admin-only link
  const isAdminLink = href.includes('/users') || href.includes('/roles');
  
  // Don't render admin links for non-admin users
  if (isAdminLink && !isAdmin) {
    return null;
  }

  // Check if the current path matches this link
  const isActive = exact 
    ? pathname === href 
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? 'bg-primary-900 text-white'
          : 'text-gray-300 hover:bg-primary-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}