import apiClient, { ApiResponse } from './api-client';
import { Comment, CommentUpdateRequest, CommentCreateRequest } from '@/types/video';

export const CommentService = {
  // Get comments for an item (video, post, etc.)
  getItemComments: async (itemId: string, commentType?: string): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/comment/${itemId}`, {
      params: commentType ? { commentType } : undefined,
    });
    return response.data;
  },

  // Add comment to video
  addComment: async (itemId: string, data: CommentCreateRequest): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/comment`, data);
    return response.data;
  },

  // Get comment by ID
  getCommentById: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.get<ApiResponse<Comment>>(`/comment/${id}`);
    return response.data;
  },

  // Get comment replies
  getCommentReplies: async (id: string): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/comment/${id}/replies`);
    return response.data;
  },

  // Reply to comment
  replyToComment: async (id: string, data: CommentCreateRequest): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/comment/${id}/replies`,
      data
    );
    return response.data;
  },

  // Update comment
  updateComment: async (id: string, data: CommentUpdateRequest): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.put<ApiResponse<Comment>>(`/comment/${id}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/comment/${id}`);
    return response.data;
  },

  // Heart comment (for video owners)
  heartComment: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/comment/${id}/heart`);
    return response.data;
  },

  // Unheart comment
  unheartComment: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/comment/${id}/heart`);
    return response.data;
  },

  // Pin comment (for video owners)
  pinComment: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/comment/${id}/pin`);
    return response.data;
  },

  // Unpin comment
  unpinComment: async (id: string): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.delete<ApiResponse<Comment>>(`/comment/${id}/pin`);
    return response.data;
  }
};

export default CommentService;