import { useState } from 'react';
import { toast } from 'sonner';
import UserService from '@/services/user-service';
import { useAuthStore } from '@/store/auth-store';
import { UpdateProfileRequest, User } from '@/types/user';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [channelInfo, setChannelInfo] = useState<User | null>(null);
  const { user, updateUser } = useAuthStore();

  // Get current user
  const getCurrentUser = async () => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getCurrentUser();
      
      if (response.data) {
        updateUser(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load user data. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user by ID
  const getUserById = async (id: number) => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getUserById(id);
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load user data. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get channel by user ID
  const getChannelByUserId = async (id: number) => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getChannelByUserId(id);
      
      if (response.data) {
        setChannelInfo(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get channel error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load channel data. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data: UpdateProfileRequest) => {
    if (!user) return null;
    
    setIsLoading(true);
    
    try {
      const response = await UserService.updateProfile(user.id, data);
      
      if (response.data) {
        updateUser(response.data);
        
        if (channelInfo && channelInfo.id === user.id) {
          setChannelInfo(response.data);
        }
      }
      
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user subscriptions
  const getUserSubscriptions = async () => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getUserSubscriptions();
      return response.data;
    } catch (error: any) {
      console.error('Get subscriptions error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load subscriptions. Please try again.'
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    channelInfo,
    getCurrentUser,
    getUserById,
    getChannelByUserId,
    updateProfile,
    getUserSubscriptions,
  };
};