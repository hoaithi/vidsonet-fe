import apiClient, { ApiResponse } from './api-client';
import { Video, VideoUpload, VideoUpdateRequest, VideoProgressUpdateRequest, VideoSearchRequest, Comment, CommentCreateRequest } from '@/types/video';
import { PaginatedResponse } from '@/types/api';

export const VideoService = {
  // Upload a new video
  uploadVideo: async (data: VideoUpload): Promise<ApiResponse<Video>> => {
    const formData = new FormData();
    formData.append('title', data.title);

    if (data.description) {
      formData.append('description', data.description);
    }

    if (data.categoryIds && data.categoryIds.length > 0) {
      data.categoryIds.forEach((id) => {
        formData.append('categoryIds', id.toString());
      });
    }

    formData.append('isPremium', data.isPremium.toString());
    console.log('video file', data.isPremium);
    formData.append('videoFile', data.videoFile);

    if (data.thumbnailFile) {
      formData.append('thumbnailFile', data.thumbnailFile);
    }

    const response = await apiClient.post<ApiResponse<Video>>(
      '/videos',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  // Get video by ID
  getVideoById: async (id: number, userId?: number): Promise<ApiResponse<Video>> => {
    const params = userId ? { userId } : undefined;
    const response = await apiClient.get<ApiResponse<Video>>(`/videos/${id}`, { params });
    return response.data;
  },

  // Update video
  updateVideo: async (id: number, data: VideoUpdateRequest): Promise<ApiResponse<Video>> => {
    const response = await apiClient.put<ApiResponse<Video>>(`/videos/${id}`, data);
    return response.data;
  },

  // Delete video
  deleteVideo: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/videos/${id}`);
    return response.data;
  },

  // Search videos
  searchVideos: async (
    params: VideoSearchRequest,
    page: number = 0,
    size: number = 12,
    sortBy: string = 'publishedAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<PaginatedResponse<Video>>> => {
    const queryParams = {
      ...params,
      page,
      size,
      sortBy,
      sortDir
    };

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Video>>>('/videos', { params: queryParams });
    return response.data;
  },

  // Increment view count
  incrementView: async (id: number, userId?: number): Promise<ApiResponse<Video>> => {
    const params = userId ? { userId } : undefined;
    const response = await apiClient.post<ApiResponse<Video>>(`/videos/${id}/view`, null, { params });
    return response.data;
  },

  // Update video progress
  updateVideoProgress: async (id: number, data: VideoProgressUpdateRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/videos/${id}/progress`, data);
    return response.data;
  },

  // Like video
  likeVideo: async (id: number): Promise<ApiResponse<Video>> => {
    const response = await apiClient.post<ApiResponse<Video>>(`/videos/${id}/like`);
    return response.data;
  },

  // Dislike video
  dislikeVideo: async (id: number): Promise<ApiResponse<Video>> => {
    const response = await apiClient.post<ApiResponse<Video>>(`/videos/${id}/dislike`);
    return response.data;
  },

  // Add to watch later
  addToWatchLater: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(`/videos/${id}/watch-later`);
    return response.data;
  },

  // Get watch later videos
  getWatchLaterVideos: async (
    page: number = 0,
    size: number = 12,
    sortBy: string = 'addedAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<PaginatedResponse<Video>>> => {
    const queryParams = {
      page,
      size,
      sortBy,
      sortDir
    };

    const response = await apiClient.get<ApiResponse<PaginatedResponse<Video>>>('/videos/watch-later', { params: queryParams });
    return response.data;
  },

  // Get video comments
  getVideoComments: async (id: number): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/videos/${id}/comments`);
    return response.data;
  },

  // Add comment to video
  addComment: async (id: number, data: CommentCreateRequest): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/videos/${id}/comments`, data);
    return response.data;
  }
}