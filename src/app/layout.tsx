// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProviderWrapper from '@/components/AuthProviderWrapper';
import RootAppWrapper from '@/components/RootAppWrapper'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Business Operations Platform',
    description: 'Integrated platform for business operations management',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProviderWrapper>
                    <RootAppWrapper>
                        {children}
                    </RootAppWrapper>
                </AuthProviderWrapper>
            </body>
        </html>
    );
}