'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Loader2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import VideoGrid from '@/components/video/video-grid';
import { useAuthStore } from '@/store/auth-store';
import { usePlaylists } from '@/lib/hooks/use-playlists';
import { Video } from '@/types/video';

export default function WatchLater() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const { isLoading, getWatchLaterVideos, removeFromWatchLater } = usePlaylists();
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Fetch watch later videos
    useEffect(() => {
        const fetchVideos = async () => {
            if (!isAuthenticated) return;

            const watchLaterVideos = await getWatchLaterVideos();
            setVideos(watchLaterVideos);
        };

        fetchVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    // Handle remove video
    const handleRemoveVideo = async (video: Video) => {
        setSelectedVideo(video);
        setIsRemoving(true);
    };

    // Confirm remove video
    const confirmRemoveVideo = async () => {
        if (!selectedVideo) return;

        const success = await removeFromWatchLater(selectedVideo.id);
        if (success) {
            setVideos(prev => prev.filter(v => v.id !== selectedVideo.id));
        }

        setSelectedVideo(null);
        setIsRemoving(false);
    };

    if (!isAuthenticated) {
        return null; // Will redirect in the useEffect
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Watch Later</h1>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading your watch later list...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-4">Your Watch Later list is empty</h2>
                    <p className="text-muted-foreground mb-6">
                        Save videos to watch later by clicking the Watch Later button on videos.
                    </p>
                    <Button onClick={() => router.push('/explore')}>
                        Explore Videos
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="group relative">
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => handleRemoveVideo(video)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <VideoGrid videos={[video]} showChannel={true} columns={1} />
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation Dialog */}
            <AlertDialog open={isRemoving} onOpenChange={(open) => !open && setIsRemoving(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove from Watch Later</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this video from your Watch Later list?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemoveVideo}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}