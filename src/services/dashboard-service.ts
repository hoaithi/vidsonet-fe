import { ResultData, ResultDataSubscription } from "@/types/dashboard";
import apiClient, { ApiResponse } from "./api-client";

export const DashboardService = {
  // Get video by ID
  getDashboardByProfileId: async (
    profileId: string
  ): Promise<ApiResponse<ResultData>> => {
    const response = await apiClient.get<ApiResponse<ResultData>>(
      `/video/my/dashboard/${profileId}`
    );
    return response.data;
  },
};
