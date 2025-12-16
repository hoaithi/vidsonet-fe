import apiClient, { ApiResponse } from "./api-client";
import { Post, PostCreateRequest, PostUpdateRequest } from "@/types/post";
import { PaginatedResponse } from "@/types/api";

export const PostService = {
  // Create a new post
  createPost: async (data: PostCreateRequest): Promise<ApiResponse<Post>> => {
    // If an image file provided, use multipart/form-data
    if (data.imageFile) {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.content) formData.append("content", data.content);
      formData.append("image", data.imageFile);

      const response = await apiClient.post<ApiResponse<Post>>(
        "/post",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    }

    // Fallback JSON payload when no image
    const response = await apiClient.post<ApiResponse<Post>>("/post", {
      title: data.title,
      content: data.content ?? "",
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.get<ApiResponse<Post>>(`/post/${id}`);
    return response.data;
  },

  // Get posts by user ID
  getPostsByUserId: async (
    userId: string,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Post>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      `/post/user/${userId}`,
      {
        params: {
          page,
          size,
        },
      }
    );
    return response.data;
  },

  // Get my posts (current authenticated user)
  getMyPosts: async (
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PaginatedResponse<Post>>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Post>>>(
      "/post/my-posts",
      { params: { page, size } }
    );
    return response.data;
  },

  // Update post
  updatePost: async (
    id: string,
    data: PostUpdateRequest
  ): Promise<ApiResponse<Post>> => {
    if (data.imageFile) {
      const formData = new FormData();
      if (data.title !== undefined) formData.append("title", data.title);
      if (data.content !== undefined) formData.append("content", data.content);
      formData.append("image", data.imageFile);

      const response = await apiClient.put<ApiResponse<Post>>(
        `/post/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    }

    const response = await apiClient.put<ApiResponse<Post>>(`/post/${id}`, {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.content !== undefined ? { content: data.content } : {}),
    });
    return response.data;
  },

  // Delete post
  deletePost: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/post/${id}`);
    return response.data;
  },

  // Like post
  likePost: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.post<ApiResponse<Post>>(
      `/post/${id}/like`
    );
    return response.data;
  },

  // Dislike post
  dislikePost: async (id: string): Promise<ApiResponse<Post>> => {
    const response = await apiClient.post<ApiResponse<Post>>(
      `/post/${id}/dislike`
    );
    return response.data;
  },
};

export default PostService;
