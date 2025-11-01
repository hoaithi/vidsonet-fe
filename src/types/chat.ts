import { Conversation } from "@/app/(main)/chat/page";
export interface Message {
  id: string;
  text: string;
  sender: "user" | "friend";
  timestamp: string;
  senderName?: string;
  avatar?: string;
  reaction?: string;
}

// Interface cho Conversation
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
// }

export interface ConversationMessagesResponse {
  conversation: Conversation;
  messages: Message[];
  total: number;
}

// Nếu bạn nhận danh sách hội thoại từ API
export type ConversationList = Conversation[];
