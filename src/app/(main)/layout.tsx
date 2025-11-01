"use client";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import ProfileService from "@/services/profile-service";
import NotificationService from "@/services/notification-service";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, profile, updateProfile } = useAuthStore();
  const { setUnreadCount } = useNotificationStore();

  // Load user data on initial render if authenticated
  useEffect(() => {
    if (isAuthenticated && !profile) {
      const fetchUserData = async () => {
        try {
          const response = await ProfileService.getCurrentUser();
          if (response.result) {
            updateProfile(response.result);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, profile, updateProfile]);

  // Load notification count if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotificationCount = async () => {
        try {
          const response = await NotificationService.getUnreadCount();
          if (response.result !== undefined) {
            setUnreadCount(response.result);
          }
        } catch (error) {
          console.error("Failed to fetch notification count:", error);
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
        {/* <main className="container py-6 ml-2">
          {children}
        </main> */}
        <main className="container">{children}</main>
      </div>
    </div>
  );
}
