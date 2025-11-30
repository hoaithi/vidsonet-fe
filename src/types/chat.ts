// export interface Message {//   id: string;//   text: string;
//   sender: "user" | "friend";
//   timestamp: string;
//   senderName?: string;
//   avatar?: string;
//   reaction?: string;
// }

// export type MessageStatus = "sending" | "sent" | "delivered" | "read";

// export interface Conversation {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   unread: boolean;
//   isOnline: boolean;
//   lastSeen?: string;
//   messageCount?: number;
//   receiverId?: string;
// }

// export interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "friend";
//   timestamp: string;
//   senderName?: string;
//   avatar?: string;
//   reaction?: string;

//   // Status tracking
//   status?: MessageStatus;
//   tempId?: string; // For optimistic updates
//   isSent?: boolean;
//   isDelivered?: boolean;
//   isRead?: boolean;
//   deliveredAt?: string;
//   readAt?: string;
// }

// export interface ConversationMessagesResponse {
//   conversation: Conversation;
//   messages: Message[];
//   total: number;
// }

// // Nếu bạn nhận danh sách hội thoại từ API
// export type ConversationList = Conversation[];

// ✅ Message Status
export type MessageStatus = "sending" | "sent" | "delivered" | "read";

// ✅ Message Type Enum
export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  CALL = "call",
}

// ✅ Call Type Enum
export enum CallType {
  VIDEO = "video",
  VOICE = "voice",
}

// ✅ Call Status
export type CallStatus = "answered" | "missed" | "declined" | "cancelled";

// ✅ Call Metadata
export interface CallMetadata {
  callId: string;
  duration: number; // seconds
  callType: CallType;
  callStatus: CallStatus;
}

// ✅ Message Interface
export interface Message {
  id: string;
  text: string;
  sender: "user" | "friend";
  timestamp: string;
  senderName?: string;
  avatar?: string;
  reaction?: string;
  createdAt?: string;

  // ✅ Message Type
  messageType?: MessageType;

  // ✅ Call Metadata (only for call messages)
  metadata?: CallMetadata;
  images?: string[];
  // Status tracking
  status?: MessageStatus;
  tempId?: string; // For optimistic updates
  isSent?: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  deliveredAt?: string;
  readAt?: string;
}

// ✅ Conversation Interface
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

// ✅ Conversation Messages Response
export interface ConversationMessagesResponse {
  conversation: Conversation;
  messages: Message[];
  total: number;
}

// ✅ Conversation List
export type ConversationList = Conversation[];
