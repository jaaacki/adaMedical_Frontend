'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NavLink from '@/components/NavLinks';
import Link from 'next/link';

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
                  
                  {/* More menu items will go here */}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="flex items-center">
                  <div className="text-sm text-gray-300 mr-4">
                    Signed in as <span className="font-medium text-white">{user?.email}</span>
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
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}