import apiClient, { ApiResponse } from './api-client';
import { Comment, CommentUpdateRequest } from '@/types/video';

export const CommentService = {
  // Get comment by ID
  getCommentById: async (id: number): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.get<ApiResponse<Comment>>(`/comments/${id}`);
    return response.data;
  },

  // Get comment replies
  getCommentReplies: async (id: number): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(`/comments/${id}/replies`);
    return response.data;
  },

  // Reply to comment
  replyToComment: async (id: number, content: string): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      `/comments/${id}/replies`,
      { content }
    );
    return response.data;
  },

  // Update comment
  updateComment: async (id: number, data: CommentUpdateRequest): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.put<ApiResponse<Comment>>(`/comments/${id}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/comments/${id}`);
    return response.data;
  },

  // Heart comment (for video owners)
  heartComment: async (id: number): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/comments/${id}/heart`);
    return response.data;
  },

  // Unheart comment
  unheartComment: async (id: number): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.delete<ApiResponse<Comment>>(`/comments/${id}/heart`);
    return response.data;
  },

  // Pin comment (for video owners)
  pinComment: async (id: number): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(`/comments/${id}/pin`);
    return response.data;
  },

  // Unpin comment
  unpinComment: async (id: number): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.delete<ApiResponse<Comment>>(`/comments/${id}/pin`);
    return response.data;
  }
};

export default CommentService;