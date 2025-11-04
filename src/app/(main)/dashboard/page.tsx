"use client";import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  Users,
  DollarSign,
  Play,
  MoreHorizontal,
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

// Types
type SortOption = "views" | "likes" | "date" | "duration";

interface DashboardVideo {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  views: string;
  likes: string;
  viewsNum: number;
  likesNum: number;
  dateNum: number;
  durationNum: number;
}

// Mock Data
const mockVideos: DashboardVideo[] = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    duration: "12:45",
    uploadDate: "2 days ago",
    views: "15.2K",
    likes: "1.2K",
    viewsNum: 15200,
    likesNum: 1200,
    dateNum: 2,
    durationNum: 765,
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
    duration: "18:30",
    uploadDate: "5 days ago",
    views: "23.5K",
    likes: "2.1K",
    viewsNum: 23500,
    likesNum: 2100,
    dateNum: 5,
    durationNum: 1110,
  },
  {
    id: 3,
    title: "Building a Full-Stack App",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
    duration: "25:15",
    uploadDate: "1 week ago",
    views: "31.8K",
    likes: "3.4K",
    viewsNum: 31800,
    likesNum: 3400,
    dateNum: 7,
    durationNum: 1515,
  },
];

const viewsData = [
  { date: "Jan", views: 12000 },
  { date: "Feb", views: 19000 },
  { date: "Mar", views: 15000 },
  { date: "Apr", views: 25000 },
  { date: "May", views: 22000 },
  { date: "Jun", views: 30000 },
];

const engagementData = [
  { metric: "Likes", value: 8500 },
  { metric: "Comments", value: 3200 },
  { metric: "Shares", value: 1800 },
  { metric: "Saves", value: 2400 },
];

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
      <Button
        onClick={onViewAnalytics}
        className="bg-blue-600 hover:bg-blue-700 text-white border-0"
      >
        View Analytics
      </Button>
    </div>
  );
}

// Overview Stats Cards Component
function OverviewStatsCards() {
  const statsData = [
    {
      title: "Total Views",
      value: "1.2M",
      change: "+12.5%",
      changeType: "increase",
      icon: Eye,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Subscribers",
      value: "45.2K",
      change: "+8.3%",
      changeType: "increase",
      icon: Users,
      gradient: "from-blue-600 to-blue-700",
    },
    {
      title: "Total Likes",
      value: "89.5K",
      change: "+15.2%",
      changeType: "increase",
      icon: Heart,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+22.1%",
      changeType: "increase",
      icon: DollarSign,
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
function DashboardCharts() {
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

// Videos Table Component
function VideosTable({
  videos,
  sortBy,
  onSortChange,
  onVideoAction,
}: {
  videos: DashboardVideo[];
  sortBy: SortOption;
  onSortChange: (sort: string) => void;
  onVideoAction: (action: string, videoId: number) => void;
}) {
  const sortOptions = [
    { value: "views", label: "Most Views" },
    { value: "likes", label: "Most Likes" },
    { value: "date", label: "Newest First" },
    { value: "duration", label: "Longest First" },
  ];

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
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48 bg-gray-100 border-gray-200 text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 text-gray-900 z-50">
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <h3 className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-500 text-sm">{video.uploadDate}</p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{video.likes}</span>
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

  const sortedVideos = useMemo(() => {
    const sorted = [...mockVideos];
    switch (sortBy) {
      case "views":
        return sorted.sort((a, b) => b.viewsNum - a.viewsNum);
      case "likes":
        return sorted.sort((a, b) => b.likesNum - a.likesNum);
      case "date":
        return sorted.sort((a, b) => a.dateNum - b.dateNum);
      case "duration":
        return sorted.sort((a, b) => b.durationNum - a.durationNum);
      default:
        return sorted;
    }
  }, [sortBy]);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  const handleVideoAction = (action: string, videoId: number) => {
    console.log(`Action: ${action}, Video ID: ${videoId}`);
    alert(`${action} video ${videoId}`);
  };

  const handleViewAnalytics = () => {
    console.log("View Analytics clicked");
    alert("Opening analytics page...");
  };

  return (
    <div className="min-h-screen text-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader onViewAnalytics={handleViewAnalytics} />
        <OverviewStatsCards />
        <DashboardCharts />
        <VideosTable
          videos={sortedVideos}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          onVideoAction={handleVideoAction}
        />
      </div>
    </div>
  );
}
