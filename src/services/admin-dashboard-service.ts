import {
  ResultData,
  ProfileListResponse,
  VideoListResponse,
  GrowthDataResponse,
} from "@/types/dashboard";
import apiClient, { ApiResponse } from "./api-client";

export const AdminDashboardService = {
  // Get admin dashboard overview
  getAdminDashboardOverview: async (): Promise<ApiResponse<ResultData>> => {
    const response = await apiClient.get<ApiResponse<ResultData>>(
      `/video/admin/dashboard`
    );
    return response.data;
  },

  // Get all videos with pagination, search, filter and sort
  getAllVideos: async (
    page: number = 0,
    size: number = 20,
    search?: string,
    isPremium?: boolean | null,
    sortBy: string = "publishedAt",
    sortDirection: string = "desc"
  ): Promise<ApiResponse<VideoListResponse>> => {
    const params: any = {
      page,
      size,
      sortBy,
      sortDirection,
    };

    if (search) {
      params.search = search;
    }

    if (isPremium !== null && isPremium !== undefined) {
      params.isPremium = isPremium;
    }

    const response = await apiClient.get<ApiResponse<VideoListResponse>>(
      `/video/all`,
      { params }
    );
    return response.data;
  },

  // Get all profiles/users with pagination, search, filter and sort
  getAllProfiles: async (
    page: number = 0,
    size: number = 20,
    search?: string,
    hasPassword?: boolean | null,
    sortBy: string = "createdAt",
    sortDirection: string = "desc"
  ): Promise<ApiResponse<ProfileListResponse>> => {
    const params: any = {
      page,
      size,
      sortBy,
      sortDirection,
    };

    if (search) {
      params.search = search;
    }

    if (hasPassword !== null && hasPassword !== undefined) {
      params.hasPassword = hasPassword;
    }

    const response = await apiClient.get<ApiResponse<ProfileListResponse>>(
      `/profile/admin/all`,
      { params }
    );
    return response.data;
  },

  getGrowthData: async (
    timeRange: string = "week",
    comparisonType: string = "previous",
    customStartDate?: string,
    customEndDate?: string
  ): Promise<ApiResponse<GrowthDataResponse>> => {
    const params = new URLSearchParams({
      timeRange,
      comparisonType,
    });

    if (timeRange === "custom" && customStartDate && customEndDate) {
      params.append("customStartDate", customStartDate);
      params.append("customEndDate", customEndDate);
    }

    const response = await apiClient.get<ApiResponse<GrowthDataResponse>>(
      `video/admin/growth-data?${params.toString()}`
    );

    return response.data;
  },

    // Delete a video by ID
  deleteVideo: async (videoId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/video/${videoId}`
    );
    return response.data;
  },

  // Delete a user/profile by ID
  deleteProfile: async (profileId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/profile/${profileId}`
    );
    return response.data;
  },

};
