export interface Profile {
    id: string;
    userId?: string;
    email?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    fullName?: string;
    description?: string;
    subscriberCount?: number;
    createdAt?: string;
  }
  
  export interface UpdateProfileRequest {
    username?: string;
    email?: string;
    profilePicture?: File;
    channelName?: string;
    channelDescription?: string;
    channelPicture?: File;
    bannerImage?: File;
  }
  
  export interface Subscription {
    id: number;
    subscribedAt: string;
    notificationEnabled: boolean;
    channel: Profile;
  }