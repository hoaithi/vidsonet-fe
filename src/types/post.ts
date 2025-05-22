import { User } from './user';

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;
  dislikeCount: number;
  user: User;
  commentCount: number;
}

export interface PostCreateRequest {
  title: string;
  content: string;
}

export interface PostUpdateRequest {
  title?: string;
  content?: string;
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
  user: User;
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