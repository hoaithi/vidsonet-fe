// "use client";import { useEffect } from "react";// import { Navbar } from "@/components/layout/navbar";// import { Sidebar } from "@/components/layout/sidebar";// import { useAuthStore } from "@/store/auth-store";// import { useNotificationStore } from "@/store/notification-store";
// import ProfileService from "@/services/profile-service";
// import NotificationService from "@/services/notification-service";

// export default function MainLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isAuthenticated, profile, updateProfile } = useAuthStore();
//   const { setUnreadCount } = useNotificationStore();

//   // Load user data on initial render if authenticated
//   useEffect(() => {
//     if (isAuthenticated && !profile) {
//       const fetchUserData = async () => {
//         try {
//           const response = await ProfileService.getCurrentUser();
//           if (response.result) {
//             updateProfile(response.result);
//           }
//         } catch (error) {
//           console.error("Failed to fetch user data:", error);
//         }
//       };

//       fetchUserData();
//     }
//   }, [isAuthenticated, profile, updateProfile]);

//   // Load notification count if authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       const fetchNotificationCount = async () => {
//         try {
//           const response = await NotificationService.getUnreadCount();
//           if (response.result !== undefined) {
//             setUnreadCount(response.result);
//           }
//         } catch (error) {
//           console.error("Failed to fetch notification count:", error);
//         }
//       };

//       fetchNotificationCount();

//       // Set up polling for notifications (every 2 minutes)
//       const interval = setInterval(fetchNotificationCount, 2 * 60 * 1000);

//       return () => clearInterval(interval);
//     }
//   }, [isAuthenticated, setUnreadCount]);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       {/* <div className="pt-16 md:pl-56"> */}
//       <Sidebar />
//       {/* <main className="container py-6 ml-2">
//           {children}
//         </main> */}
//       <main className="flex-1 pt-16 md:pl-56">
//         <div className="container py-6">{children}</div>
//       </main>
//       {/* </div> */}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import ProfileService from "@/services/profile-service";
import NotificationService from "@/services/notification-service";
import { Sidebar } from "@/components/layout/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, profile, updateProfile } = useAuthStore();
  const { setUnreadCount } = useNotificationStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.isCollapsed);
    };

    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener
    );

    // Load initial state from localStorage
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setSidebarCollapsed(savedState === "true");
    }

    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener
      );
    };
  }, []);

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
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 pt-16 transition-all duration-300 ${
            sidebarCollapsed ? "md:pl-16" : "md:pl-56"
          }`}
        >
          <div className="container py-6 px-4 md:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
