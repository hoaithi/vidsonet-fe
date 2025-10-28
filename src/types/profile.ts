export interface Profile {
    id: string;
    userId?: string;
    email?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    fullName?: string;
    city?: string;
    dob?: string; 
    description?: string;
    subscriberCount?: number;
    createdAt?: string;
    hasPassword?: boolean
  }
  
  export interface UpdateProfileRequest {
    fullName?: string;
    city?: string;
    dob?: string; // ISO date string (YYYY-MM-DD)
    description?: string;
    profilePicture?: File;
    bannerImage?: File;
  }
  
  export interface Subscription {
    id: number;
    subscribedAt: string;
    notificationEnabled: boolean;
    channel: Profile;
  }