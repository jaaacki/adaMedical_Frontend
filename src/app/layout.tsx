// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AuthProviderWrapper from '@/components/AuthProviderWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Business Operations Platform',
  description: 'Integrated business operations management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProviderWrapper>
            {children}
          </AuthProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}