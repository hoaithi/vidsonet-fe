// import { useState, useEffect } from "react";import { ResultData, ProfileListResponse, VideoItem } from "@/types/dashboard";// import { AdminDashboardService } from "@/services/admin-dashboard-service";// export const useAdminDashboard = () => {//   const [dashboardData, setDashboardData] = useState<ResultData | null>(null);//   const [videosData, setVideosData] = useState<VideoItem[] | []>([]);//   const [profilesData, setProfilesData] = useState<ProfileListResponse | null>(
//     null
//   );
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch all data in parallel
//       const [dashboardRes, videosRes, profilesRes] = await Promise.all([
//         AdminDashboardService.getAdminDashboardOverview(),
//         AdminDashboardService.getAllVideos(0, 20),
//         AdminDashboardService.getAllProfiles(0, 20),
//       ]);

//       // Safely set data with type narrowing
//       if (dashboardRes.result) {
//         setDashboardData(dashboardRes.result);
//       }

//       if (videosRes.result) {
//         setVideosData(videosRes.result?.content);
//       }

//       if (profilesRes.result) {
//         setProfilesData(profilesRes.result);
//       }
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch dashboard data");
//       console.error("Dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshDashboard = () => {
//     fetchDashboardData();
//   };

//   return {
//     dashboardData,
//     videosData,
//     profilesData,
//     loading,
//     error,
//     refreshDashboard,
//   };
// };

import { useState, useEffect } from "react";
import {
  ResultData,
  ProfileListResponse,
  VideoListResponse,
} from "@/types/dashboard";
import { AdminDashboardService } from "@/services/admin-dashboard-service";

export const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<ResultData | null>(null);
  const [videosData, setVideosData] = useState<VideoListResponse | null>(null);
  const [profilesData, setProfilesData] = useState<ProfileListResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Initial fetch - chỉ chạy 1 lần khi mount
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dashboardRes, profilesRes, videosRes] = await Promise.all([
          AdminDashboardService.getAdminDashboardOverview(),
          AdminDashboardService.getAllProfiles(0, 20),
          AdminDashboardService.getAllVideos(0, 20),
        ]);

        if (dashboardRes.result) setDashboardData(dashboardRes.result);
        if (profilesRes.result) setProfilesData(profilesRes.result);
        if (videosRes.result) setVideosData(videosRes.result);
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    initialFetch();
  }, []); // ← Safe vì không có external dependencies

  // ✅ Các hàm fetch riêng biệt để gọi từ component
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardRes =
        await AdminDashboardService.getAdminDashboardOverview();

      if (dashboardRes.result) {
        setDashboardData(dashboardRes.result);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async (
    page: number = 0,
    size: number = 20,
    search?: string,
    hasPassword?: boolean | null,
    sortBy: string = "createdAt",
    sortDirection: string = "desc"
  ) => {
    try {
      setError(null);

      const profilesRes = await AdminDashboardService.getAllProfiles(
        page,
        size,
        search,
        hasPassword,
        sortBy,
        sortDirection
      );

      if (profilesRes.result) {
        setProfilesData(profilesRes.result);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch profiles");
      console.error("Profiles fetch error:", err);
    }
  };

  const fetchVideos = async (
    page: number = 0,
    size: number = 20,
    search?: string,
    isPremium?: boolean | null,
    sortBy: string = "publishedAt",
    sortDirection: string = "desc"
  ) => {
    try {
      setError(null);

      const videosRes = await AdminDashboardService.getAllVideos(
        page,
        size,
        search,
        isPremium,
        sortBy,
        sortDirection
      );

      if (videosRes.result) {
        setVideosData(videosRes.result);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch videos");
      console.error("Videos fetch error:", err);
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
    fetchProfiles,
    fetchVideos,
    refreshDashboard,
  };
};
