import apiClient, { ApiResponse } from './api-client';
import { Video } from '@/types/video';

export const PlaylistService = {
    // Get watch later videos
    getWatchLaterVideos: async (): Promise<ApiResponse<Video[]>> => {
        const response = await apiClient.get<ApiResponse<Video[]>>('/playlists/watch-later');
        return response.data;
    },

    // Get history videos
    getHistoryVideos: async (): Promise<ApiResponse<Video[]>> => {
        const response = await apiClient.get<ApiResponse<Video[]>>('/playlists/history');
        return response.data;
    },

    // Remove video from watch later
    removeFromWatchLater: async (videoId: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/playlists/watch-later/${videoId}`);
        return response.data;
    },

    // Remove video from history
    removeFromHistory: async (videoId: number): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/playlists/history/${videoId}`);
        return response.data;
    },

    // Clear history
    clearHistory: async (): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<ApiResponse<void>>('/playlists/history/clear');
        return response.data;
    }
};

export default PlaylistService;