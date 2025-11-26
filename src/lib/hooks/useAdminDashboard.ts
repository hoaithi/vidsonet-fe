import { useState, useEffect } from "react";
import { ResultData, ProfileListResponse, VideoItem } from "@/types/dashboard";
import { AdminDashboardService } from "@/services/admin-dashboard-service";

export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<ResultData | null>(null);
  const [videosData, setVideosData] = useState<VideoItem[] | []>([]);
  const [profilesData, setProfilesData] = useState<ProfileListResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [dashboardRes, videosRes, profilesRes] = await Promise.all([
        AdminDashboardService.getAdminDashboardOverview(),
        AdminDashboardService.getAllVideos(0, 20),
        AdminDashboardService.getAllProfiles(0, 20),
      ]);

      // Safely set data with type narrowing
      if (dashboardRes.result) {
        setDashboardData(dashboardRes.result);
      }

      if (videosRes.result) {
        setVideosData(videosRes.result);
      }

      if (profilesRes.result) {
        setProfilesData(profilesRes.result);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  return {
    dashboardData,
    videosData,
    profilesData,
    loading,
    error,
    refreshDashboard,
  };
};
