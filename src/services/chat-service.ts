// import { ConversationList, ConversationMessagesResponse } from "@/types/chat";// import apiClient from "./api-client";// export const chatService = {
//   getConversation: async (data: string): Promise<ConversationList> => {
//     const response = await apiClient.get<ConversationList>(
//       `chat/users/${data}/conversations`
//     );
//     return response.data;
//   },

//   getMessagesConversation: async (
//     conversationId: string,
//     userId: string
//   ): Promise<ConversationMessagesResponse> => {
//     const response = await apiClient.get<ConversationMessagesResponse>(
//       `chat/conversations/${conversationId}/messages`,
//       {
//         params: {
//           userId,
//         },
//       }
//     );
//     return response.data;
//   },

//   /**
//    * ✅ Delete conversation
//    */
//   deleteConversation: async (
//     conversationId: string,
//     userId: string
//   ): Promise<{
//     success: boolean;
//     message: string;
//     deletedConversationId: string;
//   }> => {
//     const response = await apiClient.delete(
//       `chat/conversations/${conversationId}?userId=${userId}`
//     );
//     return response.data;
//   },

//   /**
//    * ✅ Delete multiple conversations
//    */
//   deleteMultipleConversations: async (
//     conversationIds: string[],
//     userId: string
//   ): Promise<{
//     success: boolean;
//     deletedCount: number;
//     conversationIds: string[];
//   }> => {
//     const response = await apiClient.post(` /conversations/delete-multiple`, {
//       conversationIds,
//       userId,
//     });
//     return response.data;
//   },
// };

import { ConversationList, ConversationMessagesResponse } from "@/types/chat";
import apiClient from "./api-client";

// Types for create conversation
interface CreateConversationRequest {
  user1Id: string;
  user2Id: string;
  user1Info?: {
    name?: string;
    avatar?: string;
  };
  user2Info?: {
    name?: string;
    avatar?: string;
  };
}

interface CreateConversationResponse {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    message: string;
    createdAt: string;
  };
}

export const chatService = {
  /**
   * Get all conversations for a user
   */
  getConversation: async (userId: string): Promise<ConversationList> => {
    const response = await apiClient.get<ConversationList>(
      `chat/users/${userId}/conversations`
    );
    return response.data;
  },

  /**
   * Get messages in a conversation
   */
  getMessagesConversation: async (
    conversationId: string,
    userId: string
  ): Promise<ConversationMessagesResponse> => {
    const response = await apiClient.get<ConversationMessagesResponse>(
      `chat/conversations/${conversationId}/messages`,
      {
        params: {
          userId,
        },
      }
    );
    return response.data;
  },

  /**
   * ✅ Create or get existing conversation between two users
   */
  createOrGetConversation: async (
    data: CreateConversationRequest
  ): Promise<CreateConversationResponse> => {
    const response = await apiClient.post<CreateConversationResponse>(
      `chat/conversations`,
      data
    );
    return response.data;
  },

  /**
   * ✅ Simplified version - only need user IDs
   */
  findOrCreateConversation: async (
    currentUserId: string,
    otherUserId: string,
    currentUserInfo?: { name: string; avatar?: string },
    otherUserInfo?: { name: string; avatar?: string }
  ): Promise<CreateConversationResponse> => {
    const response = await apiClient.post<CreateConversationResponse>(
      `chat/conversations`,
      {
        user1Id: currentUserId,
        user2Id: otherUserId,
        user1Info: currentUserInfo,
        user2Info: otherUserInfo,
      }
    );
    return response.data;
  },

  /**
   * Send a message in a conversation
   */
  sendMessage: async (
    conversationId: string,
    message: string,
    userId: string,
    type: string = "MESSAGE",
    images: string[] = []
  ): Promise<any> => {
    const response = await apiClient.post(`chat/send`, {
      conversation_id: conversationId,
      message,
      type,
      image: images,
      userId,
    });
    return response.data;
  },

  /**
   * Delete a single conversation
   */
  deleteConversation: async (
    conversationId: string,
    userId: string
  ): Promise<{
    success: boolean;
    message: string;
    deletedConversationId: string;
  }> => {
    const response = await apiClient.delete(
      `chat/conversations/${conversationId}?userId=${userId}`
    );
    return response.data;
  },

  /**
   * Delete multiple conversations
   */
  deleteMultipleConversations: async (
    conversationIds: string[],
    userId: string
  ): Promise<{
    success: boolean;
    deletedCount: number;
    conversationIds: string[];
  }> => {
    const response = await apiClient.post(
      `chat/conversations/delete-multiple`,
      {
        conversationIds,
        userId,
      }
    );
    return response.data;
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (
    conversationId: string,
    userId: string
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(
      `chat/conversations/${conversationId}/read`,
      {
        userId,
      }
    );
    return response.data;
  },
};
