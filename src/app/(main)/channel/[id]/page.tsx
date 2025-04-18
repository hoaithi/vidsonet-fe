'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

import ChannelHeader from '@/components/channel/channel-header';
import VideoGrid from '@/components/video/video-grid';
import { MembershipTiers } from '@/components/channel/MembershipTiers';
import { User } from '@/types/user';
import { Video } from '@/types/video';
import { UserService } from '@/services/user-service';
import { VideoService } from '@/services/video-service';
import { useAuthStore } from '@/store/auth-store';

export default function ChannelPage() {
    const params = useParams();
    const channelId = parseInt(params.id as string);
    const { isAuthenticated, user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [channel, setChannel] = useState<User | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [activeTab, setActiveTab] = useState('videos');

    // Determine if this is the user's own channel
    const isOwnChannel = Boolean(isAuthenticated && user && user.id === channelId);

    // Fetch channel data
    useEffect(() => {
        const fetchChannelData = async () => {
            setIsLoading(true);

            try {
                // Get channel info
                const channelResponse = await UserService.getChannelByUserId(channelId);
                if (channelResponse.data) {
                    setChannel(channelResponse.data);
                }

                // Get channel videos
                const videosResponse = await VideoService.searchVideos({ userId: channelId });
                if (videosResponse.data) {
                    setVideos(videosResponse.data.content);
                }
            } catch (error) {
                console.error('Error fetching channel data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (channelId) {
            fetchChannelData();
        }
    }, [channelId]);

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="flex items-end gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        );
    }

    // Error state
    if (!channel) {
        return (
            <div className="py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Channel Not Found</h2>
                <p className="text-muted-foreground">
                    The channel you're looking for might not exist or is unavailable.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ChannelHeader channel={channel} />

            <Tabs
                defaultValue="videos"
                className="mt-6"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="membership">Membership</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="videos" className="mt-6">
                    {videos.length > 0 ? (
                        <VideoGrid videos={videos} showChannel={false} columns={3} />
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground">
                                This channel hasn't uploaded any videos yet.
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="membership" className="mt-6">
                    <MembershipTiers channelId={channelId} isOwnChannel={isOwnChannel} />
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                    <div className="max-w-3xl">
                        <h2 className="text-xl font-semibold mb-4">About {channel.channelName || channel.username}</h2>

                        {channel.channelDescription ? (
                            <div className="whitespace-pre-line">
                                {channel.channelDescription}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                This channel hasn't added a description yet.
                            </p>
                        )}

                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-2">Stats</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Joined:</span>
                                    <span>
                                        {channel.createdAt
                                            ? new Date(channel.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })
                                            : 'Unknown'}
                                    </span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Subscribers:</span>
                                    <span>{channel.subscriberCount || 0}</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">Videos:</span>
                                    <span>{videos.length}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}