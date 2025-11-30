// import { ConversationList, ConversationMessagesResponse } from "@/types/chat";// import apiClient from "./api-client";// // Types for create conversation// interface CreateConversationRequest {//   user1Id: string;//   user2Id: string;
//   user1Info?: {
//     name?: string;
//     avatar?: string;
//   };
//   user2Info?: {
//     name?: string;
//     avatar?: string;
//   };
// }

// interface CreateConversationResponse {
//   id: string;
//   user1Id: string;
//   user2Id: string;
//   createdAt: string;
//   updatedAt: string;
//   lastMessage?: {
//     message: string;
//     createdAt: string;
//   };
// }

// export const chatService = {
//   /**
//    * Get all conversations for a user
//    */
//   getConversation: async (userId: string): Promise<ConversationList> => {
//     const response = await apiClient.get<ConversationList>(
//       `chat/users/${userId}/conversations`
//     );
//     return response.data;
//   },

//   /**
//    * Get messages in a conversation
//    */
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
//    * ✅ Create or get existing conversation between two users
//    */
//   createOrGetConversation: async (
//     data: CreateConversationRequest
//   ): Promise<CreateConversationResponse> => {
//     const response = await apiClient.post<CreateConversationResponse>(
//       `chat/conversations`,
//       data
//     );
//     return response.data;
//   },

//   /**
//    * ✅ Simplified version - only need user IDs
//    */
//   findOrCreateConversation: async (
//     currentUserId: string,
//     otherUserId: string,
//     currentUserInfo?: { name: string; avatar?: string },
//     otherUserInfo?: { name: string; avatar?: string }
//   ): Promise<CreateConversationResponse> => {
//     const response = await apiClient.post<CreateConversationResponse>(
//       `chat/conversations`,
//       {
//         user1Id: currentUserId,
//         user2Id: otherUserId,
//         user1Info: currentUserInfo,
//         user2Info: otherUserInfo,
//       }
//     );
//     return response.data;
//   },

//   /**
//    * Send a message in a conversation
//    */
//   sendMessage: async (
//     conversationId: string,
//     message: string,
//     userId: string,
//     type: string = "MESSAGE",
//     images: string[] = []
//   ): Promise<any> => {
//     const response = await apiClient.post(`chat/send`, {
//       conversation_id: conversationId,
//       message,
//       type,
//       image: images,
//       userId,
//     });
//     return response.data;
//   },

//   /**
//    * Delete a single conversation
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
//    * Delete multiple conversations
//    */
//   deleteMultipleConversations: async (
//     conversationIds: string[],
//     userId: string
//   ): Promise<{
//     success: boolean;
//     deletedCount: number;
//     conversationIds: string[];
//   }> => {
//     const response = await apiClient.post(
//       `chat/conversations/delete-multiple`,
//       {
//         conversationIds,
//         userId,
//       }
//     );
//     return response.data;
//   },

//   /**
//    * Mark conversation as read
//    */
//   markAsRead: async (
//     conversationId: string,
//     userId: string
//   ): Promise<{ success: boolean }> => {
//     const response = await apiClient.post(
//       `chat/conversations/${conversationId}/read`,
//       {
//         userId,
//       }
//     );
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

// ✅ NEW: Upload response type
interface UploadImageResponse {
  original_name: string;
  file_url: string;
  public_id: string;
  resource_type: string;
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
   * ✅ NEW: Upload chat images to server
   * @param files - Array of File objects to upload
   * @returns Array of image URLs
   */
  uploadChatImages: async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) {
      throw new Error("No files provided for upload");
    }

    if (files.length > 10) {
      throw new Error("Maximum 10 images allowed per upload");
    }

    const formData = new FormData();
    files.forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error(
          `Invalid file type: ${file.name}. Only images are allowed.`
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
      }

      formData.append("images", file);
    });

    try {
      const response = await apiClient.post<UploadImageResponse[]>(
        "chat/upload/chat-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Extract only URLs from response
      return response.data.map((item) => item.file_url);
    } catch (error: any) {
      console.error("❌ Upload error:", error);

      // Better error handling
      if (error.response?.status === 413) {
        throw new Error("Files are too large. Please reduce file size.");
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || "Invalid file format");
      } else {
        throw new Error("Upload failed. Please try again.");
      }
    }
  },

  /**
   * Send a message in a conversation (legacy - kept for backward compatibility)
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
