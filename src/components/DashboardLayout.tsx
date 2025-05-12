// src/components/DashboardLayout.tsx
'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavLink from '@/components/NavLinks';
import Link from 'next/link';
import RoleBadge from '@/components/RoleBadge';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  
  const isAdmin = user?.role?.name === 'Admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navigation */}
      <nav className="bg-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/dashboard" className="text-white font-bold text-xl">
                  Business Ops
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink href="/dashboard" exact>
                    Dashboard
                  </NavLink>
                  
                  {/* Only show admin links to admins */}
                  {isAdmin && (
                    <>
                      <NavLink href="/users">
                        Users
                      </NavLink>
                      <NavLink href="/roles">
                        Roles
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="flex items-center">
                  <div className="text-sm text-gray-300 mr-4">
                    Signed in as <span className="font-medium text-white">{user?.email}</span>
                    {user?.role && (
                      <span className="ml-2">
                        <RoleBadge name={user.role.name} className="ml-1" />
                      </span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/dashboard" className="text-white block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </Link>
            
            {isAdmin && (
              <>
                <Link href="/users" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Users
                </Link>
                <Link href="/roles" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                  Roles
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                <div className="text-sm font-medium leading-none text-gray-400">{user?.email}</div>
                {user?.role && (
                  <div className="mt-1">
                    <RoleBadge name={user.role.name} />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={logout}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}