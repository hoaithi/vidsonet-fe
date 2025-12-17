export interface Stats {
  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  totalVideos?: number;
}

export interface TopVideo {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  viewCount: number;
  thumbnailUrl: string;
  videoUrl: string;
  profileId: string;
  profileImage: string | null;
  profileName: string;
  publishedAt: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  hearted: boolean;
  engagementScore: number | null;
  isPremium: boolean;
}

export interface ResultPaymentData {
  totalMemberships: number;
  activeMemberships: number;
  totalMembershipTiers: number;
  activeMembershipTiers: number;
  totalPayments: number;
  completedPayments: number;
  totalRevenue: number;
  totalMembers: number;
  channelRevenue: number;
}

export interface MonthlyStatsDTO {
  month: string; // "Jan 2024"
  year: number;
  monthNumber: number;
  newMembers: number;
  totalMembers: number; // Cumulative
  revenue: number;
  cumulativeRevenue: number;
  newPayments: number;
}

export interface MembershipMonthlyStatsResponse {
  monthlyData: MonthlyStatsDTO[];
  overallStats: ResultPaymentData;
  totalMonths: number;
  startDate: string;
  endDate: string;
}

export interface ResultData {
  stats: Stats;
  totalUsers?: number;
  topVideos: TopVideo[];
}

// NEW: Interface for Video List API
export interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  viewCount: number;
  thumbnailUrl: string;
  videoUrl: string;
  profileId: string;
  profileImage: string | null;
  profileName: string;
  publishedAt: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  hearted: boolean;
  engagementScore: number | null;
  isPremium: boolean;
  status?: "approved" | "flagged" | "pending" | "private" | "deleted";
}

// export interface VideoListResponse {
//   content: VideoItem[];
//   totalElements: number;
//   totalPages: number;
//   size: number;
//   number: number;
// }

// NEW: Interface for Profile/User List API
export interface ProfileItem {
  id: string;
  userId: string;
  fullName: string;
  dob: string;
  city: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  email: string;
  description: string | null;
  hasPassword: boolean;
  videoCount: number;
  subscriberCount: number;
  subscribingCount: number;
  totalViews: number | null;
  status: "active" | "suspended" | "deleted";
}

export interface ProfileListResponse {
  content: ProfileItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface VideoListResponse {
  content: VideoItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ResultDataSubscription {
  subscriberCount: number;
  subscribingCount: number;
}

export interface MonthlyVideoStatsDTO {
  month: string;
  year: number;
  monthNumber: number;
  newVideos: number;
  totalVideos: number;
  newViews: number;
  totalViews: number;
  newLikes: number;
  totalLikes: number;
  newComments: number;
  totalComments: number;
  averageEngagementRate: number;
  newSubscribers: number;
}

export interface VideoMonthlyStatsResponse {
  monthlyData: MonthlyVideoStatsDTO[];
  overallStats: {
    totalViews: number;
    totalLikes: number;
    totalDislikes: number;
    totalComments: number;
    totalVideos: number;
  };
  totalSubscribers: number;
  totalMonths: number;
  startDate: string;
  endDate: string;
}

export interface VideoGrowthStatsDTO {
  period: string; // "Mon", "Jan 15", "January"
  newUsers: number;
  activeUsers: number;
  videoUploads: number;
  views: number;
  year: number;
  month: number;
  day?: number;
}



export interface GrowthDataResponse {
  growthData: VideoGrowthStatsDTO[];
  currentPeriodStats: Stats;
  previousPeriodStats: Stats | null;
  timeRange: string;
  comparisonType: string;
  startDate: string;
  endDate: string;
}


// Thêm vào types/dashboard.ts

export interface GrowthDataPoint {
  period: string;
  date: string;
  newUsers: number;
  activeUsers: number;
  newVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  engagementRate: number;
}

export interface GrowthSummary {
  totalNewUsers: number;
  totalActiveUsers: number;
  totalNewVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  userGrowthRate: number;
  videoGrowthRate: number;
  viewGrowthRate: number;
  engagementGrowthRate: number;
  startDate: string;
  endDate: string;
  comparisonStartDate: string;
  comparisonEndDate: string;
}

export interface GrowthDataResponse {
  currentPeriod: GrowthDataPoint[];
  comparisonPeriod: GrowthDataPoint[];
  summary: GrowthSummary;
  timeRange: string;
  comparisonType: string;
}