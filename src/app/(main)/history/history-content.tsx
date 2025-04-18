'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { History as HistoryIcon, Loader2, Trash2, Trash } from 'lucide-react';

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

export default function HistoryContent() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const { isLoading, getHistoryVideos, removeFromHistory, clearHistory } = usePlaylists();
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    // Fetch history videos
    useEffect(() => {
        const fetchVideos = async () => {
            if (!isAuthenticated) return;

            const historyVideos = await getHistoryVideos();
            setVideos(historyVideos);
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

        const success = await removeFromHistory(selectedVideo.id);
        if (success) {
            setVideos(prev => prev.filter(v => v.id !== selectedVideo.id));
        }

        setSelectedVideo(null);
        setIsRemoving(false);
    };

    // Handle clear history
    const handleClearHistory = async () => {
        setIsClearing(true);
    };

    // Confirm clear history
    const confirmClearHistory = async () => {
        const success = await clearHistory();
        if (success) {
            setVideos([]);
        }

        setIsClearing(false);
    };

    if (!isAuthenticated) {
        return null; // Will redirect in the useEffect
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Watch History</h1>

                {videos.length > 0 && (
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleClearHistory}
                    >
                        <Trash className="h-4 w-4" />
                        Clear History
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading your watch history...</p>
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12">
                    <HistoryIcon className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-4">No watch history</h2>
                    <p className="text-muted-foreground mb-6">
                        Videos you watch will appear here so you can easily find them again.
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

            {/* Remove Video Confirmation Dialog */}
            <AlertDialog open={isRemoving} onOpenChange={(open) => !open && setIsRemoving(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove from History</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove this video from your watch history?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemoveVideo}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Clear History Confirmation Dialog */}
            <AlertDialog open={isClearing} onOpenChange={(open) => !open && setIsClearing(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Clear Watch History</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to clear your entire watch history? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmClearHistory}>Clear</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}