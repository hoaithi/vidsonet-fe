import { User } from './user';

export type NotificationType = 
  | 'VIDEO_LIKE'
  | 'VIDEO_DISLIKE'
  | 'VIDEO_COMMENT'
  | 'COMMENT_LIKE'
  | 'COMMENT_DISLIKE'
  | 'COMMENT_REPLY'
  | 'COMMENT_HEART'
  | 'POST_COMMENT_HEART'
  | 'NEW_SUBSCRIBER'
  | 'NEW_VIDEO'
  | 'NEW_POST'
  | 'POST_COMMENT'
  | 'POST_LIKE'
  | 'POST_DISLIKE'
  | 'MEMBERSHIP_EXPIRED'
  | 'MEMBERSHIP_PAYMENT';

export type EntityType = 
  | 'VIDEO'
  | 'COMMENT'
  | 'POST'
  | 'POST_COMMENT'
  | 'USER'
  | 'MEMBERSHIP';

export interface Notification {
  id: number;
  type: NotificationType;
  createdAt: string;
  isRead: boolean;
  content: string;
  entityId: number;
  entityType: EntityType;
  actor: User;
}