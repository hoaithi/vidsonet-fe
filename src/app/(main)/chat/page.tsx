"use client";import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  Trash,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { chatService } from "@/services/chat-service";
import { Conversation, ConversationList, Message } from "@/types/chat";
import { useSocketContext } from "@/providers/SocketProvider";
import { useAuthStore } from "@/store/auth-store";

// ✅ Format date for separator
function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Hôm nay";
  } else if (date.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  } else {
    return date.toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
}

// ✅ Check if should show date separator
function shouldShowDateSeparator(
  currentMsg: Message,
  previousMsg: Message | undefined
): boolean {
  if (!previousMsg) return true;

  const currentDate = new Date(
    currentMsg.createdAt || currentMsg.timestamp
  ).toDateString();
  const previousDate = new Date(
    previousMsg.createdAt || previousMsg.timestamp
  ).toDateString();

  return currentDate !== previousDate;
}

// ✅ Message Status Icon Component
function MessageStatusIcon({
  status,
}: {
  status?: "sending" | "sent" | "delivered" | "read";
}) {
  if (!status) return null;

  const iconClass = "w-3.5 h-3.5";

  switch (status) {
    case "sending":
      return (
        <Clock
          className={cn(iconClass, "text-gray-400 animate-pulse")}
          strokeWidth={2.5}
        />
      );
    case "sent":
      return (
        <Check className={cn(iconClass, "text-gray-400")} strokeWidth={2.5} />
      );
    case "delivered":
      return (
        <CheckCheck
          className={cn(iconClass, "text-gray-400")}
          strokeWidth={2.5}
        />
      );
    case "read":
      return (
        <CheckCheck
          className={cn(iconClass, "text-blue-500")}
          strokeWidth={2.5}
        />
      );
    default:
      return null;
  }
}

// ✅ Helper function to determine message status
function getMessageStatus(
  message: Message
): "sending" | "sent" | "delivered" | "read" | undefined {
  if (message.sender !== "user") return undefined;

  if (message.status) return message.status;
  if (!message.id || message.tempId) return "sending";
  if (message.isRead) return "read";
  if (message.isDelivered) return "delivered";
  if (message.isSent) return "sent";
  return "sending";
}

