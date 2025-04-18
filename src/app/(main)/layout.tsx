'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import UserService from '@/services/user-service';
import NotificationService from '@/services/notification-service';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const { setUnreadCount } = useNotificationStore();

  // Load user data on initial render if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      const fetchUserData = async () => {
        try {
          const response = await UserService.getCurrentUser();
          if (response.data) {
            updateUser(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, [isAuthenticated, user, updateUser]);

  // Load notification count if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotificationCount = async () => {
        try {
          const response = await NotificationService.getUnreadCount();
          if (response.data !== undefined) {
            setUnreadCount(response.data);
          }
        } catch (error) {
          console.error('Failed to fetch notification count:', error);
        }
      };
      
      fetchNotificationCount();
      
      // Set up polling for notifications (every 2 minutes)
      const interval = setInterval(fetchNotificationCount, 2 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, setUnreadCount]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 md:pl-56">
        <Sidebar />
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}