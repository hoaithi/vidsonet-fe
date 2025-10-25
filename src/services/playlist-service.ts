import apiClient, { ApiResponse } from "./api-client";
import { Video } from "@/types/video";
import { PaginatedResponse } from "@/types/api";
export const PlaylistService = {
  // Get watch later videos
  getWatchLaterVideos: async (): Promise<ApiResponse<Video[]>> => {
    const response = await apiClient.get<ApiResponse<Video[]>>(
      "/playlists/watch-later"
    );
    return response.data;
  },

  // Get history videos
  getHistoryVideos: async (
    page: number = 0,
    size: number = 12,
    sortBy: string = "addedAt",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<ApiResponse<PaginatedResponse<Video>>> => {
    const queryParams = {
      page,
      size,
      sortBy,
      sortDir,
    };

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Video>>>(
      "/video/history",
      { params: queryParams }
    );
    return response.data;
  },

  // Remove video from watch later
  removeFromWatchLater: async (videoId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/video/watch-later/${videoId}`
    );
    return response.data;
  },

  // Remove video from history
  removeFromHistory: async (videoId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/playlists/history/${videoId}`
    );
    return response.data;
  },

  // Clear history
  clearHistory: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      "/playlists/history/clear"
    );
    return response.data;
  },
};

export default PlaylistService;
