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

export interface ResultDataSubscription {
  subscriberCount: number;
  subscribingCount: number;
}
