'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import UserService from '@/services/profile-service';


export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Check subscription status
  const checkSubscription = async (channelId: string) => {
    try {
      const response = await UserService.checkSubscription(channelId);
      
      if (response.result !== undefined) {
        setIsSubscribed(response.result);
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Check subscription error:', error);
      return false;
    }
  };

  // Get subscriber count
  const getSubscriberCount = async (channelId: string) => {
    try {
      const response = await UserService.getSubscriberCount(channelId);
      
      if (response.result !== undefined) {
        setSubscriberCount(response.result);
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Get subscriber count error:', error);
      return 0;
    }
  };

  // Subscribe to channel
  const subscribeToChannel = async (channelId: string, notificationEnabled: boolean = true) => {
    setIsLoading(true);
    
    try {
      await UserService.subscribeToChannel(channelId, notificationEnabled);
      
      setIsSubscribed(true);
      setSubscriberCount((prev) => prev + 1);
      
      toast.success('Subscribed successfully');
      return true;
    } catch (error: any) {
      console.error('Subscribe error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to subscribe. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Unsubscribe from channel
  const unsubscribeFromChannel = async (channelId: string) => {
    setIsLoading(true);
    
    try {
      await UserService.unsubscribeFromChannel(channelId);
      
      setIsSubscribed(false);
      setSubscriberCount((prev) => Math.max(0, prev - 1));
      
      toast.success('Unsubscribed successfully');
      return true;
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to unsubscribe. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle notifications
  const toggleNotifications = async (channelId: string, enabled: boolean) => {
    try {
      await UserService.toggleNotifications(channelId, enabled);
      
      toast.success(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
      return true;
    } catch (error: any) {
      console.error('Toggle notifications error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to update notification settings. Please try again.'
      );
      return false;
    }
  };

  return {
    isLoading,
    isSubscribed,
    subscriberCount,
    checkSubscription,
    getSubscriberCount,
    subscribeToChannel,
    unsubscribeFromChannel,
    toggleNotifications,
  };
};