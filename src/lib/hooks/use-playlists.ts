import { useState } from 'react';
import { toast } from 'sonner';
import PlaylistService from '@/services/playlist-service';
import { Video } from '@/types/video';

export const usePlaylists = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [watchLaterVideos, setWatchLaterVideos] = useState<Video[]>([]);
    const [historyVideos, setHistoryVideos] = useState<Video[]>([]);

    // Get watch later videos
    const getWatchLaterVideos = async () => {
        setIsLoading(true);

        try {
            const response = await PlaylistService.getWatchLaterVideos();

            if (response.data) {
                setWatchLaterVideos(response.data);
            }

            return response.data || [];
        } catch (error: any) {
            console.error('Error fetching watch later videos:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to load watch later videos. Please try again.'
            );
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Get history videos
    const getHistoryVideos = async () => {
        setIsLoading(true);

        try {
            const response = await PlaylistService.getHistoryVideos();

            if (response.data) {
                setHistoryVideos(response.data);
            }

            return response.data || [];
        } catch (error: any) {
            console.error('Error fetching history videos:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to load history videos. Please try again.'
            );
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Remove video from watch later
    const removeFromWatchLater = async (videoId: number) => {
        try {
            await PlaylistService.removeFromWatchLater(videoId);

            // Update local state
            setWatchLaterVideos(prev => prev.filter(video => video.id !== videoId));

            toast.success('Video removed from Watch Later');
            return true;
        } catch (error: any) {
            console.error('Remove from watch later error:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to remove video from Watch Later. Please try again.'
            );
            return false;
        }
    };

    // Remove video from history
    const removeFromHistory = async (videoId: number) => {
        try {
            await PlaylistService.removeFromHistory(videoId);

            // Update local state
            setHistoryVideos(prev => prev.filter(video => video.id !== videoId));

            toast.success('Video removed from History');
            return true;
        } catch (error: any) {
            console.error('Remove from history error:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to remove video from History. Please try again.'
            );
            return false;
        }
    };

    // Clear history
    const clearHistory = async () => {
        try {
            await PlaylistService.clearHistory();

            // Update local state
            setHistoryVideos([]);

            toast.success('Watch history cleared');
            return true;
        } catch (error: any) {
            console.error('Clear history error:', error);

            toast.error(
                error.response?.data?.message ||
                'Failed to clear watch history. Please try again.'
            );
            return false;
        }
    };

    return {
        isLoading,
        watchLaterVideos,
        historyVideos,
        getWatchLaterVideos,
        getHistoryVideos,
        removeFromWatchLater,
        removeFromHistory,
        clearHistory,
    };
};

export default usePlaylists;