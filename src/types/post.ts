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
  user: Profile;
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

export interface PostComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  isHearted: boolean;
  heartedAt?: string;
  user: Profile;
  postId: number;
  parentId?: number;
  replies?: PostComment[];
}

export interface PostCommentCreateRequest {
  content: string;
  postId: number;
  parentId?: number;
}

export interface PostCommentUpdateRequest {
  content: string;
}