import { ResultData, ProfileListResponse, VideoItem } from "@/types/dashboard";
import apiClient, { ApiResponse } from "./api-client";

export const AdminDashboardService = {
  // Get admin dashboard overview
  getAdminDashboardOverview: async (): Promise<ApiResponse<ResultData>> => {
    const response = await apiClient.get<ApiResponse<ResultData>>(
      `/video/admin/dashboard`
    );
    return response.data;
  },

  // Get all videos with pagination
  getAllVideos: async (
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<VideoItem[]>> => {
    const response = await apiClient.get<ApiResponse<VideoItem[]>>(
      `/video/all`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  // Get all profiles/users with pagination
  getAllProfiles: async (
    page: number = 0,
    size: number = 20
  ): Promise<ApiResponse<ProfileListResponse>> => {
    const response = await apiClient.get<ApiResponse<ProfileListResponse>>(
      `/profile/admin/all`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },
};
