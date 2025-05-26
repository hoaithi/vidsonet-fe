'use client';
import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { User } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSubscription } from '@/lib/hooks/use-subscription';
import { useAuthStore } from '@/store/auth-store';

interface ChannelHeaderProps {
  channel: User;
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const { isAuthenticated, user } = useAuthStore();
  // const { isSubscribed, subscriberCount, subscribeToChannel, unsubscribeFromChannel, toggleNotifications } = useSubscription();

  const { 
    isLoading, 
    isSubscribed, 
    subscriberCount, 
    checkSubscription, 
    getSubscriberCount, 
    subscribeToChannel, 
    unsubscribeFromChannel, 
    toggleNotifications 
  } = useSubscription();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const isOwnChannel = isAuthenticated && user?.id === channel.id;

  useEffect(() => {
    if (isAuthenticated && channel.id && !isOwnChannel) {
      checkSubscription(channel.id);
      getSubscriberCount(channel.id);
    }
  }, [isAuthenticated, channel.id, isOwnChannel, checkSubscription, getSubscriberCount]);

  // Handle subscribe/unsubscribe
  const handleSubscriptionToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isSubscribed) {
      await unsubscribeFromChannel(channel.id);
    } else {
      await subscribeToChannel(channel.id, notificationsEnabled);
    }
  };

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    if (!isAuthenticated || !isSubscribed) return;

    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    await toggleNotifications(channel.id, newStatus);
  };

  return (
    <div className="relative">
      {/* Banner image */}
      <div className="h-48 bg-muted rounded-lg overflow-hidden relative">
        {channel.bannerImage ? (
          <img
            src={channel.bannerImage}
            alt={`${channel.channelName || channel.username} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
        )}
      </div>

      {/* Channel info */}
      <div className="mt-6 md:-mt-16 md:ml-8 flex flex-col md:flex-row items-start md:items-end gap-6">
        <Avatar className="h-24 w-24 border-4 border-background">
          <AvatarImage 
            src={channel.channelPicture || channel.profilePicture || ''} 
            alt={channel.channelName || channel.username} 
          />
          <AvatarFallback className="text-2xl">
            {(channel.channelName || channel.username || 'C').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 md:pb-4">
          <h1 className="text-2xl font-bold">{channel.channelName || channel.username}</h1>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <span>{channel.username}</span>
            <span className="mx-1">•</span>
            <span>{channel.subscriberCount || subscriberCount || 0} subscribers</span>
          </div>
          
          {channel.channelDescription && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {channel.channelDescription}
            </p>
          )}
        </div>
        
        {!isOwnChannel && isAuthenticated && (
          <div className="flex items-center gap-2 md:pb-4 w-full md:w-auto">
            <Button
              variant={isSubscribed ? "outline" : "default"}
              onClick={handleSubscriptionToggle}
              className="flex-1 md:flex-none"
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
            
            {isSubscribed && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNotificationToggle}
                title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
              >
                {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            )}
          </div>
        )}
        
        {isOwnChannel && (
          <Button variant="outline" className="md:mb-4" onClick={() => window.location.href = '/settings'}>
            Edit Channel
          </Button>
        )}
      </div>
    </div>
  );
}

export default ChannelHeader;
