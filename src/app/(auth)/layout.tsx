'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import Sidebar from '@/components/layout/sidebar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b h-14 flex items-center px-6">
        <Link href="/" className="font-bold text-lg">
          VidsoNet
        </Link>
      </header>    
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      
      <footer className="border-t h-14 flex items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VidsoNet. All rights reserved.
        </p>
      </footer>
    </div>
  );
}