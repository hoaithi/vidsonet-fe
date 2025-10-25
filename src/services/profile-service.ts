import apiClient, { ApiResponse } from './api-client';
import { Profile, UpdateProfileRequest, Subscription } from '@/types/profile';

export const ProfileService = {
  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get<ApiResponse<Profile>>('/profile/my-profile');
    return response.data; 
  },

  // Get profile by id
  getUserById: async (id: string): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get<ApiResponse<Profile>>(`/profile/${id}`);
    return response.data;
  },

  // Get channel by user id
  getChannelByUserId: async (id: string): Promise<ApiResponse<Profile>> => {
    const response = await apiClient.get<ApiResponse<Profile>>(`/users/${id}/channel`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (id: string, data: UpdateProfileRequest): Promise<ApiResponse<Profile>> => {
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
    const response = await apiClient.put<ApiResponse<Profile>>(
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
    const response = await apiClient.get<ApiResponse<Subscription[]>>('/subscription/profile');
    return response.data;
  },

  // Subscribe to a channel
  subscribeToChannel: async (channelId: string, notificationEnabled: boolean = true): Promise<ApiResponse<Subscription>> => {
    const response = await apiClient.post<ApiResponse<Subscription>>(
      `/subscription/${channelId}`,
      null,
      { params: { notificationEnabled } }
    );
    return response.data;
  },

  // Unsubscribe from a channel
  unsubscribeFromChannel: async (channelId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/subscription/${channelId}`);
    return response.data;
  },

  // Toggle notification settings for a subscription
  toggleNotifications: async (channelId: string, enabled: boolean): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/subscription/${channelId}/notifications`,
      null,
      { params: { enabled } }
    );
    return response.data;
  },

  // Check if subscribed to a channel
  checkSubscription: async (channelId: string): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get<ApiResponse<boolean>>(
      '/subscription/check',
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
  getSubscriberCount: async (channelId: string): Promise<ApiResponse<number>> => {
    const response = await apiClient.get<ApiResponse<number>>(`/subscription/${channelId}/count`);
    return response.data;
  }
};

export default ProfileService;