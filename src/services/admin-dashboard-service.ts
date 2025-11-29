// import {  ResultData,//   ProfileListResponse,
//   VideoItem,
//   VideoListResponse,
// } from "@/types/dashboard";
// import apiClient, { ApiResponse } from "./api-client";

// export const AdminDashboardService = {
//   // Get admin dashboard overview
//   getAdminDashboardOverview: async (): Promise<ApiResponse<ResultData>> => {
//     const response = await apiClient.get<ApiResponse<ResultData>>(
//       `/video/admin/dashboard`
//     );
//     return response.data;
//   },

//   // Get all videos with pagination
//   getAllVideos: async (
//     page: number = 0,
//     size: number = 20
//   ): Promise<ApiResponse<VideoListResponse>> => {
//     const response = await apiClient.get<ApiResponse<VideoListResponse>>(
//       `/video/all`,
//       {
//         params: { page, size },
//       }
//     );
//     return response.data;
//   },

//   // Get all profiles/users with pagination
//   getAllProfiles: async (
//     page: number = 0,
//     size: number = 20
//   ): Promise<ApiResponse<ProfileListResponse>> => {
//     const response = await apiClient.get<ApiResponse<ProfileListResponse>>(
//       `/profile/admin/all`,
//       {
//         params: { page, size },
//       }
//     );
//     return response.data;
//   },
// };

import {
  ResultData,
  ProfileListResponse,
  VideoListResponse,
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
};
