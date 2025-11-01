import { ConversationList, ConversationMessagesResponse } from "@/types/chat";
import apiClient from "./api-client";

export const chatService = {
  getConversation: async (data: string): Promise<ConversationList> => {
    const response = await apiClient.get<ConversationList>(
      `/users/${data}/conversations`
    );
    return response.data;
  },

  getMessagesConversation: async (
    conversationId: string
  ): Promise<ConversationMessagesResponse> => {
    const response = await apiClient.get<ConversationMessagesResponse>(
      `/conversations/${conversationId}/messages`
    );
    return response.data;
  },
};
