import { Profile } from './profile';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  profileImage: string;
  profileName: string;
  profileId: string;
  commentCount: number;
}

export interface PostCreateRequest {
  title: string;
  content?: string;
  imageFile?: File | null;
}

export interface PostUpdateRequest {
  title?: string;
  content?: string;
  imageFile?: File | null;
}

// Post comments now use the unified Comment type from types/video via CommentService and the use-comments hook.