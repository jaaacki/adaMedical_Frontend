'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = user?.role?.name === 'Admin' || user?.role?.name === 'Administrator';

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="bg-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Logo and desktop menu */}
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-white font-bold text-xl">
                Business Ops
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className={`${
                    isActive('/dashboard')
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Dashboard
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      href="/dashboard/users"
                      className={`${
                        isActive('/dashboard/users')
                          ? 'bg-indigo-800 text-white'
                          : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Users
                    </Link>

                    <Link
                      href="/dashboard/roles"
                      className={`${
                        isActive('/dashboard/roles')
                          ? 'bg-indigo-800 text-white'
                          : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Roles
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User info and logout */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="hidden md:block">
              <span className="text-indigo-200 mr-2">
                Signed in as <span className="text-white font-medium">{user?.email}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="bg-indigo-800 p-1 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white ml-3 px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`} 
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className={`${
              isActive('/dashboard')
                ? 'bg-indigo-800 text-white'
                : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
            } block px-3 py-2 rounded-md text-base font-medium`}
          >
            Dashboard
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/dashboard/users"
                className={`${
                  isActive('/dashboard/users')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                Users
              </Link>

              <Link
                href="/dashboard/roles"
                className={`${
                  isActive('/dashboard/roles')
                    ? 'bg-indigo-800 text-white'
                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                Roles
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}