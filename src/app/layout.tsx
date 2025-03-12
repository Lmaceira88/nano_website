import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TenantProvider } from '@/contexts/TenantContext';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ProjectNano - Appointment Management',
  description: 'Professional appointment booking and management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TenantProvider>
          <AuthProvider>
            <Suspense fallback={<div className="p-4">Loading application...</div>}>
              {children}
            </Suspense>
          </AuthProvider>
        </TenantProvider>
      </body>
    </html>
  );
} 