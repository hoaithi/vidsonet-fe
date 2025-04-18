import { create } from 'zustand';
import { Notification } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  setNotifications: (notifications: Notification[]) => {
    set({ notifications });
  },
  
  setUnreadCount: (count: number) => {
    set({ unreadCount: count });
  },
  
  addNotification: (notification: Notification) => {
    const { notifications, unreadCount } = get();
    set({
      notifications: [notification, ...notifications],
      unreadCount: unreadCount + 1,
    });
  },
  
  markAsRead: (id: number) => {
    const { notifications, unreadCount } = get();
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id && !notification.isRead) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    
    // Calculate how many notifications were marked as read
    const newUnreadCount = unreadCount - 
      (notifications.filter(n => n.id === id && !n.isRead).length);
    
    set({
      notifications: updatedNotifications,
      unreadCount: Math.max(0, newUnreadCount),
    });
  },
  
  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    
    set({
      notifications: updatedNotifications,
      unreadCount: 0,
    });
  },
  
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));