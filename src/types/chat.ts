export interface Message {
  id: string;
  text: string;
  sender: "user" | "friend";
  timestamp: string;
  senderName?: string;
  avatar?: string;
  reaction?: string;
}

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isOnline: boolean;
  lastSeen?: string;
  messageCount?: number;
  receiverId?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "friend";
  timestamp: string;
  senderName?: string;
  avatar?: string;
  reaction?: string;

  // Status tracking
  status?: MessageStatus;
  tempId?: string; // For optimistic updates
  isSent?: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  deliveredAt?: string;
  readAt?: string;
}

export interface ConversationMessagesResponse {
  conversation: Conversation;
  messages: Message[];
  total: number;
}

// Nếu bạn nhận danh sách hội thoại từ API
export type ConversationList = Conversation[];
