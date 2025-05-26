import { User } from './user';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Video {
  id: number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  isPremium: boolean;
  publishedAt: string;
  user: User;
  categories?: Category[];
  currentProgress?: number;
}

export interface VideoUpload {
  title: string;
  description?: string;
  categoryIds?: number[];
  isPremium: boolean;
  videoFile: File;
  thumbnailFile?: File;
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
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  isPinned: boolean;
  isHearted: boolean;
  heartedAt?: string;
  user: User;
  videoId: number;
  parentId?: number;
  replies?: Comment[];
}

export interface CommentCreateRequest {
  content: string;
  videoId: number;
  parentId?: number;
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