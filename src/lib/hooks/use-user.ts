import { useState } from 'react';
import { toast } from 'sonner';
import UserService from '@/services/profile-service';
import { useAuthStore } from '@/store/auth-store';
import { UpdateProfileRequest, Profile } from '@/types/profile';

export const useUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [channelInfo, setChannelInfo] = useState<Profile | null>(null);
  const { profile, updateProfile } = useAuthStore();

  // Get current user
  const getCurrentUser = async () => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getCurrentUser();
      
      if (response.result) {
        updateProfile(response.result);
      }
      
      return response.result;
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
  const getUserById = async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getUserById(id);
      return response.result;
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
  const getChannelByUserId = async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await UserService.getChannelByUserId(id);
      
      if (response.result) {
        setChannelInfo(response.result);
      }
      
      return response.result;
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
  const updateProfileUser = async (data: UpdateProfileRequest) => {
    if (!profile) return null;
    
    setIsLoading(true);
    
    try {
      const response = await UserService.updateProfile(profile.id, data);
      
      if (response.result) {
        updateProfile(response.result);
        
        if (channelInfo && channelInfo.id === profile.id) {
          setChannelInfo(response.result);
        }
      }
      
      toast.success('Profile updated successfully');
      return response.result;
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
      return response.result;
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
    updateProfile: updateProfileUser,
    getUserSubscriptions,
  };
};