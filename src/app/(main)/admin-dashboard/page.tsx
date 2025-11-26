"use client";
import React, { useState } from "react";
import {
  BarChart3,
  Users,
  Video,
  DollarSign,
  MessageSquare,
  Flag,
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
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  const { dashboardData, videosData, profilesData, loading, error } =
    useAdminDashboard();
  const [timeRange, setTimeRange] = useState("7d");
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [videoSearch, setVideoSearch] = useState("");
  const [videoFilter, setVideoFilter] = useState("all");
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

  // Map API data to component stats
  const stats = {
    totalUsers: dashboardData?.totalUsers || 0,
    activeUsers:
      profilesData?.content.filter((p) => p.videoCount > 0).length || 0,
    totalVideos: dashboardData?.stats.totalVideos || 0,
    pendingVideos:
      videosData?.filter((v: VideoItem) => v.engagementScore === null).length ||
      0,
    totalViews: dashboardData?.stats.totalViews || 0,
    totalRevenue: 0, // Calculate if you have revenue data
    pendingReports: 0, // Add if you have reports endpoint
    newComments: dashboardData?.stats.totalComments || 0,
  };

  // Map profiles to users data
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
    videosData.map((video: VideoItem) => ({
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
      uploadDate: video.publishedAt.split("T")[0],
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
  videosData?.forEach((video: any) => {
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

  // Growth data - you'll need historical data for this
  const growthData = [
    {
      month: "Jan",
      users: stats.totalUsers * 0.67,
      videos: stats.totalVideos * 0.7,
      revenue: 42000,
    },
    {
      month: "Feb",
      users: stats.totalUsers * 0.73,
      videos: stats.totalVideos * 0.75,
      revenue: 43500,
    },
    {
      month: "Mar",
      users: stats.totalUsers * 0.78,
      videos: stats.totalVideos * 0.8,
      revenue: 44800,
    },
    {
      month: "Apr",
      users: stats.totalUsers * 0.84,
      videos: stats.totalVideos * 0.85,
      revenue: 46200,
    },
    {
      month: "May",
      users: stats.totalUsers * 0.89,
      videos: stats.totalVideos * 0.9,
      revenue: 47100,
    },
    {
      month: "Jun",
      users: stats.totalUsers * 0.94,
      videos: stats.totalVideos * 0.95,
      revenue: 47800,
    },
    {
      month: "Jul",
      users: stats.totalUsers,
      videos: stats.totalVideos,
      revenue: 48900,
    },
  ];

  // User demographics
  const userDemographicsData = [
    { name: "Active", value: stats.activeUsers, color: "#10B981" },
    {
      name: "Inactive",
      value: stats.totalUsers - stats.activeUsers,
      color: "#6B7280",
    },
    { name: "Banned", value: 0, color: "#EF4444" },
  ];

  // Export functions
  // Export functions - Sửa lại để generic
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) => {
            const key = h.toLowerCase().replace(/ /g, "");
            const value = (row as any)[key] ?? "";
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
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
      "profileName", // Đổi từ "user" sang "profileName" để match với VideoItem
      "viewCount", // Đổi từ "views" sang "viewCount"
      "likeCount", // Đổi từ "likes" sang "likeCount"
      "commentCount", // Đổi từ "comments" sang "commentCount"
      "duration",
      "publishedAt", // Đổi từ "uploadDate" sang "publishedAt"
    ]);
  };

  // const exportUsers = () => {
  //   const dataToExport =
  //     selectedUserIds.length > 0
  //       ? filteredUsers.filter((u) => selectedUserIds.includes(u.id))
  //       : filteredUsers;
  //   exportToCSV(dataToExport, "users_export", [
  //     "id",
  //     "name",
  //     "email",
  //     "status",
  //     "verified",
  //     "subscribers",
  //     "videos",
  //     "revenue",
  //     "joinDate",
  //     "lastActive",
  //   ]);
  // };

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

  // const exportVideos = () => {
  //   const dataToExport =
  //     selectedVideoIds.length > 0
  //       ? filteredVideos?.filter((v: any) => selectedVideoIds.includes(v.id))
  //       : filteredVideos;
  //   exportToCSV(dataToExport, "videos_export", [
  //     "id",
  //     "title",
  //     "user",
  //     "status",
  //     "views",
  //     "likes",
  //     "comments",
  //     "duration",
  //     "uploadDate",
  //     "category",
  //   ]);
  // };

  // Bulk selection handlers
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

  const filteredUsers = usersData.filter((user) => {
    const matchSearch =
      user?.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user?.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchFilter = userFilter === "all" || user?.status === userFilter;
    return matchSearch && matchFilter;
  });

  const filteredVideos = videosData_mapped?.filter((video) => {
    const matchSearch =
      video?.title?.toLowerCase().includes(videoSearch.toLowerCase()) ||
      video?.user?.toLowerCase().includes(videoSearch.toLowerCase());
    const matchFilter = videoFilter === "all" || video?.status === videoFilter;
    return matchSearch && matchFilter;
  });

  console.log("filteredVideos", filteredVideos);
  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <div
      className="bg-white rounded-lg shadow p-4 border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium">{title}</p>
          <p className="text-xl font-bold mt-1">{value.toLocaleString()}</p>
          {change && (
            <p
              className={`text-xs mt-1 ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
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

            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) =>
                  setFormData({ ...formData, verified: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <label htmlFor="verified" className="text-sm text-gray-700">
                Verified Creator
              </label>
            </div> */}

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

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

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
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">24h</option>
                <option value="7d">7 days</option>
                <option value="30d">30 days</option>
              </select>
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
            <TabButton id="reports" label="Reports" icon={Flag} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers}
                change={12.5}
                color="#3B82F6"
              />
              <StatCard
                icon={Video}
                title="Total Videos"
                value={stats.totalVideos}
                change={8.3}
                color="#8B5CF6"
              />
              <StatCard
                icon={Eye}
                title="Total Views"
                value={stats.totalViews}
                change={15.2}
                color="#10B981"
              />
              <StatCard
                icon={DollarSign}
                title="Revenue"
                value={stats.totalRevenue}
                change={-2.1}
                color="#F59E0B"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <div>
                  <p className="font-semibold text-yellow-800 text-sm">
                    Pending Videos
                  </p>
                  <p className="text-xl font-bold text-yellow-900">
                    {stats.pendingVideos}
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <Flag className="text-red-600" size={20} />
                <div>
                  <p className="font-semibold text-red-800 text-sm">
                    Pending Reports
                  </p>
                  <p className="text-xl font-bold text-red-900">
                    {stats.pendingReports}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <MessageSquare className="text-blue-600" size={20} />
                <div>
                  <p className="font-semibold text-blue-800 text-sm">
                    New Comments
                  </p>
                  <p className="text-xl font-bold text-blue-900">
                    {stats.newComments}
                  </p>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Platform Growth Trends
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="videos"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                  <Users size={18} />
                  User Demographics
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={userDemographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userDemographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <Video size={18} />
                Video Performance by Category
              </h3>
              {/* <ResponsiveContainer width="100%" height={300}>
                <BarChart data={videoPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8B5CF6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="videos"
                    fill="#8B5CF6"
                    name="Total Videos"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="views"
                    fill="#10B981"
                    name="Total Views"
                  />
                </BarChart>
              </ResponsiveContainer> */}
            </div>
          </div>
        )}

        {activeTab === "users" && (
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
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="banned">Banned</option>
                    </select>
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
                            <CheckSquare size={18} className="text-blue-600" />
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
                          selectedUserIds.includes(user.id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-3 py-2">
                          <button onClick={() => toggleUserSelection(user.id)}>
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
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium text-gray-800">
                                  {user.name}
                                </p>
                                {user.verified && (
                                  <Shield className="text-blue-500" size={14} />
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
        )}

        {activeTab === "videos" && (
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
                    videosData?.filter((v: VideoItem) => v.status === "pending")
                      .length
                  }
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <p className="text-xs text-gray-500">Approved</p>
                <p className="text-xl font-bold text-green-600">
                  {
                    videosData?.filter(
                      (v: VideoItem) => v.status === "approved"
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-3">
                <p className="text-xs text-gray-500">Flagged</p>
                <p className="text-xl font-bold text-red-600">
                  {
                    videosData?.filter((v: VideoItem) => v.status === "flagged")
                      .length
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
                    <select
                      value={videoFilter}
                      onChange={(e) => setVideoFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="flagged">Flagged</option>
                    </select>
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
                          {selectedVideoIds.length === filteredVideos?.length &&
                          filteredVideos.length > 0 ? (
                            <CheckSquare size={18} className="text-blue-600" />
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
                              onClick={() => deleteVideo(video.id, video.title)}
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
                        <Eye size={18} className="mx-auto text-gray-600 mb-1" />
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
                      {/* <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        {selectedVideo.category}
                      </span> */}
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
        )}

        {/* {activeTab === "reports" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-bold mb-4">Content Moderation</h2>
            <div className="space-y-3">
              {pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {report.type}
                      </span>
                      <span className="font-medium text-sm">
                        {report.content}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Reported by {report.reporter}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200">
                      <CheckCircle size={16} />
                    </button>
                    <button className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200">
                      <XCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
      <UserEditModal />
      <VideoEditModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default AdminDashboard;
