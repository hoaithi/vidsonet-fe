import apiClient, { ApiResponse } from "./api-client";
import {
  Video,
  VideoUpload,
  VideoUpdateRequest,
  VideoProgressUpdateRequest,
  VideoSearchRequest,
  Comment,
  CommentCreateRequest,
} from "@/types/video";
import { PaginatedResponse } from "@/types/api";

export const VideoService = {
  // Upload a new video
  uploadVideo: async (data: VideoUpload): Promise<ApiResponse<Video>> => {
    const formData = new FormData();
    formData.append("title", data.title);

    if (data.description) {
      formData.append("description", data.description);
    }

    formData.append("isPremium", data.isPremium.toString());
    console.log("video file", data.isPremium);
    formData.append("videoFile", data.videoFile);

    if (data.thumbnailFile) {
      formData.append("thumbnailFile", data.thumbnailFile);
    }

    const response = await apiClient.post<ApiResponse<Video>>(
      "/video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Get video by ID
  getVideoById: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await apiClient.get<ApiResponse<Video>>(
      `/video/watch/${id}`
    );
    return response.data;
  },

  // Update video
  updateVideo: async (
    id: string,
    data: VideoUpdateRequest
  ): Promise<ApiResponse<Video>> => {
    const response = await apiClient.put<ApiResponse<Video>>(
      `/videos/${id}`,
      data
    );
    return response.data;
  },

  // Delete video
  deleteVideo: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/videos/${id}`);
    return response.data;
  },

  // Search videos
  searchVideos: async (
    page: number = 0,
    size: number = 12,
    sortBy: string = "publishedAt",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<ApiResponse<PaginatedResponse<Video>>> => {
    const queryParams = {
      page,
      size,
      sortBy,
      sortDir,
    };

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Video>>>(
      "/video/search",
      { params: queryParams }
    );
    return response.data;
  },

    // Get watch later videos
  getWatchLaterVideos: async (
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
      "/video/watch-later",
      { params: queryParams }
    );
    return response.data;
  },

  // Get videos by channel (userId)
  getVideosByChannelId: async (
    userId: string,
    page: number = 0,
    size: number = 12,
    sortBy: string = "publishedAt",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<ApiResponse<PaginatedResponse<Video>>> => {
    const queryParams = {
      userId,
      page,
      size,
      sortBy,
      sortDir,
    };

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Video>>>(
      `/video/${userId}`,
      { params: queryParams }
    );

    return response.data;
  },

  // Increment view count
  incrementView: async (
    id: number,
    userId?: number
  ): Promise<ApiResponse<Video>> => {
    const params = userId ? { userId } : undefined;
    const response = await apiClient.post<ApiResponse<Video>>(
      `/videos/${id}/view`,
      null,
      { params }
    );
    return response.data;
  },

  // Update video progress
  updateVideoProgress: async (
    id: string,
    data: VideoProgressUpdateRequest
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/video/history/${id}`,
      data
    );
    return response.data;
  },

  // Like video
  likeVideo: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await apiClient.post<ApiResponse<Video>>(
      `/video/${id}/like`
    );
    return response.data;
  },

  // Dislike video
  dislikeVideo: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await apiClient.post<ApiResponse<Video>>(
      `/video/${id}/dislike`
    );
    return response.data;
  },

  // Add to watch later
  addToWatchLater: async (videoId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/video/watch-later`,{videoId}
    );
    return response.data;
  },



  // Get video comments
  getVideoComments: async (id: string): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/comment/${id}`
    );
    return response.data;
  },

  // Add comment to video
  addComment: async (
    id: string,
    data: CommentCreateRequest
  ): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/comment`,
      data
    );
    return response.data;
  },

  getUserReaction: async (
    videoId: string,
    userId?: string
  ): Promise<
    ApiResponse<{ reactionType?: "LIKE" | "DISLIKE"; hasReacted: boolean }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{ reactionType?: "LIKE" | "DISLIKE"; hasReacted: boolean }>
    >(`/video/${videoId}/reaction`, {
      params: { userId },
    });
    return response.data;
  },
};
