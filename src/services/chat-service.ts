import { ConversationList, ConversationMessagesResponse } from "@/types/chat";
import apiClient from "./api-client";

export const chatService = {
  getConversation: async (data: string): Promise<ConversationList> => {
    const response = await apiClient.get<ConversationList>(
      `chat/users/${data}/conversations`
    );
    return response.data;
  },

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
   * ✅ Delete conversation
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
   * ✅ Delete multiple conversations
   */
  deleteMultipleConversations: async (
    conversationIds: string[],
    userId: string
  ): Promise<{
    success: boolean;
    deletedCount: number;
    conversationIds: string[];
  }> => {
    const response = await apiClient.post(` /conversations/delete-multiple`, {
      conversationIds,
      userId,
    });
    return response.data;
  },
};
