import apiClient, { ApiResponse } from './api-client';
import { Notification } from '@/types/notification';
import { PaginatedResponse } from '@/types/api';

export const NotificationService = {
  // Get user notifications
  getUserNotifications: async (page: number = 0, size: number = 10): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>(
      '/notifications',
      {
        params: {
          page,
          size
        }
      }
    );
    return response.data;
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<ApiResponse<number>> => {
    const response = await apiClient.get<ApiResponse<number>>('/notifications/unread/count');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>('/notifications/read-all');
    return response.data;
  }
};

export default NotificationService;