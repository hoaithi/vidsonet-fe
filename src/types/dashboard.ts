export interface Stats {  totalViews: number;
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  videoCount: number;
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
  engagementScore: number;
  isPremium: boolean;
}

export interface ResultData {
  stats: Stats;
  topVideos: TopVideo[];
}

export interface ResultDataSubscription {
  subscriberCount: number;
  subscribingCount: number;
}