export default function ChatPage() {
  const [listConversations, setListConversation] = useState<ConversationList>(
    []
  );
  const [listMessagesConversations, setListMessagesConversation] = useState<
    Message[]
  >([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { profile } = useAuthStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { socket, isConnected, onlineUsers, currentUser } = useSocketContext();

  // ✅ Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ✅ Update online status
  useEffect(() => {
    if (listConversations.length > 0 && onlineUsers.length > 0) {
      setListConversation((prev) =>
        prev.map((conv) => ({
          ...conv,
          isOnline: onlineUsers.includes(conv.receiverId || ""),
        }))
      );
    }
  }, [onlineUsers]);

  // ✅ Listen for online/offline events
  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data: { userId: string; timestamp: string }) => {
      console.log("👤 User online:", data);
      setListConversation((prev) =>
        prev.map((conv) =>
          conv.receiverId === data.userId
            ? { ...conv, isOnline: true, lastSeen: "Đang hoạt động" }
            : conv
        )
      );

      if (activeConversation?.receiverId === data.userId) {
        setActiveConversation((prev) =>
          prev ? { ...prev, isOnline: true } : null
        );
      }
    };

    const handleUserOffline = (data: { userId: string; timestamp: string }) => {
      console.log("👤 User offline:", data);
      setListConversation((prev) =>
        prev.map((conv) =>
          conv.receiverId === data.userId
            ? {
                ...conv,
                isOnline: false,
                lastSeen: `Hoạt động ${formatLastSeen(data.timestamp)}`,
              }
            : conv
        )
      );

      if (activeConversation?.receiverId === data.userId) {
        setActiveConversation((prev) =>
          prev ? { ...prev, isOnline: false } : null
        );
      }
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [socket, activeConversation]);

  // ✅ Mark messages as seen when conversation is opened
  useEffect(() => {
    if (activeConversation && socket && profile?.id) {
      const timer = setTimeout(() => {
        socket.emit("markAsSeen", {
          conversationId: activeConversation.id,
          userId: profile.userId,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [activeConversation, socket, profile?.id]);

  // ✅ Socket listeners for message status updates
  useEffect(() => {
    if (!socket || !profile?.id) return;

    console.log("🎧 Listening for message status events...");

    const handleMessageSent = (data: {
      tempId: string;
      message: any;
      conversationId: string;
    }) => {
      console.log("✅ Message sent:", data);

      setListMessagesConversation((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId
            ? {
                ...msg,
                id: data.message.id,
                status: "sent",
                isSent: true,
                tempId: undefined,
                createdAt: data.message.createdAt,
              }
            : msg
        )
      );
    };

    const handleMessageDelivered = (data: {
      messageId: string;
      conversationId: string;
      deliveredAt: string;
    }) => {
      console.log("✅✅ Message delivered:", data);

      setListMessagesConversation((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? {
                ...msg,
                status: "delivered",
                isDelivered: true,
              }
            : msg
        )
      );
    };

    const handleMessagesSeen = (data: {
      conversationId: string;
      seenBy: string;
      timestamp: string;
    }) => {
      console.log("👀 Messages seen:", data);

      setListMessagesConversation((prev) =>
        prev.map((msg) =>
          msg.sender === "user"
            ? {
                ...msg,
                status: "read",
                isRead: true,
              }
            : msg
        )
      );
    };

    const handleMessageError = (data: { tempId: string; error: string }) => {
      console.error("❌ Message error:", data);

      setListMessagesConversation((prev) => {
        const failedMsg = prev.find((m) => m.tempId === data.tempId);
        if (failedMsg) {
          setNewMessage(failedMsg.text);
        }
        return prev.filter((msg) => msg.tempId !== data.tempId);
      });
    };

    const handleNewMessage = (data: any) => {
      console.log("💬 New message received:", data);
      console.log("📝 Message data structure:", {
        conversationId: data.conversation?.id,
        messageId: data.message?.id,
        senderId: data.message?.senderId,
        receiverId: data.message?.receiverId,
        content: data.message?.content,
      });

      if (!data.message || !data.conversation) {
        console.error("❌ Invalid message data structure");
        return;
      }

      const newMessage: Message = {
        id: data.message.id,
        text: data.message.content,
        sender: "friend",
        timestamp:
          data.message.timestamp ||
          new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        createdAt: data.message.createdAt || new Date().toISOString(),
        senderName: data.message.senderName || data.conversation.name,
        avatar: data.conversation.avatar,
        status: undefined,
      };

      const isActiveConversation =
        activeConversation && data.conversation.id === activeConversation.id;

      console.log("🔍 Conversation check:", {
        isActiveConversation,
        activeConvId: activeConversation?.id,
        dataConvId: data.conversation.id,
      });

      if (isActiveConversation) {
        setListMessagesConversation((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) {
            console.log("⚠️ Duplicate message prevented");
            return prev;
          }
          return [...prev, newMessage];
        });

        setTimeout(() => scrollToBottom(), 100);

        socket.emit("markAsSeen", {
          conversationId: activeConversation.id,
          userId: profile.userId,
        });
      }

      setListConversation((prev) => {
        const exists = prev.some((conv) => conv.id === data.conversation.id);

        if (exists) {
          return prev
            .map((conv) =>
              conv.id === data.conversation.id
                ? {
                    ...conv,
                    lastMessage: data.message.content,
                    timestamp:
                      data.message.timestamp ||
                      new Date().toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    unread: !isActiveConversation,
                  }
                : conv
            )
            .sort((a, b) => {
              if (a.id === data.conversation.id) return -1;
              if (b.id === data.conversation.id) return 1;
              return 0;
            });
        } else {
          const newConv: Conversation = {
            id: data.conversation.id,
            name: data.conversation.name,
            avatar: data.conversation.avatar,
            lastMessage: data.message.content,
            timestamp:
              data.message.timestamp ||
              new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            unread: true,
            isOnline: onlineUsers.includes(data.conversation.receiverId || ""),
            receiverId: data.conversation.receiverId,
          };
          return [newConv, ...prev];
        }
      });
    };

    socket.on("messageSent", handleMessageSent);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("messageError", handleMessageError);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("messageSent", handleMessageSent);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("messageError", handleMessageError);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, activeConversation, profile?.id, onlineUsers, scrollToBottom]);

  useEffect(() => {
    if (profile?.id) {
      getListConversation();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (activeConversation && profile?.id) {
      getListMessageConversation(activeConversation.id);
    }
  }, [activeConversation?.id, profile?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [listMessagesConversations, scrollToBottom]);

  const formatLastSeen = (timestamp: string): string => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - lastSeen.getTime()) / 60000
    );

    if (diffInMinutes < 1) return "vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const getListConversation = async () => {
    console.log("profile?.id", profile?.id);

    try {
      const res = await chatService.getConversation(profile?.id!);
      console.log("✅ Conversations loaded:", res);
      if (res) {
        setListConversation(res);
      }
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
    }
  };

  const getListMessageConversation = async (conversationId: string) => {
    if (!profile?.id) return;
    try {
      const res = await chatService.getMessagesConversation(
        conversationId,
        profile.id
      );
      console.log("✅ Messages loaded:", res?.messages);
      if (res) {
        const messagesWithStatus = res.messages.map((msg: any) => ({
          ...msg,
          createdAt: msg.createdAt || new Date().toISOString(),
          status:
            msg.sender === "user"
              ? msg.isRead
                ? "read"
                : msg.isDelivered
                ? "delivered"
                : msg.isSent
                ? "sent"
                : "sending"
              : undefined,
        }));
        setListMessagesConversation(messagesWithStatus || []);
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    }
  };

  const handleDeleteConversation = async (activeConversation: Conversation) => {
    if (!activeConversation) return;
    try {
      await chatService.deleteConversation(activeConversation.id, profile?.id!);

      setListConversation((prev) =>
        prev.filter((conv) => conv.id !== activeConversation.id)
      );
      setActiveConversation(null);
      setListMessagesConversation([]);
      console.log(`Đã xóa cuộc trò chuyện ID: ${activeConversation.id}`);
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredConversations = listConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !socket || !profile?.id)
      return;

    console.log("📤 Sending message:", newMessage);
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const messageText = newMessage;
    setNewMessage("");

    const optimisticMessage: Message = {
      id: tempId,
      tempId,
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setListMessagesConversation((prev) => [...prev, optimisticMessage]);

    setTimeout(() => scrollToBottom(), 100);

    socket.emit("sendMessage", {
      senderId: profile.id,
      receiverId: activeConversation.receiverId,
      content: messageText,
      conversationId: activeConversation.id,
      tempId,
    });

    setListConversation((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: messageText,
              timestamp: new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : conv
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setListConversation((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      )
    );
  };

  return (
    <div className="bg-white fixed inset-0 z-50 flex overflow-hidden">
      {/* Left Sidebar - Conversations */}
      <div className="w-[400px] bg-white border-r flex flex-col min-h-0">
        <div className="p-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Tin nhắn</h2>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-600">
              {searchQuery
                ? "Không tìm thấy cuộc trò chuyện nào"
                : "Chưa có tin nhắn"}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all duration-200",
                    activeConversation?.id === conversation.id
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-full h-full object-cover"
                        />
                        <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                          {conversation.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={cn(
                            "font-semibold truncate",
                            conversation.unread
                              ? "text-gray-900"
                              : "text-gray-700"
                          )}
                        >
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {conversation.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "text-sm truncate",
                            conversation.unread
                              ? "text-gray-900 font-medium"
                              : "text-gray-600"
                          )}
                        >
                          {conversation.receiverId !== currentUser && "Bạn: "}
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 bg-gray-200 flex flex-col min-h-0 p-4">
        {activeConversation ? (
          <div className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl p-3">
            {/* Chat Header */}
            <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
                      <AvatarImage
                        src={activeConversation.avatar}
                        alt={activeConversation.name}
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                        {activeConversation.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {activeConversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeConversation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeConversation.isOnline
                        ? "Đang hoạt động"
                        : "Hoạt động gần đây"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-red-600 hover:bg-red-50 w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center"
                    title="Xóa cuộc trò chuyện"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {listMessagesConversations.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Chưa có tin nhắn nào</p>
                </div>
              ) : (
                listMessagesConversations.map((message, index) => {
                  const showAvatar =
                    message.sender === "friend" &&
                    (index === 0 ||
                      listMessagesConversations[index - 1].sender !== "friend");

                  const messageStatus = getMessageStatus(message);
                  const showDateSeparator = shouldShowDateSeparator(
                    message,
                    listMessagesConversations[index - 1]
                  );

                  return (
                    <div key={message.id || message.tempId}>
                      {/* ✅ Date Separator */}
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                            {formatDateSeparator(
                              message.createdAt || message.timestamp
                            )}
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      <div
                        className={cn(
                          "flex flex-col",
                          message.sender === "user"
                            ? "items-end"
                            : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "flex gap-2 max-w-[75%] sm:max-w-md",
                            message.sender === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          )}
                        >
                          {message.sender === "friend" && (
                            <div
                              className={cn(
                                "w-8 h-8 flex-shrink-0 self-end",
                                showAvatar ? "visible" : "invisible"
                              )}
                            >
                              {showAvatar && (
                                <Avatar className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-full">
                                  <AvatarImage
                                    src={
                                      message.avatar ||
                                      activeConversation.avatar
                                    }
                                    alt={message.senderName}
                                    className="w-full h-full object-cover"
                                  />
                                  <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs">
                                    {message.senderName
                                      ?.charAt(0)
                                      .toUpperCase() ||
                                      activeConversation.name
                                        .charAt(0)
                                        .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          )}

                          {/* ✅ FIX: word-break */}
                          <div
                            className={cn(
                              "px-3 py-2 rounded-[18px] shadow-sm",
                              "break-words overflow-wrap-anywhere word-break-break-word",
                              message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-900 border border-gray-200"
                            )}
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "anywhere",
                            }}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {message.text}
                            </p>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "mt-1 px-3 flex items-center gap-1.5",
                            message.sender === "user"
                              ? "flex-row-reverse"
                              : "ml-10"
                          )}
                        >
                          <span className="text-[11px] text-gray-500">
                            {message.timestamp}
                          </span>
                          {messageStatus && (
                            <MessageStatusIcon status={messageStatus} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">đang nhập...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-2 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
                  <Paperclip className="w-5 h-5" />
                </button>

                <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 rounded-full pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[40px]"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:bg-gray-200 w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl">
            <div className="text-center space-y-4 px-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Send className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Chào mừng đến với Tin nhắn
                </h3>
                <p className="text-gray-600 text-lg">
                  Chọn một cuộc trò chuyện bên trái để bắt đầu nhắn tin
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Đang hoạt động</span>
                </div>
                <span>•</span>
                <span>{listConversations.length} cuộc trò chuyện</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Delete Confirmation Dialog */}
      {isDeleteDialogOpen && activeConversation && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold text-red-600 mb-2">
              Xóa cuộc trò chuyện?
            </h3>
            <p className="text-gray-700 mb-4">
              Bạn có chắc chắn muốn xóa cuộc trò chuyện với{" "}
              <strong>{activeConversation.name}</strong>? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleDeleteConversation(activeConversation);
                }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
