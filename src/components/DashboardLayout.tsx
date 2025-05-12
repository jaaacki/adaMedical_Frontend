'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import NavLink from '@/components/NavLinks';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  
  // Fix: Account for the typo in the role name "Admininstrator" (with an extra "i")
  const isAdmin = user?.role?.name === 'Admin' || 
                  user?.role?.name === 'Administrator' || 
                  user?.role?.name === 'Admininstrator';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Main Navigation */}
            <div className="flex items-center">
              <Link href="/dashboard" className="text-white font-bold text-xl">
                Business Ops
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink href="/dashboard" exact>
                  Dashboard
                </NavLink>
                
                {/* Admin links - NavLink component will handle the visibility */}
                <NavLink href="/dashboard/users">
                  Users
                </NavLink>
                <NavLink href="/dashboard/roles">
                  Roles
                </NavLink>
              </div>
            </div>
            
            {/* User info and Logout */}
            <div className="flex items-center">
              <div className="text-sm text-gray-300 mr-4">
                Signed in as <span className="font-medium text-white">{user?.email}</span>
                {user?.role?.name && (
                  <span className="ml-2 bg-indigo-900 px-2 py-1 rounded text-xs">
                    {user.role.name}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="bg-indigo-800 hover:bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}