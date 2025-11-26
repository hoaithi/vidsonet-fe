"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Video,
  Eye,
  TrendingUp,
  TrendingDown,
  Flag,
  UserCheck,
  Clock,
  AlertTriangle,
  Shield,
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  EyeOff,
  UserX,
  Mail,
  Calendar,
  Heart,
  MessageSquare,
  ArrowUp,
  ArrowDown,
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

interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  views: string;
  likes: string;
  uploadDate: string;
  duration: string;
  status: string;
  owner: {
    name: string;
    avatar: string;
  };
  reports: any[];
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  isOnline: boolean;
  isActive: boolean;
  totalVideos: number;
  totalViews: string;
  subscribers: string;
  joinedDate: string;
  lastActivity: string;
  avatar: string;
  verificationStatus: string;
}
// ===================== ADMIN OVERVIEW PAGE =====================
function AdminOverviewPage() {
  const [metrics] = useState({
    totalUsers: "45,231",
    usersChange: "+12.5%",
    usersChangeType: "increase",
    activeUsers: "8,492",
    activeUsersChange: "+5.2%",
    activeUsersChangeType: "increase",
    totalVideos: "127,834",
    videosChange: "+8.1%",
    videosChangeType: "increase",
    totalViews: "2.4M",
    viewsChange: "+15.3%",
    viewsChangeType: "increase",
    reportsPending: 23,
    reportsChange: "-18.2%",
    reportsChangeType: "decrease",
  });

  const [analyticsData] = useState({
    userGrowth: [
      { date: "Jan", newUsers: 1200, activeUsers: 7800 },
      { date: "Feb", newUsers: 1850, activeUsers: 8200 },
      { date: "Mar", newUsers: 2100, activeUsers: 8600 },
      { date: "Apr", newUsers: 1950, activeUsers: 8400 },
      { date: "May", newUsers: 2300, activeUsers: 8900 },
      { date: "Jun", newUsers: 2850, activeUsers: 9200 },
    ],
    contentStats: [
      { category: "Tutorial", count: 45231 },
      { category: "Entertainment", count: 38492 },
      { category: "Tech Review", count: 25834 },
      { category: "Gaming", count: 18277 },
    ],
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: "user",
      message: "New user registered: alex@example.com",
      timestamp: "2 minutes ago",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "content",
      message: "Video reported for inappropriate content",
      timestamp: "5 minutes ago",
      icon: Flag,
      color: "text-red-600",
    },
    {
      id: 3,
      type: "system",
      message: "Database backup completed successfully",
      timestamp: "15 minutes ago",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      id: 4,
      type: "moderation",
      message: "Content review queue: 12 items pending",
      timestamp: "1 hour ago",
      icon: Clock,
      color: "text-yellow-600",
    },
  ]);

  const statsCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers,
      change: metrics.usersChange,
      changeType: metrics.usersChangeType,
      icon: Users,
      description: "Registered platform users",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Users",
      value: metrics.activeUsers,
      change: metrics.activeUsersChange,
      changeType: metrics.activeUsersChangeType,
      icon: Activity,
      description: "Active in last 30 days",
      gradient: "from-blue-600 to-blue-700",
    },
    {
      title: "Total Videos",
      value: metrics.totalVideos,
      change: metrics.videosChange,
      changeType: metrics.videosChangeType,
      icon: Video,
      description: "Published content",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Views",
      value: metrics.totalViews,
      change: metrics.viewsChange,
      changeType: metrics.viewsChangeType,
      icon: Eye,
      description: "All-time video views",
      gradient: "from-blue-600 to-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mt-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Admin Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage your platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
              {metrics.reportsPending} Reports Pending
            </Badge>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              View All Reports
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
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
                  <div className="flex items-center text-sm mt-1">
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
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">User Growth</CardTitle>
              <CardDescription className="text-gray-600">
                New users vs active users over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#2563EB"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#3B82F6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Content Distribution Chart */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">
                Content Distribution
              </CardTitle>
              <CardDescription className="text-gray-600">
                Video categories breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.contentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                    }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Recent Activities</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Latest system activities and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="p-2 rounded-full bg-white border border-gray-200">
                        <IconComponent
                          className={`w-4 h-4 ${activity.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">
                          {activity.message}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">
                Common admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <Flag className="w-4 h-4 mr-2" />
                Review Reports
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <Video className="w-4 h-4 mr-2" />
                Content Moderation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                System Health
              </Button>
              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  Emergency Actions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ===================== CONTENT MANAGEMENT PAGE =====================
function ContentManagementPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const mockVideos = [
      {
        _id: "1",
        title: "Advanced React Patterns & Best Practices 2024",
        thumbnail:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
        views: "245K",
        likes: "12.3K",
        uploadDate: "2024-03-15",
        duration: "24:31",
        status: "published",
        owner: { name: "Alex Chen", avatar: "https://i.pravatar.cc/150?img=1" },
        reports: [],
      },
      {
        _id: "2",
        title: "Machine Learning Tutorial for Beginners",
        thumbnail:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
        views: "89K",
        likes: "5.7K",
        uploadDate: "2024-03-14",
        duration: "18:45",
        status: "published",
        owner: { name: "Sarah Kim", avatar: "https://i.pravatar.cc/150?img=2" },
        reports: [],
      },
      {
        _id: "3",
        title: "Web Development Roadmap 2024",
        thumbnail:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
        views: "0",
        likes: "0",
        uploadDate: "2024-03-12",
        duration: "32:15",
        status: "draft",
        owner: {
          name: "Emma Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        reports: [],
      },
    ];
    setVideos(mockVideos);
    setFilteredVideos(mockVideos);
  }, []);

  const stats = {
    total: videos.length,
    published: videos.filter((v) => v.status === "published").length,
    draft: videos.filter((v) => v.status === "draft").length,
    reported: videos.filter((v) => v.reports && v.reports.length > 0).length,
  };

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </Badge>
        );
      case "removed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Removed
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mt-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Content Management
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and moderate platform content
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
            <Video className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Videos",
              value: stats.total,
              icon: Video,
              color: "text-blue-600",
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Published",
              value: stats.published,
              icon: CheckCircle,
              color: "text-green-600",
              gradient: "from-green-500 to-green-600",
            },
            {
              label: "Drafts",
              value: stats.draft,
              icon: Clock,
              color: "text-yellow-600",
              gradient: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Reported",
              value: stats.reported,
              icon: Flag,
              color: "text-red-600",
              gradient: "from-red-500 to-red-600",
            },
          ].map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search videos by title or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200 text-gray-900"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full md:w-48 bg-white border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="published">Published Only</SelectItem>
                  <SelectItem value="draft">Drafts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Videos Grid */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Content ({filteredVideos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video._id}
                  className="group rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden border border-gray-200"
                >
                  <div className="relative aspect-video bg-gray-200">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(video.status)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-gray-900 font-medium text-sm line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <img
                        src={video.owner.avatar}
                        alt={video.owner.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-gray-600 text-sm">
                        {video.owner.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {video.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1 text-red-500" />
                          {video.likes}
                        </span>
                      </div>
                      <span>
                        {new Date(video.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===================== USER MANAGEMENT PAGE =====================
function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mockUsers = [
      {
        _id: "1",
        fullName: "Alex Chen",
        email: "alex.chen@example.com",
        isOnline: true,
        isActive: true,
        totalVideos: 45,
        totalViews: "2.3M",
        subscribers: "125K",
        joinedDate: "2024-01-15",
        lastActivity: "2 minutes ago",
        avatar: "https://i.pravatar.cc/150?img=1",
        verificationStatus: "verified",
      },
      {
        _id: "2",
        fullName: "Sarah Kim",
        email: "sarah.kim@example.com",
        isOnline: false,
        isActive: true,
        totalVideos: 23,
        totalViews: "890K",
        subscribers: "45K",
        joinedDate: "2024-02-20",
        lastActivity: "1 hour ago",
        avatar: "https://i.pravatar.cc/150?img=2",
        verificationStatus: "pending",
      },
    ];
    setUsers(mockUsers);
  }, []);

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    verified: users.filter((u) => u.verificationStatus === "verified").length,
    online: users.filter((u) => u.isOnline).length,
  };

  const getVerificationBadge = (status: any) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (isActive: any, isOnline: any) => {
    if (isOnline)
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          Online
        </Badge>
      );
    if (isActive)
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          Active
        </Badge>
      );
    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
        Inactive
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mt-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage platform users and their permissions
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
            <Users className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Users",
              value: stats.total,
              icon: Users,
              gradient: "from-blue-500 to-blue-600",
            },
            {
              label: "Active Users",
              value: stats.active,
              icon: UserCheck,
              gradient: "from-green-500 to-green-600",
            },
            {
              label: "Verified",
              value: stats.verified,
              icon: Shield,
              gradient: "from-purple-500 to-purple-600",
            },
            {
              label: "Online Now",
              value: stats.online,
              icon: Activity,
              gradient: "from-blue-600 to-blue-700",
            },
          ].map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {user.fullName}
                        </h3>
                        {getVerificationBadge(user.verificationStatus)}
                        {getStatusBadge(user.isActive, user.isOnline)}
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined{" "}
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </span>
                        <span>Last active: {user.lastActivity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          Videos:{" "}
                          <span className="text-gray-900 font-medium">
                            {user.totalVideos}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Views:{" "}
                          <span className="text-gray-900 font-medium">
                            {user.totalViews}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Subs:{" "}
                          <span className="text-gray-900 font-medium">
                            {user.subscribers}
                          </span>
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 bg-white border-gray-200"
                      >
                        <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-900 hover:bg-gray-100">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-200" />
                        <DropdownMenuItem className="text-red-600 hover:bg-gray-100">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===================== MAIN APP COMPONENT =====================
export default function AdminPagesDemo() {
  const [currentPage, setCurrentPage] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage("overview")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentPage === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentPage("content")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentPage === "content"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Content Management
            </button>
            <button
              onClick={() => setCurrentPage("users")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                currentPage === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              User Management
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === "overview" && <AdminOverviewPage />}
      {currentPage === "content" && <ContentManagementPage />}
      {currentPage === "users" && <UserManagementPage />}
    </div>
  );
}
