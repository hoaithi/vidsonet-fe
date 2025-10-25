import { Profile } from './profile';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  isPremium: boolean;
  publishedAt: string;
  profileId: string;
  profileImage: string;
  profileName: string;
  currentProgress?: number;
}

export interface VideoUpload {
  title: string;
  description: string;
  isPremium: boolean;
  videoFile: File;
  thumbnailFile: File;
}

export interface VideoUpdateRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  categoryIds?: number[];
  isPremium?: boolean;
}

export interface VideoProgressUpdateRequest {
  currentTime: number;
  duration: number;
  isCompleted?: boolean;
}

export interface VideoSearchRequest {
  keyword?: string;
  categoryId?: number;
  userId?: number;
  isPremium?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  isPinned: boolean;
  hearted: boolean;
  heartedAt?: string;
  owner: Profile;
  videoId: number;
  parentId?: number;
  replies?: Comment[];
}

export interface CommentCreateRequest {
  content: string;
  itemId: string;
  commentType: string;
  parentId?: string;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  type: 'WATCH_LATER' | 'LIKED_VIDEOS' | 'DISLIKED_VIDEOS' | 'HISTORY' | 'CUSTOM';
  videos?: Video[];
}
export interface UserReactionStatus {
  hasLiked: boolean;
  hasDisliked: boolean;
}