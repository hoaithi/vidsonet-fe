"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  Users,
  MessageSquare,
  Play,
  MoreHorizontal,
  Video,
  ThumbsDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import { DashboardService } from "@/services/dashboard-service";
import {
  ResultData,
  ResultDataSubscription,
  TopVideo,
} from "@/types/dashboard";
import { useAuthStore } from "@/store/auth-store";

type SortOption = "views" | "likes" | "date" | "engagement";

interface DashboardVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  views: string;
  likes: string;
  viewsNum: number;
  likesNum: number;
  dateNum: number;
  engagementNum: number;
  comments: number;
  dislikes: number;
}

// Header Component
function DashboardHeader({ onViewAnalytics }: { onViewAnalytics: () => void }) {
  return (
    <div className="flex items-center justify-between mt-10">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Creator Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Track your channel's performance and growth
        </p>
      </div>
    </div>
  );
}

// Overview Stats Cards Component
function OverviewStatsCards({
  stats,
  subscriberCount,
}: {
  stats: ResultData["stats"] | null;
  subscriberCount: number;
}) {
  const statsData = [
    {
      title: "Total Views",
      value: stats ? stats.totalViews.toLocaleString() : "0",
      change: "+12.5%",
      changeType: "increase",
      icon: Eye,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Subscribers",
      value: subscriberCount.toLocaleString(),
      change: "+8.3%",
      changeType: "increase",
      icon: Users,
      gradient: "from-blue-600 to-blue-700",
    },
    {
      title: "Total Likes",
      value: stats ? stats.totalLikes.toLocaleString() : "0",
      change: "+15.2%",
      changeType: "increase",
      icon: Heart,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Videos",
      value: stats ? stats.videoCount.toString() : "0",
      change: "+5.0%",
      changeType: "increase",
      icon: Video,
      gradient: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        const isIncrease = stat.changeType === "increase";

        return (
          <Card key={index} className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}
              >
                <IconComponent className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="flex items-center text-sm">
                {isIncrease ? (
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={isIncrease ? "text-green-500" : "text-red-500"}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Dashboard Charts Component
function DashboardCharts({ stats }: { stats: ResultData["stats"] | null }) {
  const engagementData = stats
    ? [
        { metric: "Likes", value: stats.totalLikes },
        { metric: "Dislikes", value: stats.totalDislikes },
        { metric: "Comments", value: stats.totalComments },
        { metric: "Views", value: Math.floor(stats.totalViews / 100) }, // Scale down for better visualization
      ]
    : [];

  // Mock monthly data - you can replace this with real data from your API
  const viewsData = [
    { date: "Jan", views: 0 },
    { date: "Feb", views: 0 },
    { date: "Mar", views: 0 },
    { date: "Apr", views: 0 },
    { date: "May", views: 0 },
    { date: "Jun", views: stats?.totalViews || 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Views Over Time</CardTitle>
          <CardDescription className="text-gray-600">
            Monthly view statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                }}
                labelStyle={{ color: "#374151" }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Engagement Breakdown</CardTitle>
          <CardDescription className="text-gray-600">
            User interaction metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="metric" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                }}
                labelStyle={{ color: "#374151" }}
              />
              <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// Format duration from seconds to MM:SS
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Format number to K/M format
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Videos Table Component
function VideosTable({
  videos,
  sortBy,
  onSortChange,
  onVideoAction,
  loading,
}: {
  videos: DashboardVideo[];
  sortBy: SortOption;
  onSortChange: (sort: string) => void;
  onVideoAction: (action: string, videoId: string) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Your Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading videos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Your Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">No videos found</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900">Your Videos</CardTitle>
            <CardDescription className="text-gray-600">
              Manage and track your video performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-8 h-8 text-white" fill="white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors truncate">
                  {video.title}
                </h3>
                <p className="text-gray-500 text-sm">{video.uploadDate}</p>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{video.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsDown className="w-4 h-4 text-gray-400" />
                  <span>{video.dislikes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>{video.comments}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-white border-gray-200"
                  align="end"
                >
                  <DropdownMenuItem
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={() => onVideoAction("watch", video.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Watch
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={() => onVideoAction("edit", video.id)}
                  >
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-gray-900 hover:bg-gray-100"
                    onClick={() => onVideoAction("analytics", video.id)}
                  >
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 hover:bg-gray-100"
                    onClick={() => onVideoAction("delete", video.id)}
                  >
                    Delete Video
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Dashboard Page Component
export default function DashboardPage() {
  const [sortBy, setSortBy] = useState<SortOption>("views");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ResultData | undefined>(
    undefined
  );
  const [subscriptionData, setSubscriptionData] = useState<
    ResultDataSubscription | undefined
  >(undefined);

  const { profile } = useAuthStore();

  // Replace with actual profileId from auth context or props
  const profileId = profile?.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!profileId) return;
        setLoading(true);

        // Fetch both dashboard stats and subscription data
        const [dashboardResponse, subscriptionResponse] = await Promise.all([
          DashboardService.getDashboardByProfileId(profileId),
          DashboardService.getDashboarSubscribersById(profileId),
        ]);

        setDashboardData(dashboardResponse.result);
        setSubscriptionData(subscriptionResponse.result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // You can add error handling UI here
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profileId]);

  // Transform API data to dashboard video format
  const videos: DashboardVideo[] = useMemo(() => {
    if (!dashboardData?.topVideos) return [];

    return dashboardData.topVideos.map((video: TopVideo) => ({
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnailUrl,
      duration: formatDuration(video.duration),
      uploadDate: formatDate(video.publishedAt),
      views: formatNumber(video.viewCount),
      likes: formatNumber(video.likeCount),
      viewsNum: video.viewCount,
      likesNum: video.likeCount,
      dateNum: new Date(video.publishedAt).getTime(),
      engagementNum: video.engagementScore,
      comments: video.commentCount,
      dislikes: video.dislikeCount,
    }));
  }, [dashboardData]);

  const sortedVideos = useMemo(() => {
    const sorted = [...videos];
    switch (sortBy) {
      case "views":
        return sorted.sort((a, b) => b.viewsNum - a.viewsNum);
      case "likes":
        return sorted.sort((a, b) => b.likesNum - a.likesNum);
      case "date":
        return sorted.sort((a, b) => b.dateNum - a.dateNum);
      case "engagement":
        return sorted.sort((a, b) => b.engagementNum - a.engagementNum);
      default:
        return sorted;
    }
  }, [videos, sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const handleVideoAction = (action: string, videoId: string) => {
    console.log(`Action: ${action}, Video ID: ${videoId}`);
    // Implement actual actions here
    switch (action) {
      case "watch":
        window.open(`/watch/${videoId}`, "_blank");
        break;
      case "edit":
        // Navigate to edit page
        break;
      case "analytics":
        // Navigate to analytics page
        break;
      case "delete":
        // Show confirmation dialog and delete
        break;
    }
  };

  const handleViewAnalytics = () => {
    console.log("View Analytics clicked");
    // Navigate to analytics page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader onViewAnalytics={handleViewAnalytics} />
        <OverviewStatsCards
          stats={dashboardData?.stats || null}
          subscriberCount={subscriptionData?.subscriberCount || 0}
        />
        <DashboardCharts stats={dashboardData?.stats || null} />
        <VideosTable
          videos={sortedVideos}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onVideoAction={handleVideoAction}
          loading={loading}
        />
      </div>
    </div>
  );
}
