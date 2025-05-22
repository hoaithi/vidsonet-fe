import apiClient, { ApiResponse } from './api-client';
import { Post, PostCreateRequest, PostUpdateRequest, PostComment, PostCommentCreateRequest, PostCommentUpdateRequest } from '@/types/post';
import { PaginatedResponse } from '@/types/api';

export const PostService = {
  // Create a new post
  createPost: async (data: PostCreateRequest): Promise<ApiResponse<Post>> => {
    const response = await apiClient.post<ApiResponse<Post>>('/posts', data);
    return response.data;
  },

  // Get post by ID
  getPostById: async (id: number): Promise<ApiResponse<Post>> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data;
  },

  // Get posts by user ID
  getPostsByUserId: async (
    userId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Post>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts/user/${userId}`,
      {
        params: {
          page,
          size
        }
      }
    );
    return response.data;
  },

  // Update post
  updatePost: async (id: number, data: PostUpdateRequest): Promise<ApiResponse<Post>> => {
    const response = await apiClient.put<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/posts/${id}`);
    return response.data;
  },

  // Like post
  likePost: async (id: number): Promise<ApiResponse<Post>> => {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${id}/like`);
    return response.data;
  },

  // Dislike post
  dislikePost: async (id: number): Promise<ApiResponse<Post>> => {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${id}/dislike`);
    return response.data;
  },

  // Get post comments
  getPostComments: async (postId: number): Promise<ApiResponse<PostComment[]>> => {
    const response = await apiClient.get<ApiResponse<PostComment[]>>(`/post-comments/post/${postId}`);
    return response.data;
  },

  // Create comment on post
  createComment: async (data: PostCommentCreateRequest): Promise<ApiResponse<PostComment>> => {
    const response = await apiClient.post<ApiResponse<PostComment>>('/post-comments', data);
    return response.data;
  },

  // Get comment by ID
  getCommentById: async (id: number): Promise<ApiResponse<PostComment>> => {
    const response = await apiClient.get<ApiResponse<PostComment>>(`/post-comments/${id}`);
    return response.data;
  },

  // Get comment replies
  getCommentReplies: async (commentId: number): Promise<ApiResponse<PostComment[]>> => {
    const response = await apiClient.get<ApiResponse<PostComment[]>>(`/post-comments/${commentId}/replies`);
    return response.data;
  },

  // Update comment
  updateComment: async (id: number, data: PostCommentUpdateRequest): Promise<ApiResponse<PostComment>> => {
    const response = await apiClient.put<ApiResponse<PostComment>>(`/post-comments/${id}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/post-comments/${id}`);
    return response.data;
  },

  // Heart comment (for post owners)
  heartComment: async (id: number): Promise<ApiResponse<PostComment>> => {
    const response = await apiClient.post<ApiResponse<PostComment>>(`/post-comments/${id}/heart`);
    return response.data;
  },

  // Unheart comment
  unheartComment: async (id: number): Promise<ApiResponse<PostComment>> => {
    const response = await apiClient.delete<ApiResponse<PostComment>>(`/post-comments/${id}/heart`);
    return response.data;
  }
};

export default PostService;