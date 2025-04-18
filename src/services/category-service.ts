import apiClient, { ApiResponse } from './api-client';
import { Category } from '@/types/video';

export const CategoryService = {
  // Get all categories
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }
};

export default CategoryService;