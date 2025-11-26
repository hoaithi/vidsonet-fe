'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Check, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { Notification, NotificationType } from '@/types/notification';
import NotificationService from '@/services/notification-service';
import { getRelativeTime } from '@/lib/utils';

export default function NotificationsPage() {
  const { isAuthenticated } = useAuthStore();
  const { notifications, setNotifications, markAllAsRead } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      
      try {
        const response = await NotificationService.getUserNotifications();
        if (response.result) {
          setNotifications(response.result.content);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated, setNotifications]);

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      markAllAsRead();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Handle click on notification
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await NotificationService.markAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Navigate based on notification type
    if (notification.entityType === 'VIDEO') {
      router.push(`/video/${notification.entityId}`);
    } else if (notification.entityType === 'USER') {
      router.push(`/channel/${notification.entityId}`);
    } else if (notification.entityType === 'COMMENT') {
      // For comments, we need to navigate to the video and scroll to the comment
      // This is simplified - in a real app, you might need to fetch the video ID first
      router.push(`/video/${notification.entityId}#comments`);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: NotificationType) => {
    // You could use different icons for different notification types
    return <Bell className="h-4 w-4" />;
  };

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        {notifications.length > 0 && (
          <Button variant="ghost" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Notifications</h2>
            <p className="text-muted-foreground">
              You don't have any notifications yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.isRead ? 'bg-background' : 'bg-muted/30'
              } hover:bg-muted/50 transition-colors cursor-pointer`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={notification.actor.avatarUrl || ''}
                    alt={notification.actor.fullName}
                  />
                  <AvatarFallback>
                    {notification.actor.fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {notification.actor.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(notification.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm mt-1">{notification.content}</p>
                </div>
                
                <div className="text-muted-foreground">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}