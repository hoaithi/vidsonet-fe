'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import VideoGrid from '@/components/video/video-grid';
import { useAuthStore } from '@/store/auth-store';
import { Video } from '@/types/video';
import { Subscription } from '@/types/user';
import UserService from '@/services/user-service';
import {VideoService} from '@/services/video-service';

export default function SubscriptionsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch subscriptions and videos
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      
      try {
        // Get user subscriptions
        const subscriptionsResponse = await UserService.getUserSubscriptions();
        if (subscriptionsResponse.data) {
          setSubscriptions(subscriptionsResponse.data);
          
          // Get channel IDs
          const channelIds = subscriptionsResponse.data.map(sub => sub.channel.id);
          
          // If there are subscriptions, fetch videos from those channels
          if (channelIds.length > 0) {
            let allVideos: Video[] = [];
            
            // For simplicity, fetch videos from each channel separately
            // In a real app, you might want a backend endpoint that can fetch from multiple channels at once
            for (const channelId of channelIds) {
              const videosResponse = await VideoService.searchVideos({ 
                userId: channelId 
              }, 0, 5); // Limit to 5 videos per channel
              
              if (videosResponse.data && videosResponse.data.content) {
                allVideos = [...allVideos, ...videosResponse.data.content];
              }
            }
            
            // Sort by publish date (newest first)
            allVideos.sort((a, b) => {
              return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            });
            
            setVideos(allVideos);
          }
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Subscriptions</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your subscriptions...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Subscriptions Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't subscribed to any channels yet. Discover content you enjoy and subscribe to stay updated!
          </p>
          <Button onClick={() => router.push('/explore')}>
            Explore Videos
          </Button>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No Videos from Your Subscriptions</h2>
          <p className="text-muted-foreground">
            The channels you've subscribed to haven't uploaded any videos yet.
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-6">
            Latest videos from your subscribed channels
          </p>
          <VideoGrid videos={videos} columns={3} />
        </>
      )}
    </div>
  );
}