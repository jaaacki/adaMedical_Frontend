'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role?.name === 'Admin';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Business Operations Platform</h1>
        <p className="text-gray-600 mb-4">
          Your integrated solution for managing business operations, users, and system configurations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user?.name || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <div className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {user?.role?.name || 'No Role'}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            {user?.is_active ? (
              <div className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </div>
            ) : (
              <div className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Inactive
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Tools Section */}
      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Management Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Create, edit, and manage users in the system. Assign roles and set permissions.
                </p>
                <Link 
                  href="/dashboard/users" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Manage Users
                </Link>
              </div>
            </div>

            {/* Role Management Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Role Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Define and configure roles with specific permissions for various system functions.
                </p>
                <Link 
                  href="/dashboard/roles" 
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
                >
                  Manage Roles
                </Link>
              </div>
            </div>

            {/* System Settings Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Configure global system settings, preferences, and behavior.
                </p>
                <button 
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded cursor-not-allowed opacity-50"
                  disabled
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm text-center">Edit Profile</span>
          </Link>
          
          <button
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            onClick={() => alert('Documentation coming soon!')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm text-center">Documentation</span>
          </button>
          
          <button
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
            onClick={() => alert('Support system coming soon!')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-sm text-center">Get Support</span>
          </button>
          
          <button
            className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50"
            onClick={() => confirm('Do you want to logout?') && document.getElementById('logout-button')?.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm text-center">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}