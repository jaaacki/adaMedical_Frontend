// src/components/RootAppWrapper.tsx
'use client'
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'

export default function RootAppWrapper({ children }) {
  const path = usePathname() || ''

  // 1) if we’re on login (or any /auth/*) page, render children as-is
  if (path === '/login' || path.startsWith('/auth')) {
    return <>{children}</>
  }

  // 2) if we’re on your protected areas, wrap them
  if (
    path.startsWith('/dashboard') ||
    path.startsWith('/users')    ||
    path.startsWith('/roles')
  ) {
    return (
      <ProtectedRoute>
        <DashboardLayout>{children}</DashboardLayout>
      </ProtectedRoute>
    )
  }

  // 3) everything else (home, marketing pages, etc.) is unwrapped
  return <>{children}</>
}
