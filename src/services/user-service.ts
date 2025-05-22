import apiClient, { ApiResponse } from './api-client';
import { User, UpdateProfileRequest, Subscription } from '@/types/user';

export const UserService = {
  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data;
  },

  // Get user by id
  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  // Get channel by user id
  getChannelByUserId: async (id: number): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}/channel`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (id: number, data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    const formData = new FormData;
    if(data.username){
      formData.append('username', data.username);
    }
    if(data.email){
      formData.append('email', data.email);
    }
    if(data.channelName){
      formData.append('channelName', data.channelName);
    }
    if(data.channelDescription){
      formData.append('channelDescription', data.channelDescription);
    }
    if(data.profilePicture){
      formData.append('profilePicture', data.profilePicture);
    }
    if(data.bannerImage){
      formData.append('bannerImage', data.bannerImage);
    }
    if(data.channelPicture){
      formData.append('channelPicture', data.channelPicture);
    }
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
  );
    return response.data;
  },

  // Get user subscriptions
  getUserSubscriptions: async (): Promise<ApiResponse<Subscription[]>> => {
    const response = await apiClient.get<ApiResponse<Subscription[]>>('/subscriptions/user');
    return response.data;
  },

  // Subscribe to a channel
  subscribeToChannel: async (channelId: number, notificationEnabled: boolean = true): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post<ApiResponse<Subscription>>(
      `/subscriptions/${channelId}`,
      null,
      { params: { notificationEnabled } }
    );
    return response.data;
  },

  // Unsubscribe from a channel
  unsubscribeFromChannel: async (channelId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/subscriptions/${channelId}`);
    return response.data;
  },

  // Toggle notification settings for a subscription
  toggleNotifications: async (channelId: number, enabled: boolean): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/subscriptions/${channelId}/notifications`,
      null,
      { params: { enabled } }
    );
    return response.data;
  },

  // Check if subscribed to a channel
  checkSubscription: async (channelId: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get<ApiResponse<boolean>>(
      '/subscriptions/check',
      { params: { channelId } }
    );
    return response.data;
  },
  
  // Check if user has membership for a channel
  checkMembership: async (channelId: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get<ApiResponse<boolean>>(
      '/memberships/check',
      { params: { channelId } }
    );
    return response.data;
  },

  // Get subscriber count for a channel
  getSubscriberCount: async (channelId: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get<ApiResponse<number>>(`/subscriptions/channel/${channelId}/count`);
    return response.data;
  }
};

export default UserService;