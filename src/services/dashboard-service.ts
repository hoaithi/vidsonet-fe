import {
  MembershipMonthlyStatsResponse,
  ResultData,
  ResultDataSubscription,
  ResultPaymentData,
  VideoMonthlyStatsResponse,
} from "@/types/dashboard";
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

  getDashboardPaymentByProfileId: async (
    profileId: string
  ): Promise<ApiResponse<ResultPaymentData>> => {
    const response = await apiClient.get<ApiResponse<ResultPaymentData>>(
      `/memberships/stats/channel/${profileId}`
    );
    return response.data;
  },

  async getMonthlyStatsByProfileId(
    profileId: string,
    months: number = 6
  ): Promise<ApiResponse<MembershipMonthlyStatsResponse>> {
    const response = await apiClient.get<
      ApiResponse<MembershipMonthlyStatsResponse>
    >(`/memberships/stats/monthly/${profileId}?months=${months}`);

    return response.data;
  },

  async getMonthlyVideoStatsByProfileId(
    profileId: string,
    months: number = 6
  ): Promise<ApiResponse<VideoMonthlyStatsResponse>> {
    const response = await apiClient.get<
      ApiResponse<VideoMonthlyStatsResponse>
    >(`/video/monthly/${profileId}`);
    return response.data;
  },
};
