export interface User {
    id: number;
    username: string;
    email?: string;
    profilePicture?: string;
    createdAt?: string;
    channelName?: string;
    channelDescription?: string;
    channelPicture?: string;
    bannerImage?: string;
    subscriberCount?: number;
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
    channel: User;
  }