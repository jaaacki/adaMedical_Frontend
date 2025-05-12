// src/app/dashboard/layout.tsx
'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

/**
 * This is a Next.js App Router layout that wraps all pages 
 * under the /dashboard route with the DashboardLayout component.
 */
// export default function DashboardAppLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <DashboardLayout>
//       {children}
//     </DashboardLayout>
//   );
// }
// AFTER: src/app/dashboard/layout.tsx
export default function DashboardFolderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
