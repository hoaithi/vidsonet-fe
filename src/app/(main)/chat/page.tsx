"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
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
  PhoneMissed,
  PhoneOff,
  X,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { chatService } from "@/services/chat-service";
import {
  CallType,
  Conversation,
  ConversationList,
  Message,
  MessageType,
} from "@/types/chat";
import { useSocketContext } from "@/providers/SocketProvider";
import { useAuthStore } from "@/store/auth-store";
import VideoCallModal from "@/components/video-call/VideoCallModal";
import IncomingCallNotification from "@/components/video-call/IncomingCallNotification";
import { ImagePreview } from "@/components/chat-detail/ChatDetailModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ✅ Image Preview Item Component
function ImagePreviewItem({
  preview,
  onRemove,
}: {
  preview: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500">
      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 hover:bg-black/70 transition-colors"
      >
        <XCircle className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

// ✅ Image Message Component
function ImageMessage({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div
        className={cn(
          "grid gap-1",
          images.length === 1
            ? "grid-cols-1 max-w-[280px]"
            : images.length === 2
            ? "grid-cols-2 max-w-[280px]"
            : images.length === 3
            ? "grid-cols-3 max-w-[280px]"
            : "grid-cols-2 max-w-[280px]"
        )}
      >
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            onClick={() => setSelectedImage(url)}
          >
            <img
              src={url}
              alt={`Image ${idx + 1}`}
              className="w-full h-full object-cover"
              style={{
                aspectRatio: images.length === 1 ? "4/3" : "1/1",
                minHeight: images.length === 1 ? "200px" : "120px",
              }}
            />
          </div>
        ))}
      </div>

      {/* ✅ Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

// ✅ CallMessage Component
function CallMessage({ message }: { message: Message }) {
  const isUser = message.sender === "user";
  const metadata = message.metadata;

  if (!metadata) return null;

  // Icon based on call type and status
  const getIcon = () => {
    if (metadata.callStatus === "missed") {
      return <PhoneMissed className="w-4 h-4" />;
    }
    if (
      metadata.callStatus === "declined" ||
      metadata.callStatus === "cancelled"
    ) {
      return <PhoneOff className="w-4 h-4" />;
    }
    return metadata.callType === CallType.VIDEO ? (
      <Video className="w-4 h-4" />
    ) : (
      <Phone className="w-4 h-4" />
    );
  };

  // Color based on status
  const getColor = () => {
    switch (metadata.callStatus) {
      case "answered":
        return "text-green-600 bg-green-50 border-green-200";
      case "missed":
        return "text-red-600 bg-red-50 border-red-200";
      case "declined":
      case "cancelled":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-xl border max-w-[220px]",
        getColor()
      )}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.text}</p>
        {metadata.duration > 0 && (
          <p className="text-xs opacity-75 mt-0.5">
            {Math.floor(metadata.duration / 60)}:
            {(metadata.duration % 60).toString().padStart(2, "0")}
          </p>
        )}
      </div>
    </div>
  );
}

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
  const { socket, isConnected, onlineUsers, currentUser } = useSocketContext();

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
  const [error, setError] = useState<string | null>(null);

  // ✅ Image upload states (thêm sau state error)
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { profile } = useAuthStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Video call states
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [showIncomingNotification, setShowIncomingNotification] =
    useState(false);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: {
      callId: string;
      fromUserId: string;
      fromUserInfo: { name: string; avatar?: string };
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("📞 Incoming call from:", data.fromUserInfo.name);

      setIncomingCallData(data);
      setIsIncomingCall(true);

      // Show notification first
      setShowIncomingNotification(true);

      // Play ringtone
      playRingtone();

      // Request notification permission (browser)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Cuộc gọi video đến", {
          body: `${data.fromUserInfo.name} đang gọi cho bạn`,
          icon: data.fromUserInfo.avatar || "/default-avatar.png",
          tag: data.callId,
        });
      }
    };

    socket.on("incoming-call", handleIncomingCall);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, [socket]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Play ringtone (optional)
  const playRingtone = () => {
    // You can create an Audio instance here
    // const audio = new Audio('/ringtone.mp3');
    // audio.loop = true;
    // audio.play();
  };

  // Accept call from notification
  const handleAcceptFromNotification = () => {
    setShowIncomingNotification(false);
    setIsCallOpen(true);
  };

  // Reject call from notification
  const handleRejectFromNotification = () => {
    setShowIncomingNotification(false);

    if (incomingCallData && socket) {
      socket.emit("reject-call", {
        callId: incomingCallData.callId,
        toUserId: incomingCallData.fromUserId,
      });
    }

    setIsIncomingCall(false);
    setIncomingCallData(null);
  };

  // Start outgoing video call
  const handleStartVideoCall = () => {
    if (!activeConversation) return;

    setIsIncomingCall(false);
    setIncomingCallData(null);
    setIsCallOpen(true);
  };

  // Close call modal
  const handleCloseCall = () => {
    setIsCallOpen(false);
    setIsIncomingCall(false);
    setIncomingCallData(null);
    setShowIncomingNotification(false);
  };

  // ✅ Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 10) {
      setError("Chỉ có thể gửi tối đa 10 ảnh");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newPreviews: ImagePreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Remove image preview
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // ✅ Upload images using chatService
  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      return await chatService.uploadChatImages(files);
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  };

  // Prepare friend data for call
  const getFriendDataForCall = () => {
    if (isIncomingCall && incomingCallData) {
      return {
        name: incomingCallData.fromUserInfo.name,
        avatar: incomingCallData.fromUserInfo.avatar || "",
        isOnline: true,
        userId: incomingCallData.fromUserId,
      };
    }

    if (activeConversation) {
      return {
        name: activeConversation.name,
        avatar: activeConversation.avatar,
        isOnline: activeConversation.isOnline,
        userId: activeConversation.receiverId,
      };
    }

    return null;
  };

  const friendData = getFriendDataForCall();

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
                images: data.message.images || msg.images, // ✅ THÊM
                messageType: data.message.messageType || msg.messageType, // ✅ THÊM
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
        content: data.message?.content,
        messageType: data.message?.messageType,
        metadata: data.message?.metadata,
      });

      if (!data.message || !data.conversation) {
        console.error("❌ Invalid message data structure");
        return;
      }

      // ✅ NORMALIZE IDs - Cực kỳ quan trọng!
      const normalizeId = (id: string | undefined): string => {
        if (!id) return "";
        return id.trim().toLowerCase();
      };

      const currentUserId = normalizeId(profile?.id || profile?.userId || "");
      const messageSenderId = normalizeId(data.message.senderId);

      // ✅ So sánh sau khi normalize
      const isMyMessage = messageSenderId === currentUserId;

      console.log("🔍 Sender comparison (NORMALIZED):", {
        messageSenderId,
        currentUserId,
        isMyMessage,
        willShowAs: isMyMessage ? "user (RIGHT)" : "friend (LEFT)",
      });

      // ✅ Tạo message object
      const newMessage: Message = {
        id: data.message.id,
        text: data.message.content,
        sender: isMyMessage ? "user" : "friend",
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
        messageType: data.message.messageType || "text",
        metadata: data.message.metadata || undefined,
        images: data.message.images || [],
      };

      console.log("✅ Created message object:", {
        id: newMessage.id,
        sender: newMessage.sender,
        messageType: newMessage.messageType,
        isCallMessage: newMessage.messageType === "call",
      });

      const isActiveConversation =
        activeConversation && data.conversation.id === activeConversation.id;

      if (isActiveConversation) {
        setListMessagesConversation((prev) => {
          // ✅ Check duplicate với id hoặc tempId
          const isDuplicate = prev.some(
            (msg) =>
              msg.id === newMessage.id ||
              (msg.tempId && msg.tempId === newMessage.id)
          );

          if (isDuplicate) {
            console.log("⚠️ Duplicate message prevented:", newMessage.id);
            return prev;
          }

          console.log("➕ Adding message to conversation");
          return [...prev, newMessage];
        });

        setTimeout(() => scrollToBottom(), 100);

        // ✅ Chỉ mark as seen nếu KHÔNG phải tin nhắn của mình
        if (!isMyMessage) {
          socket.emit("markAsSeen", {
            conversationId: activeConversation.id,
            userId: profile?.id || profile?.userId,
          });
        }
      }

      // ✅ Update conversation list
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
                    unread: !isActiveConversation && !isMyMessage, // ✅ Chỉ unread nếu không active VÀ không phải tin nhắn của mình
                  }
                : conv
            )
            .sort((a, b) => {
              // ✅ Đưa conversation mới nhất lên đầu
              if (a.id === data.conversation.id) return -1;
              if (b.id === data.conversation.id) return 1;
              return 0;
            });
        } else {
          // ✅ Tạo conversation mới (trường hợp hiếm xảy ra)
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
            unread: !isMyMessage,
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
      console.log("getListMessageConversation", activeConversation);
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
          images: msg.metadata?.images || msg.images || [], // ✅ THÊM DÒNG NÀY
          messageType: msg.messageType || MessageType.TEXT, // ✅ THÊM DÒNG NÀY
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
    if (!activeConversation || !socket || !profile?.id) return;
    if (!newMessage.trim() && selectedImages.length === 0) return;

    setUploading(true);

    try {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages.map((p) => p.file));
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const messageText = newMessage.trim() || `${imageUrls.length} ảnh`;

      setNewMessage("");
      selectedImages.forEach((p) => URL.revokeObjectURL(p.preview));
      setSelectedImages([]);

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
        images: imageUrls.length > 0 ? imageUrls : undefined,
        messageType:
          imageUrls.length > 0 ? MessageType.IMAGE : MessageType.TEXT,
      };

      setListMessagesConversation((prev) => [...prev, optimisticMessage]);
      setTimeout(() => scrollToBottom(), 100);

      socket.emit("sendMessage", {
        senderId: profile.id,
        receiverId: activeConversation.receiverId,
        content: messageText,
        conversationId: activeConversation.id,
        tempId,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        messageType: imageUrls.length > 0 ? "image" : "text",
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
    } catch (error) {
      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
    }
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

  // ✅ Cleanup previews on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, [selectedImages]);

  return (
    <>
      <div className="bg-white fixed inset-0 z-50 flex overflow-hidden">
        {/* Left Sidebar - Conversations */}
        <div className="w-[400px] bg-white border-r flex flex-col min-h-0">
          <div className="p-2 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <Link
                href="/"
                className="font-bold text-lg md:text-xl flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/eclipse-svgrepo-com.svg"
                  alt="VidsoNet Logo"
                  className="h-8 w-8 md:h-10 md:w-10"
                />
                <span className="hidden sm:inline">VidsoNet</span>
              </Link>

              {/* <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Tin nhắn
              </h2> */}
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
                    <button
                      className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center"
                      onClick={() => setIsCallOpen(true)}
                    >
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
                        listMessagesConversations[index - 1].sender !==
                          "friend");

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
                            {/* <div
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
                            </div> */}

                            {/* ✅ CONDITIONAL RENDER DỰA VÀO messageType */}
                            <div className="flex flex-col gap-1 min-w-0">
                              {message.messageType === MessageType.CALL ? (
                                <CallMessage message={message} />
                              ) : (
                                <>
                                  {/* ✅ Image Block - Independent */}
                                  {message.images &&
                                    message.images.length > 0 && (
                                      <div
                                        className={cn(
                                          "rounded-2xl overflow-hidden"
                                        )}
                                      >
                                        <ImageMessage images={message.images} />
                                      </div>
                                    )}

                                  {/* ✅ Text Block - Independent with word-break */}
                                  {message.text &&
                                    message.text !==
                                      `${message.images?.length || 0} ảnh` && (
                                      <div
                                        className={cn(
                                          "rounded-2xl px-3 py-2 break-words",
                                          message.sender === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-800 border border-gray-200"
                                        )}
                                        style={{
                                          wordBreak: "break-word",
                                          overflowWrap: "anywhere",
                                        }}
                                      >
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                          {message.text}
                                        </p>
                                      </div>
                                    )}
                                </>
                              )}
                            </div>
                          </div>

                          <div
                            className={cn(
                              "flex items-center gap-1 mt-1 px-1",
                              message.sender === "user"
                                ? "justify-end"
                                : "justify-start ml-10"
                            )}
                          >
                            <span className="text-[10px] text-gray-500">
                              {message.timestamp}
                            </span>
                            {message.sender === "user" && messageStatus && (
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
                      <span className="text-xs text-gray-500">
                        đang nhập...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ✅ Image Preview Area */}
              {selectedImages.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {selectedImages.map((preview, index) => (
                      <ImagePreviewItem
                        key={index}
                        preview={preview.preview}
                        onRemove={() => handleRemoveImage(index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-2 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  {/* <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
                    <Paperclip className="w-5 h-5" />
                  </button> */}

                  {/* ✅ Image Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:bg-blue-50 h-9 w-9 flex-shrink-0"
                    disabled={uploading}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Nhập tin nhắn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 rounded-full pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[40px]"
                    />
                    {/* <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:bg-gray-200 w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center">
                      <Smile className="w-5 h-5" />
                    </button> */}
                  </div>

                  <button
                    onClick={handleSendMessage}
                    className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      (!newMessage.trim() && selectedImages.length === 0) ||
                      uploading
                    }
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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

      {/* Incoming Call Notification (shows before modal) */}
      {showIncomingNotification && incomingCallData && (
        <IncomingCallNotification
          isOpen={showIncomingNotification}
          callerInfo={{
            name: incomingCallData.fromUserInfo.name,
            avatar: incomingCallData.fromUserInfo.avatar,
          }}
          onAccept={handleAcceptFromNotification}
          onReject={handleRejectFromNotification}
        />
      )}

      {/* Video Call Modal */}
      {friendData && socket && profile && (
        <VideoCallModal
          isOpen={isCallOpen}
          onClose={handleCloseCall}
          friendData={friendData}
          socket={socket}
          currentUserId={profile.id}
          currentUserInfo={{
            name: profile.fullName || "You",
            avatar: profile.avatarUrl,
          }}
          isIncoming={isIncomingCall}
          incomingCallData={incomingCallData}
        />
      )}
    </>
  );
}
