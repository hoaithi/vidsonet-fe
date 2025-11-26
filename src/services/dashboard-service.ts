import { ResultData, ResultDataSubscription } from "@/types/dashboard";
import apiClient, { ApiResponse } from "./api-client";

export const DashboardService = {
  // Get video by ID
  getDashboardByProfileId: async (
    profileId: string
  ): Promise<ApiResponse<ResultData>> => {
    const response = await apiClient.get<ApiResponse<ResultData>>(
      `/video/dashboard/${profileId}`
    );
    return response.data;
  },

  // Get video by ID
  getDashboarSubscribersById: async (
    profileId: string
  ): Promise<ApiResponse<ResultDataSubscription>> => {
    const response = await apiClient.get<ApiResponse<ResultDataSubscription>>(
      `/subscription/stats/subscribers/${profileId}`
    );
    return response.data;
  },
};
