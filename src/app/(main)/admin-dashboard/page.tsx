"use client";import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Video,
  MessageSquare,
  TrendingUp,
  Eye,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Ban,
  Shield,
  Mail,
  Trash2,
  FileSpreadsheet,
  CheckSquare,
  Square,
  X,
  Edit,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAdminDashboard } from "@/lib/hooks/useAdminDashboard";
import { ProfileItem, VideoItem } from "@/types/dashboard";

interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  verified: boolean;
  subscribers: number;
  videos: number;
  revenue: number;
  joinDate: string;
  lastActive: string;
}

interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  user: string;
  status: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  uploadDate: string;
  category: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    dashboardData,
    videosData,
    profilesData,
    growthData, // ✅ Lấy growthData từ hook
    loading: hookLoading, // ✅ Đổi tên để tránh conflict
    growthLoading, // ✅ Loading riêng cho growth data
    fetchVideos,
    fetchProfiles,
    fetchGrowthData, // ✅ Function để fetch growth data
  } = useAdminDashboard();
  const [userSearch, setUserSearch] = useState("");
  const [videoSearch, setVideoSearch] = useState("");

  const [userPage, setUserPage] = useState(0);
  const [userSize, setUserSize] = useState(20);
  // const [userSearch, setUserSearch] = useState("");
  const [userHasPassword, setUserHasPassword] = useState<boolean | null>(null);
  const [userSortBy, setUserSortBy] = useState("createdAt");
  const [userSortDirection, setUserSortDirection] = useState("desc");

  const [videoPage, setVideoPage] = useState(0);
  const [videoSize, setVideoSize] = useState(20);
  // const [videoSearch, setVideoSearch] = useState("");
  const [videoIsPremium, setVideoIsPremium] = useState<boolean | null>(null);
  const [videoSortBy, setVideoSortBy] = useState("publishedAt");
  const [videoSortDirection, setVideoSortDirection] = useState("desc");

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: "user" | "video";
    id: string;
    name: string;
  } | null>(null);

  const [timeRange, setTimeRange] = useState("week");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const loading = hookLoading || growthLoading;

  // ✅ FETCH PROFILES WITH FILTERS
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfiles(
        userPage,
        userSize,
        userSearch,
        userHasPassword,
        userSortBy,
        userSortDirection
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [
    userPage,
    userSize,
    userSearch,
    userHasPassword,
    userSortBy,
    userSortDirection,
  ]);

  // ✅ FETCH VIDEOS WITH FILTERS
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVideos(
        videoPage,
        videoSize,
        videoSearch,
        videoIsPremium,
        videoSortBy,
        videoSortDirection
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [
    videoPage,
    videoSize,
    videoSearch,
    videoIsPremium,
    videoSortBy,
    videoSortDirection,
  ]);

  useEffect(() => {
    console.log("Fetching growth data for timeRange:", timeRange);
    fetchGrowthData(timeRange, "previous", customStartDate, customEndDate);
  }, [timeRange, customStartDate, customEndDate]);

  const stats = {
    totalUsers: dashboardData?.totalUsers || 0,
    activeUsers:
      profilesData?.content.filter((p) => p.videoCount > 0).length || 0,
    totalVideos: dashboardData?.stats.totalVideos || 0,
    pendingVideos:
      videosData?.content?.filter((v: VideoItem) => v.engagementScore === null)
        .length || 0,
    totalViews: dashboardData?.stats.totalViews || 0,
    totalRevenue: 0,
    pendingReports: 0,
    newComments: dashboardData?.stats.totalComments || 0,
  };

  const TimeRangeSelector = () => (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Time Range:
            </span>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === "week"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === "month"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === "year"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Year
              </button>
              <button
                onClick={() => setShowCustomRange(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === "custom"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Custom
              </button>
            </div>
          </div>
        </div>

        {/* Growth Rates Display */}
        {growthData?.summary && (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
              <Users size={16} className="text-blue-600" />
              <span className="text-gray-700 font-medium">Users:</span>
              <span
                className={`font-bold ${
                  growthData.summary.userGrowthRate >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {growthData.summary.userGrowthRate > 0 ? "+" : ""}
                {growthData.summary.userGrowthRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
              <Video size={16} className="text-purple-600" />
              <span className="text-gray-700 font-medium">Videos:</span>
              <span
                className={`font-bold ${
                  growthData.summary.videoGrowthRate >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {growthData.summary.videoGrowthRate > 0 ? "+" : ""}
                {growthData.summary.videoGrowthRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
              <Eye size={16} className="text-orange-600" />
              <span className="text-gray-700 font-medium">Views:</span>
              <span
                className={`font-bold ${
                  growthData.summary.viewGrowthRate >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {growthData.summary.viewGrowthRate > 0 ? "+" : ""}
                {growthData.summary.viewGrowthRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg">
              <Heart size={16} className="text-red-600" />
              <span className="text-gray-700 font-medium">Engagement:</span>
              <span
                className={`font-bold ${
                  growthData.summary.engagementGrowthRate >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {growthData.summary.engagementGrowthRate > 0 ? "+" : ""}
                {growthData.summary.engagementGrowthRate.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const CustomRangeModal = () => {
    if (!showCustomRange) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Custom Date Range
            </h3>
            <button
              onClick={() => setShowCustomRange(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setTimeRange("custom");
                  setShowCustomRange(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply
              </button>
              <button
                onClick={() => setShowCustomRange(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const usersData =
    profilesData?.content.map((profile) => ({
      id: profile.id, // Convert UUID to number for UI
      name: profile.fullName,
      email: profile.email,
      status: profile.videoCount > 0 ? "active" : "inactive",
      verified: profile.hasPassword,
      subscribers: profile.subscriberCount,
      videos: profile.videoCount,
      revenue: 0, // Calculate if you have revenue data
      joinDate: profile.dob,
      lastActive: new Date().toISOString().split("T")[0],
    })) || [];

  // Map videos to videos data
  const videosData_mapped =
    videosData?.content?.map((video: VideoItem) => ({
      id: video.id,
      title: video.title,
      thumbnail: "🎬", // You can map categories to emojis
      user: video.profileName,
      status: video.engagementScore !== null ? "approved" : "pending",
      views: video.viewCount,
      likes: video.likeCount,
      comments: video.commentCount,
      duration: `${Math.floor(video.duration / 60)}:${Math.floor(
        video.duration % 60
      )
        .toString()
        .padStart(2, "0")}`,
      uploadDate: video?.publishedAt?.split("T")[0],
      category: video.isPremium ? "Premium" : "Standard",
    })) || [];

  // Top videos from dashboard
  const recentVideos =
    dashboardData?.topVideos.slice(0, 4).map((video) => ({
      id: parseInt(video.id.split("-")[0], 16),
      title: video.title,
      user: video.profileName,
      views: video.viewCount,
      status: video.engagementScore !== null ? "approved" : "pending",
      date: video.publishedAt.split("T")[0],
    })) || [];

  // Top creators (group by profileName and sum stats)
  const topCreatorsMap = new Map();
  videosData?.content?.forEach((video: any) => {
    if (topCreatorsMap.has(video.profileName)) {
      const existing = topCreatorsMap.get(video.profileName);
      existing.videos += 1;
      existing.subscribers += video.viewCount; // Using views as proxy
    } else {
      topCreatorsMap.set(video.profileName, {
        name: video.profileName,
        subscribers: video.viewCount,
        revenue: 0,
        videos: 1,
      });
    }
  });
  const topCreators = Array.from(topCreatorsMap.values())
    .sort((a, b) => b.subscribers - a.subscribers)
    .slice(0, 3);

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const value = (row as any)[h] ?? "";
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportUsers = () => {
    const dataToExport =
      selectedUserIds.length > 0
        ? filteredUsers.filter((u) => selectedUserIds.includes(u.id))
        : filteredUsers;
    exportToCSV(dataToExport, "users_export", [
      "id",
      "name",
      "email",
      "status",
      "verified",
      "subscribers",
      "videos",
      "revenue",
      "joinDate",
      "lastActive",
    ]);
  };

  const exportVideos = () => {
    const dataToExport =
      selectedVideoIds.length > 0
        ? (filteredVideos || []).filter((v) => selectedVideoIds.includes(v.id))
        : filteredVideos || [];

    exportToCSV(dataToExport, "videos_export", [
      "id",
      "title",
      "user",
      "status",
      "views",
      "likes",
      "comments",
      "duration",
      "uploadDate",
      "category",
    ]);
  };

  const updateUser = (updatedUser: UserData) => {
    alert(
      `User updated:\nName: ${updatedUser.name}\nStatus: ${updatedUser.status}\nVerified: ${updatedUser.verified}`
    );
    setEditingUser(null);
  };

  const deleteUser = (userId: string, userName: string) => {
    setShowDeleteConfirm({ type: "user", id: userId, name: userName });
  };

  const confirmDeleteUser = () => {
    if (showDeleteConfirm?.type === "user") {
      alert(`User "${showDeleteConfirm.name}" permanently deleted`);
      setShowDeleteConfirm(null);
    }
  };

  const updateVideo = (updatedVideo: VideoData) => {
    alert(
      `Video updated:\nTitle: ${updatedVideo.title}\nStatus: ${updatedVideo.status}`
    );
    setEditingVideo(null);
  };

  const deleteVideo = (videoId: string, videoTitle: string) => {
    setShowDeleteConfirm({ type: "video", id: videoId, name: videoTitle });
  };

  const confirmDeleteVideo = () => {
    if (showDeleteConfirm?.type === "video") {
      alert(`Video "${showDeleteConfirm.name}" permanently deleted`);
      setShowDeleteConfirm(null);
    }
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleVideoSelection = (id: string) => {
    setSelectedVideoIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAllUsers = () => {
    setSelectedUserIds(
      selectedUserIds.length === filteredUsers.length
        ? []
        : filteredUsers.map((u) => u.id)
    );
  };

  const selectAllVideos = () => {
    setSelectedVideoIds(
      selectedVideoIds.length === filteredVideos?.length
        ? []
        : filteredVideos?.map((v: any) => v.id)
    );
  };

  // Bulk actions
  const bulkBanUsers = () => {
    alert(`Banning ${selectedUserIds.length} users`);
    setSelectedUserIds([]);
  };
  const bulkVerifyUsers = () => {
    alert(`Verifying ${selectedUserIds.length} users`);
    setSelectedUserIds([]);
  };
  const bulkApproveVideos = () => {
    alert(`Approving ${selectedVideoIds.length} videos`);
    setSelectedVideoIds([]);
  };
  const bulkDeleteVideos = () => {
    if (confirm(`Delete ${selectedVideoIds.length} videos?`)) {
      alert("Deleted");
      setSelectedVideoIds([]);
    }
  };

  const filteredUsers = usersData;
  const filteredVideos = videosData_mapped;

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon size={28} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
        activeTab === id
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const UserEditModal = () => {
    if (!editingUser) return null;

    const [formData, setFormData] = useState(editingUser);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Edit User</h3>
            <button
              onClick={() => setEditingUser(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                Account recovery note: Status changes are logged for audit
                purposes.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => updateUser(formData)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VideoEditModal = () => {
    if (!editingVideo) return null;

    const [formData, setFormData] = useState(editingVideo);

    const videoStatuses = [
      "approved",
      "private",
      "unlisted",
      "restricted",
      "flagged",
      "blocked",
    ];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Edit Video</h3>
            <button
              onClick={() => setEditingVideo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {videoStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-purple-800 mb-2">
                Moderation Guidelines:
              </p>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Approved: Ready for public viewing</li>
                <li>• Restricted: Age/region limitations apply</li>
                <li>• Flagged: Under review for violations</li>
                <li>• Blocked: Policy violation detected</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => updateVideo(formData)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingVideo(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;

    const isUser = showDeleteConfirm.type === "user";
    const user = isUser
      ? usersData.find((u) => u.id === showDeleteConfirm.id)
      : null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-red-600">
              Permanent Deletion
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-gray-800 font-semibold">
              Delete {isUser ? "user" : "video"}: "{showDeleteConfirm.name}"?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-800 mb-2">
                ⚠️ This action cannot be undone.
              </p>
              {isUser && user && (
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• {user.videos} videos will be deleted</li>
                  <li>• {user.subscribers} subscribers will be notified</li>
                  <li>• GDPR compliance: Account data will be archived</li>
                  <li>• All associated comments will be removed</li>
                </ul>
              )}
              {!isUser && (
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Video will be permanently removed from platform</li>
                  <li>• All likes and comments will be deleted</li>
                  <li>• Cannot be recovered</li>
                </ul>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={isUser ? confirmDeleteUser : confirmDeleteVideo}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Permanently
            </button>
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
  }: any) => (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const UserFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800">User Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search name or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={
            userHasPassword === null
              ? "all"
              : userHasPassword
              ? "password"
              : "oauth"
          }
          onChange={(e) =>
            setUserHasPassword(
              e.target.value === "all" ? null : e.target.value === "password"
            )
          }
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="password">Has Password</option>
          <option value="oauth">OAuth Only</option>
        </select>

        <select
          value={userSortBy}
          onChange={(e) => setUserSortBy(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">Newest First</option>
          <option value="fullName">Name A-Z</option>
          <option value="subscriberCount">Most Subscribers</option>
          <option value="videoCount">Most Videos</option>
        </select>

        <select
          value={userSortDirection}
          onChange={(e) => setUserSortDirection(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );

  const VideoFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal size={20} className="text-purple-600" />
        <h3 className="font-semibold text-gray-800">Video Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search title or creator..."
            value={videoSearch}
            onChange={(e) => setVideoSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={
            videoIsPremium === null
              ? "all"
              : videoIsPremium
              ? "premium"
              : "standard"
          }
          onChange={(e) =>
            setVideoIsPremium(
              e.target.value === "all" ? null : e.target.value === "premium"
            )
          }
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Categories</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>

        <select
          value={videoSortBy}
          onChange={(e) => setVideoSortBy(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="publishedAt">Newest First</option>
          <option value="title">Title A-Z</option>
          <option value="viewCount">Most Viewed</option>
          <option value="likeCount">Most Liked</option>
        </select>

        <select
          value={videoSortDirection}
          onChange={(e) => setVideoSortDirection(e.target.value)}
          className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Video className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Video Sharing Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex gap-1 overflow-x-auto">
            <TabButton id="overview" label="Overview" icon={BarChart3} />
            <TabButton id="users" label="Users" icon={Users} />
            <TabButton id="videos" label="Videos" icon={Video} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <TimeRangeSelector />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                color="#3B82F6"
              />
              <StatCard
                icon={Video}
                title="Total Videos"
                value={stats.totalVideos}
                color="#8B5CF6"
              />
              <StatCard
                icon={Eye}
                title="Total Views"
                value={stats.totalViews}
                color="#F59E0B"
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading growth data...</p>
              </div>
            ) : growthData ? (
              <>
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Growth Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                      <TrendingUp size={22} className="text-blue-600" />
                      User Growth
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={growthData.currentPeriod}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="period"
                          style={{ fontSize: "12px" }}
                          stroke="#9CA3AF"
                        />
                        <YAxis style={{ fontSize: "12px" }} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="newUsers"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          name="New Users"
                          dot={{ fill: "#3B82F6", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          stroke="#10B981"
                          strokeWidth={3}
                          name="Active Users"
                          dot={{ fill: "#10B981", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Video Uploads Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                      <Video size={22} className="text-purple-600" />
                      Video Uploads
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={growthData.currentPeriod}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="period"
                          style={{ fontSize: "12px" }}
                          stroke="#9CA3AF"
                        />
                        <YAxis style={{ fontSize: "12px" }} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="newVideos"
                          fill="#8B5CF6"
                          name="New Videos"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* View Performance Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                      <Eye size={22} className="text-orange-600" />
                      View Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={growthData.currentPeriod}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="period"
                          style={{ fontSize: "12px" }}
                          stroke="#9CA3AF"
                        />
                        <YAxis style={{ fontSize: "12px" }} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="totalViews"
                          fill="#F59E0B"
                          name="Total Views"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Engagement Rate Chart */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                      <Heart size={22} className="text-red-600" />
                      Engagement Rate
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={growthData.currentPeriod}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="period"
                          style={{ fontSize: "12px" }}
                          stroke="#9CA3AF"
                        />
                        <YAxis style={{ fontSize: "12px" }} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="engagementRate"
                          stroke="#EF4444"
                          strokeWidth={3}
                          name="Engagement Rate %"
                          dot={{ fill: "#EF4444", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Growth Summary Stats */}
                {growthData.summary && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">
                      Growth Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">New Users</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {growthData.summary.totalNewUsers}
                        </p>
                        <p
                          className={`text-sm font-semibold mt-1 ${
                            growthData.summary.userGrowthRate >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {growthData.summary.userGrowthRate > 0 ? "+" : ""}
                          {growthData.summary.userGrowthRate.toFixed(1)}%
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">New Videos</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {growthData.summary.totalNewVideos}
                        </p>
                        <p
                          className={`text-sm font-semibold mt-1 ${
                            growthData.summary.videoGrowthRate >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {growthData.summary.videoGrowthRate > 0 ? "+" : ""}
                          {growthData.summary.videoGrowthRate.toFixed(1)}%
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">
                          Total Views
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {growthData.summary.totalViews.toLocaleString()}
                        </p>
                        <p
                          className={`text-sm font-semibold mt-1 ${
                            growthData.summary.viewGrowthRate >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {growthData.summary.viewGrowthRate > 0 ? "+" : ""}
                          {growthData.summary.viewGrowthRate.toFixed(1)}%
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Engagement</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {(
                            growthData.summary.totalLikes +
                            growthData.summary.totalComments
                          ).toLocaleString()}
                        </p>
                        <p
                          className={`text-sm font-semibold mt-1 ${
                            growthData.summary.engagementGrowthRate >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {growthData.summary.engagementGrowthRate > 0
                            ? "+"
                            : ""}
                          {growthData.summary.engagementGrowthRate.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-600 flex gap-4">
                      <span>
                        Current: {growthData.summary.startDate} to{" "}
                        {growthData.summary.endDate}
                      </span>
                      <span>
                        Previous: {growthData.summary.comparisonStartDate} to{" "}
                        {growthData.summary.comparisonEndDate}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No growth data available</p>
              </div>
            )}

            {/* Recent Videos & Top Creators */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                    <Video size={18} />
                    Recent Videos
                  </h3>
                  <div className="space-y-2">
                    {recentVideos.map((video) => (
                      <div
                        key={video.id}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {video.user} • {video.views.toLocaleString()} views
                          </p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${
                            video.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : video.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {video.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Top Creators
                  </h3>
                  <div className="space-y-2">
                    {topCreators.map((creator, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {creator.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {creator.subscribers.toLocaleString()} subs
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 text-sm">
                            ${creator.revenue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {creator.videos} videos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <>
            <UserFilters />
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Total Users</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Active Users</p>
                  <p className="text-xl font-bold text-green-600">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Verified</p>
                  <p className="text-xl font-bold text-blue-600">
                    {usersData.filter((u) => u.verified).length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Banned</p>
                  <p className="text-xl font-bold text-red-600">
                    {usersData.filter((u) => u.status === "banned").length}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h2 className="text-lg font-bold">User Management</h2>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                        />
                      </div>
                      <button
                        onClick={exportUsers}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      >
                        <FileSpreadsheet size={16} />
                        Export{" "}
                        {selectedUserIds.length > 0
                          ? `(${selectedUserIds.length})`
                          : ""}
                      </button>
                    </div>
                  </div>

                  {selectedUserIds.length > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg flex flex-wrap items-center gap-2">
                      <span className="text-sm text-blue-800 font-medium">
                        {selectedUserIds.length} selected
                      </span>
                      <button
                        onClick={bulkVerifyUsers}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <Shield size={14} />
                        Verify
                      </button>
                      <button
                        onClick={bulkBanUsers}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Ban size={14} />
                        Ban
                      </button>
                      <button
                        onClick={() => setSelectedUserIds([])}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          <button onClick={selectAllUsers}>
                            {selectedUserIds.length === filteredUsers.length &&
                            filteredUsers.length > 0 ? (
                              <CheckSquare
                                size={18}
                                className="text-blue-600"
                              />
                            ) : (
                              <Square size={18} className="text-gray-400" />
                            )}
                          </button>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          User
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Subs
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Videos
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Revenue
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 ${
                            selectedUserIds.includes(user.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2">
                            <button
                              onClick={() => toggleUserSelection(user.id)}
                            >
                              {selectedUserIds.includes(user.id) ? (
                                <CheckSquare
                                  size={18}
                                  className="text-blue-600"
                                />
                              ) : (
                                <Square size={18} className="text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {user?.name?.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <p className="font-medium text-gray-800">
                                    {user.name}
                                  </p>
                                  {user.verified && (
                                    <Shield
                                      className="text-blue-500"
                                      size={14}
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : user.status === "inactive"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {user.subscribers.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {user.videos}
                          </td>
                          <td className="px-3 py-2 font-medium text-green-600">
                            ${user.revenue.toLocaleString()}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                                title="Email"
                              >
                                <Mail size={16} />
                              </button>
                              {user.status !== "banned" ? (
                                <button
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                  title="Ban"
                                >
                                  <Ban size={16} />
                                </button>
                              ) : (
                                <button
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                  title="Unban"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                onClick={() => deleteUser(user.id, user.name)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No users found
                  </div>
                )}
              </div>

              {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h3 className="text-lg font-bold">User Details</h3>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {selectedUser.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-bold">
                              {selectedUser.name}
                            </h4>
                            {selectedUser.verified && (
                              <Shield className="text-blue-500" size={18} />
                            )}
                          </div>
                          <p className="text-gray-500 text-sm">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="font-semibold capitalize">
                            {selectedUser.status}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Subscribers</p>
                          <p className="font-semibold">
                            {selectedUser.subscribers.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Videos</p>
                          <p className="font-semibold">{selectedUser.videos}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="font-semibold text-green-600">
                            ${selectedUser.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 text-sm">
                          <Mail size={16} />
                          Email
                        </button>
                        {selectedUser.status !== "banned" ? (
                          <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 text-sm">
                            <Ban size={16} />
                            Ban
                          </button>
                        ) : (
                          <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-sm">
                            <CheckCircle size={16} />
                            Unban
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Pagination
              currentPage={userPage}
              totalPages={profilesData?.totalPages || 1}
              onPageChange={setUserPage}
              pageSize={userSize}
              onPageSizeChange={setUserSize}
            />
          </>
        )}

        {activeTab === "videos" && (
          <>
            <VideoFilters />
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Total Videos</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.totalVideos.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {
                      videosData?.content?.filter(
                        (v: VideoItem) => v.status === "pending"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Approved</p>
                  <p className="text-xl font-bold text-green-600">
                    {
                      videosData?.content?.filter(
                        (v: VideoItem) => v.status === "approved"
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                  <p className="text-xs text-gray-500">Flagged</p>
                  <p className="text-xl font-bold text-red-600">
                    {
                      videosData?.content?.filter(
                        (v: VideoItem) => v.status === "flagged"
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h2 className="text-lg font-bold">Video Management</h2>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={videoSearch}
                          onChange={(e) => setVideoSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                        />
                      </div>
                      <button
                        onClick={exportVideos}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      >
                        <FileSpreadsheet size={16} />
                        Export{" "}
                        {selectedVideoIds.length > 0
                          ? `(${selectedVideoIds?.length})`
                          : ""}
                      </button>
                    </div>
                  </div>

                  {selectedVideoIds.length > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg flex flex-wrap items-center gap-2">
                      <span className="text-sm text-blue-800 font-medium">
                        {selectedVideoIds.length} selected
                      </span>
                      <button
                        onClick={bulkApproveVideos}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        onClick={bulkDeleteVideos}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedVideoIds([])}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left">
                          <button onClick={selectAllVideos}>
                            {selectedVideoIds.length ===
                              filteredVideos?.length &&
                            filteredVideos.length > 0 ? (
                              <CheckSquare
                                size={18}
                                className="text-blue-600"
                              />
                            ) : (
                              <Square size={18} className="text-gray-400" />
                            )}
                          </button>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Video
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Creator
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Views
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Engagement
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredVideos?.map((video) => (
                        <tr
                          key={video.id}
                          className={`hover:bg-gray-50 ${
                            selectedVideoIds.includes(video?.id)
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2">
                            <button
                              onClick={() => toggleVideoSelection(video.id)}
                            >
                              {selectedVideoIds.includes(video.id) ? (
                                <CheckSquare
                                  size={18}
                                  className="text-blue-600"
                                />
                              ) : (
                                <Square size={18} className="text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-2xl">
                                {video.thumbnail}
                              </div>
                              <div className="max-w-[150px]">
                                <p className="font-medium text-gray-800 truncate">
                                  {video.title}
                                </p>
                                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  {"game"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {video.user}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                video.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : video.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {video.status}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Eye size={14} />
                              {video.views.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="flex items-center gap-0.5">
                                <Heart size={12} className="text-red-500" />
                                {video.likes.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <MessageSquare
                                  size={12}
                                  className="text-blue-500"
                                />
                                {video?.comments}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setSelectedVideo(video)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              {video.status === "pending" && (
                                <>
                                  <button
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                    title="Approve"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                    title="Reject"
                                  >
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setEditingVideo(video)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  deleteVideo(video.id, video.title)
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredVideos?.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No videos found
                  </div>
                )}
              </div>

              {selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h3 className="text-lg font-bold">Video Details</h3>
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="w-full aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-5xl">
                        {selectedVideo.thumbnail}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1">
                          {selectedVideo.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {selectedVideo.user} • {selectedVideo.duration} •{" "}
                          {new Date(
                            selectedVideo.uploadDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <Eye
                            size={18}
                            className="mx-auto text-gray-600 mb-1"
                          />
                          <p className="font-bold">
                            {selectedVideo.views.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Views</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <Heart
                            size={18}
                            className="mx-auto text-red-500 mb-1"
                          />
                          <p className="font-bold">
                            {selectedVideo.likes.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Likes</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <MessageSquare
                            size={18}
                            className="mx-auto text-blue-500 mb-1"
                          />
                          <p className="font-bold">
                            {selectedVideo.comments.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Comments</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            selectedVideo.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : selectedVideo.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedVideo.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {selectedVideo.status === "pending" && (
                          <>
                            <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-sm">
                              <CheckCircle size={16} />
                              Approve
                            </button>
                            <button className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-1 text-sm">
                              <XCircle size={16} />
                              Reject
                            </button>
                          </>
                        )}
                        <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 text-sm">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Pagination
              currentPage={videoPage}
              totalPages={videosData?.totalPages || 1}
              onPageChange={setVideoPage}
              pageSize={videoSize}
              onPageSizeChange={setVideoSize}
            />
          </>
        )}
      </div>
      <UserEditModal />
      <VideoEditModal />
      <DeleteConfirmModal />
      <CustomRangeModal />
    </div>
  );
};

export default AdminDashboard;
