// "use client";import { useState, useEffect, useRef, useCallback } from "react";// import {//   X,//   Send,//   Loader2,//   Clock,//   Check,//   CheckCheck,//   Smile,//   Paperclip,//   Image as ImageIcon,// } from "lucide-react";// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";// import { Button } from "@/components/ui/button";// import { Input } from "@/components/ui/input";// import { cn } from "@/lib/utils";// import { chatService } from "@/services/chat-service";// import { useSocketContext } from "@/providers/SocketProvider";// // Types// interface Message {//   id?: string;//   tempId?: string;//   senderId?: string;//   senderName?: string;//   text: string;//   sender: "user" | "friend";//   timestamp: string;//   createdAt?: string; // ✅ Thêm để group theo ngày//   avatar?: string;//   images?: string[];//   type?: string;//   status?: "sending" | "sent" | "delivered" | "read";//   isSent?: boolean;//   isDelivered?: boolean;//   isRead?: boolean;// }
// interface ChatDetailModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   conversationId: string;
//   otherUser: {
//     id: string;
//     name: string;
//     avatarUrl?: string;
//   };
//   currentUserId: string;
//   currentUserName: string;
// }

// // ✅ Format date for separator
// function formatDateSeparator(dateString: string): string {
//   const date = new Date(dateString);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   // Reset time to compare only dates
//   today.setHours(0, 0, 0, 0);
//   yesterday.setHours(0, 0, 0, 0);
//   date.setHours(0, 0, 0, 0);

//   if (date.getTime() === today.getTime()) {
//     return "Hôm nay";
//   } else if (date.getTime() === yesterday.getTime()) {
//     return "Hôm qua";
//   } else {
//     return date.toLocaleDateString("vi-VN", {
//       hour: "2-digit",
//       minute: "2-digit",
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   }
// }

// // ✅ Check if should show date separator
// function shouldShowDateSeparator(
//   currentMsg: Message,
//   previousMsg: Message | undefined
// ): boolean {
//   if (!previousMsg) return true;

//   const currentDate = new Date(
//     currentMsg.createdAt || currentMsg.timestamp
//   ).toDateString();
//   const previousDate = new Date(
//     previousMsg.createdAt || previousMsg.timestamp
//   ).toDateString();

//   return currentDate !== previousDate;
// }

// // ✅ Message Status Icon Component
// function MessageStatusIcon({
//   status,
// }: {
//   status?: "sending" | "sent" | "delivered" | "read";
// }) {
//   if (!status) return null;

//   const iconClass = "w-3.5 h-3.5";

//   switch (status) {
//     case "sending":
//       return (
//         <Clock
//           className={cn(iconClass, "text-gray-400 animate-pulse")}
//           strokeWidth={2.5}
//         />
//       );
//     case "sent":
//       return (
//         <Check className={cn(iconClass, "text-gray-400")} strokeWidth={2.5} />
//       );
//     case "delivered":
//       return (
//         <CheckCheck
//           className={cn(iconClass, "text-gray-400")}
//           strokeWidth={2.5}
//         />
//       );
//     case "read":
//       return (
//         <CheckCheck
//           className={cn(iconClass, "text-blue-500")}
//           strokeWidth={2.5}
//         />
//       );
//     default:
//       return null;
//   }
// }

// // ✅ Helper function to determine message status
// function getMessageStatus(
//   message: Message
// ): "sending" | "sent" | "delivered" | "read" | undefined {
//   if (message.sender !== "user") return undefined;

//   if (message.status) return message.status;
//   if (!message.id || message.tempId) return "sending";
//   if (message.isRead) return "read";
//   if (message.isDelivered) return "delivered";
//   if (message.isSent) return "sent";
//   return "sending";
// }

// export default function ChatDetailModal({
//   isOpen,
//   onClose,
//   conversationId,
//   otherUser,
//   currentUserId,
// }: ChatDetailModalProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [isOnline, setIsOnline] = useState(false);

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const { socket, onlineUsers } = useSocketContext();

//   // ✅ Scroll to bottom function
//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   // ✅ Auto-scroll when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages, scrollToBottom]);

//   // ✅ Update online status
//   useEffect(() => {
//     if (otherUser.id && onlineUsers.length > 0) {
//       setIsOnline(onlineUsers.includes(otherUser.id));
//     }
//   }, [onlineUsers, otherUser.id]);

//   // ✅ Listen for online/offline events
//   useEffect(() => {
//     if (!socket || !isOpen) return;

//     const handleUserOnline = (data: { userId: string; timestamp: string }) => {
//       if (data.userId === otherUser.id) {
//         setIsOnline(true);
//       }
//     };

//     const handleUserOffline = (data: { userId: string; timestamp: string }) => {
//       if (data.userId === otherUser.id) {
//         setIsOnline(false);
//       }
//     };

//     socket.on("userOnline", handleUserOnline);
//     socket.on("userOffline", handleUserOffline);

//     return () => {
//       socket.off("userOnline", handleUserOnline);
//       socket.off("userOffline", handleUserOffline);
//     };
//   }, [socket, otherUser.id, isOpen]);

//   // ✅ Mark messages as seen when modal is opened
//   useEffect(() => {
//     if (isOpen && socket && currentUserId && conversationId) {
//       const timer = setTimeout(() => {
//         socket.emit("markAsSeen", {
//           conversationId: conversationId,
//           userId: currentUserId,
//         });
//       }, 500);

//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, socket, currentUserId, conversationId]);

//   // ✅ Socket listeners for message status updates
//   useEffect(() => {
//     if (!socket || !currentUserId || !isOpen) return;

//     console.log("🎧 ChatModal: Listening for message status events...");

//     const handleMessageSent = (data: {
//       tempId: string;
//       message: any;
//       conversationId: string;
//     }) => {
//       if (data.conversationId !== conversationId) return;

//       console.log("✅ ChatModal: Message sent:", data);

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.tempId === data.tempId
//             ? {
//                 ...msg,
//                 id: data.message.id,
//                 status: "sent",
//                 isSent: true,
//                 tempId: undefined,
//                 createdAt: data.message.createdAt,
//               }
//             : msg
//         )
//       );
//     };

//     const handleMessageDelivered = (data: {
//       messageId: string;
//       conversationId: string;
//       deliveredAt: string;
//     }) => {
//       if (data.conversationId !== conversationId) return;

//       console.log("✅✅ ChatModal: Message delivered:", data);

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === data.messageId
//             ? {
//                 ...msg,
//                 status: "delivered",
//                 isDelivered: true,
//               }
//             : msg
//         )
//       );
//     };

//     const handleMessagesSeen = (data: {
//       conversationId: string;
//       seenBy: string;
//       timestamp: string;
//     }) => {
//       if (data.conversationId !== conversationId) return;

//       console.log("👀 ChatModal: Messages seen:", data);

//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.sender === "user"
//             ? {
//                 ...msg,
//                 status: "read",
//                 isRead: true,
//               }
//             : msg
//         )
//       );
//     };

//     const handleMessageError = (data: { tempId: string; error: string }) => {
//       console.error("❌ ChatModal: Message error:", data);

//       setMessages((prev) => {
//         const failedMsg = prev.find((m) => m.tempId === data.tempId);
//         if (failedMsg) {
//           setInputText(failedMsg.text);
//         }
//         return prev.filter((msg) => msg.tempId !== data.tempId);
//       });

//       setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
//       setTimeout(() => setError(null), 3000);
//     };

//     const handleNewMessage = (data: any) => {
//       console.log("💬 ChatModal: New message received:", data);

//       if (!data.message || !data.conversation) {
//         console.error("❌ Invalid message data structure");
//         return;
//       }

//       if (data.conversation.id !== conversationId) return;

//       const newMessage: Message = {
//         id: data.message.id,
//         text: data.message.content,
//         sender: "friend",
//         timestamp:
//           data.message.timestamp ||
//           new Date().toLocaleTimeString("vi-VN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           }),
//         createdAt: data.message.createdAt || new Date().toISOString(),
//         senderName: data.message.senderName || data.conversation.name,
//         avatar: data.conversation.avatar,
//         status: undefined,
//       };

//       setMessages((prev) => {
//         if (prev.some((msg) => msg.id === newMessage.id)) {
//           console.log("⚠️ Duplicate message prevented");
//           return prev;
//         }
//         return [...prev, newMessage];
//       });

//       setTimeout(() => scrollToBottom(), 100);

//       socket.emit("markAsSeen", {
//         conversationId: conversationId,
//         userId: currentUserId,
//       });
//     };

//     socket.on("messageSent", handleMessageSent);
//     socket.on("messageDelivered", handleMessageDelivered);
//     socket.on("messagesSeen", handleMessagesSeen);
//     socket.on("messageError", handleMessageError);
//     socket.on("newMessage", handleNewMessage);

//     return () => {
//       socket.off("messageSent", handleMessageSent);
//       socket.off("messageDelivered", handleMessageDelivered);
//       socket.off("messagesSeen", handleMessagesSeen);
//       socket.off("messageError", handleMessageError);
//       socket.off("newMessage", handleNewMessage);
//     };
//   }, [
//     socket,
//     currentUserId,
//     conversationId,
//     isOpen,
//     scrollToBottom,
//     otherUser.name,
//   ]);

//   // ✅ Fetch messages when modal opens
//   useEffect(() => {
//     if (!isOpen || !conversationId || !currentUserId) return;

//     const fetchMessages = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await chatService.getMessagesConversation(
//           conversationId,
//           currentUserId
//         );

//         console.log("✅ ChatModal: Messages loaded:", res?.messages);

//         if (res && res.messages) {
//           const messagesWithStatus = res.messages.map((msg: any) => ({
//             ...msg,
//             createdAt: msg.createdAt || new Date().toISOString(),
//             status:
//               msg.sender === "user"
//                 ? msg.isRead
//                   ? "read"
//                   : msg.isDelivered
//                   ? "delivered"
//                   : msg.isSent
//                   ? "sent"
//                   : "sending"
//                 : undefined,
//           }));
//           setMessages(messagesWithStatus);
//         }
//       } catch (error) {
//         console.error("❌ ChatModal: Error loading messages:", error);
//         setError("Không thể tải tin nhắn");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [isOpen, conversationId, currentUserId]);

//   // ✅ Send message
//   const handleSend = async () => {
//     if (!inputText.trim() || !socket || !currentUserId) return;

//     console.log("📤 ChatModal: Sending message:", inputText);
//     const tempId = `temp-${Date.now()}-${Math.random()}`;
//     const messageText = inputText;
//     setInputText("");

//     const optimisticMessage: Message = {
//       id: tempId,
//       tempId,
//       text: messageText,
//       sender: "user",
//       timestamp: new Date().toLocaleTimeString("vi-VN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       createdAt: new Date().toISOString(),
//       status: "sending",
//     };

//     setMessages((prev) => [...prev, optimisticMessage]);
//     setTimeout(() => scrollToBottom(), 100);

//     socket.emit("sendMessage", {
//       senderId: currentUserId,
//       receiverId: otherUser.id,
//       content: messageText,
//       conversationId: conversationId,
//       tempId,
//     });
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

//       {/* Modal */}
//       <div className="fixed bottom-0 right-4 sm:right-20 lg:right-24 w-[90%] sm:w-[350px] md:w-[400px] h-[550px] z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col">
//         {/* Header */}
//         <div className="bg-blue-600 text-white p-3 rounded-t-2xl flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Avatar className="w-9 h-9">
//                 <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
//                 <AvatarFallback className="bg-blue-700 text-white">
//                   {otherUser.name.charAt(0).toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               {isOnline && (
//                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//               )}
//             </div>
//             <div>
//               <p className="font-semibold text-sm">{otherUser.name}</p>
//               <p className="text-xs text-blue-100">
//                 {isOnline ? "Đang hoạt động" : "Không hoạt động"}
//               </p>
//             </div>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={onClose}
//             className="text-white hover:bg-blue-700 h-8 w-8"
//           >
//             <X className="w-5 h-5" />
//           </Button>
//         </div>

//         {/* Messages Area */}
//         <div
//           className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
//           ref={scrollRef}
//         >
//           {loading ? (
//             <div className="flex items-center justify-center h-full">
//               <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-red-500 text-sm">{error}</p>
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500 text-sm">Chưa có tin nhắn nào</p>
//             </div>
//           ) : (
//             messages.map((message, index) => {
//               const showAvatar =
//                 message.sender === "friend" &&
//                 (index === 0 || messages[index - 1].sender !== "friend");

//               const messageStatus = getMessageStatus(message);
//               const showDateSeparator = shouldShowDateSeparator(
//                 message,
//                 messages[index - 1]
//               );

//               return (
//                 <div key={message.id || message.tempId}>
//                   {/* ✅ Date Separator */}
//                   {showDateSeparator && (
//                     <div className="flex items-center justify-center my-4">
//                       <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
//                         {formatDateSeparator(
//                           message.createdAt || message.timestamp
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Message */}
//                   <div
//                     className={cn(
//                       "flex flex-col",
//                       message.sender === "user" ? "items-end" : "items-start"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "flex gap-2 max-w-[75%]",
//                         message.sender === "user"
//                           ? "flex-row-reverse"
//                           : "flex-row"
//                       )}
//                     >
//                       {message.sender === "friend" && (
//                         <div
//                           className={cn(
//                             "w-7 h-7 flex-shrink-0 self-end",
//                             showAvatar ? "visible" : "invisible"
//                           )}
//                         >
//                           {showAvatar && (
//                             <Avatar className="w-7 h-7">
//                               <AvatarImage
//                                 src={message.avatar || otherUser.avatarUrl}
//                                 alt={message.senderName}
//                               />
//                               <AvatarFallback className="bg-blue-500 text-white text-xs">
//                                 {message.senderName?.charAt(0).toUpperCase() ||
//                                   otherUser.name.charAt(0).toUpperCase()}
//                               </AvatarFallback>
//                             </Avatar>
//                           )}
//                         </div>
//                       )}

//                       {/* ✅ FIX: word-break để text dài tự động xuống dòng */}
//                       <div
//                         className={cn(
//                           "px-3 py-2 rounded-[18px] shadow-sm",
//                           "break-words overflow-wrap-anywhere word-break-break-word",
//                           message.sender === "user"
//                             ? "bg-blue-600 text-white"
//                             : "bg-white text-gray-900 border border-gray-200"
//                         )}
//                         style={{
//                           wordBreak: "break-word",
//                           overflowWrap: "anywhere",
//                         }}
//                       >
//                         <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                           {message.text}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Timestamp & Status */}
//                     <div
//                       className={cn(
//                         "mt-1 px-2 flex items-center gap-1.5",
//                         message.sender === "user" ? "flex-row-reverse" : "ml-9"
//                       )}
//                     >
//                       <span className="text-[11px] text-gray-500">
//                         {message.timestamp}
//                       </span>
//                       {messageStatus && (
//                         <MessageStatusIcon status={messageStatus} />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-200">
//                 <div className="flex gap-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "0.1s" }}
//                   ></div>
//                   <div
//                     className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                     style={{ animationDelay: "0.2s" }}
//                   ></div>
//                 </div>
//                 <span className="text-xs text-gray-500">đang nhập...</span>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <div className="p-3 border-t bg-white rounded-b-2xl">
//           <div className="flex items-center gap-2">
//             <button className="text-blue-600 hover:bg-gray-100 w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
//               <Paperclip className="w-4 h-4" />
//             </button>

//             <button className="text-blue-600 hover:bg-gray-100 w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
//               <ImageIcon className="w-4 h-4" />
//             </button>

//             <div className="flex-1 relative">
//               <Input
//                 placeholder="Nhập tin nhắn..."
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 disabled={loading}
//                 className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 rounded-full pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm h-9"
//               />
//               <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:bg-gray-200 w-6 h-6 rounded-full transition-all duration-200 flex items-center justify-center">
//                 <Smile className="w-4 h-4" />
//               </button>
//             </div>

//             <button
//               onClick={handleSend}
//               disabled={!inputText.trim() || loading}
//               className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone,
  Video,
  PhoneMissed,
  PhoneOff,
  X,
  Send,
  Loader2,
  Clock,
  Check,
  CheckCheck,
  Image as ImageIcon,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/chat-service";
import { useSocketContext } from "@/providers/SocketProvider";
import { CallMetadata, CallType, MessageType } from "@/types/chat";
import IncomingCallNotification from "../video-call/IncomingCallNotification";
import VideoCallModal from "../video-call/VideoCallModal";
import { useAuthStore } from "@/store/auth-store";

// Types
interface Message {
  id?: string;
  tempId?: string;
  senderId?: string;
  senderName?: string;
  text: string;
  sender: "user" | "friend";
  timestamp: string;
  createdAt?: string;
  avatar?: string;
  images?: string[];
  messageType?: "text" | "image" | "call";
  type?: string;
  status?: "sending" | "sent" | "delivered" | "read";
  isSent?: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  metadata?: CallMetadata;
}

export interface ImagePreview {
  file: File;
  preview: string;
}

interface ChatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  otherUser: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  currentUserId: string;
  currentUserName: string;
  // currentUserAvatar: string;
}

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

function CallMessage({ message }: { message: Message }) {
  const metadata = message.metadata;

  if (!metadata) return null;

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

// Helper functions
function formatDateSeparator(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Hôm nay";
  } else if (date.getTime() === yesterday.getTime()) {
    return "Hôm qua";
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
}

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

export default function ChatDetailModal({
  isOpen,
  onClose,
  conversationId,
  otherUser,
  currentUserId,
  currentUserName,
}: // currentUserAvatar,
ChatDetailModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // ✅ Image upload states
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video call states
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [showIncomingNotification, setShowIncomingNotification] =
    useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, onlineUsers } = useSocketContext();

  const { profile } = useAuthStore();
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (otherUser.id && onlineUsers.length > 0) {
      setIsOnline(onlineUsers.includes(otherUser.id));
    }
  }, [onlineUsers, otherUser.id]);

  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleUserOnline = (data: { userId: string; timestamp: string }) => {
      if (data.userId === otherUser.id) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = (data: { userId: string; timestamp: string }) => {
      if (data.userId === otherUser.id) {
        setIsOnline(false);
      }
    };

    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [socket, otherUser.id, isOpen]);

  useEffect(() => {
    if (isOpen && socket && currentUserId && conversationId) {
      const timer = setTimeout(() => {
        socket.emit("markAsSeen", {
          conversationId: conversationId,
          userId: currentUserId,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, socket, currentUserId, conversationId]);

  // Listen for incoming calls
  useEffect(() => {
    if (!socket || !isOpen) return;

    const handleIncomingCall = (data: {
      callId: string;
      fromUserId: string;
      fromUserInfo: { name: string; avatar?: string };
      offer: RTCSessionDescriptionInit;
    }) => {
      console.log("📞 Incoming call from:", data.fromUserInfo.name);

      setIncomingCallData(data);
      setIsIncomingCall(true);
      setShowIncomingNotification(true);

      // Request notification permission
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
  }, [socket, isOpen]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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

    return {
      name: otherUser.name,
      avatar: otherUser.avatarUrl || "",
      isOnline: isOnline,
      userId: otherUser.id,
    };
  };

  const friendData = getFriendDataForCall();

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

  useEffect(() => {
    if (!socket || !currentUserId || !isOpen) return;

    const handleMessageSent = (data: {
      tempId: string;
      message: any;
      conversationId: string;
    }) => {
      if (data.conversationId !== conversationId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === data.tempId
            ? {
                ...msg,
                id: data.message.id,
                status: "sent",
                isSent: true,
                tempId: undefined,
                createdAt: data.message.createdAt,
                images: data.message.images || msg.images,
                messageType: data.message.messageType || msg.messageType,
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
      if (data.conversationId !== conversationId) return;

      setMessages((prev) =>
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
      if (data.conversationId !== conversationId) return;

      setMessages((prev) =>
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
      setMessages((prev) => {
        const failedMsg = prev.find((m) => m.tempId === data.tempId);
        if (failedMsg) {
          setInputText(failedMsg.text);
        }
        return prev.filter((msg) => msg.tempId !== data.tempId);
      });

      setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
      setTimeout(() => setError(null), 3000);
    };

    const handleNewMessage = (data: any) => {
      if (!data.message || !data.conversation) return;
      if (data.conversation.id !== conversationId) return;

      // ✅ NORMALIZE IDs
      const normalizeId = (id: string | undefined): string => {
        if (!id) return "";
        return id.trim().toLowerCase();
      };

      const currentUserIdNormalized = normalizeId(currentUserId);
      const messageSenderIdNormalized = normalizeId(data.message.senderId);

      // ✅ So sánh sau khi normalize
      const isMyMessage = messageSenderIdNormalized === currentUserIdNormalized;

      const newMessage: Message = {
        id: data.message.id,
        text: data.message.content,
        sender: isMyMessage ? "user" : "friend", // ✅ Dựa vào senderId
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
        images: data.message.images || [], // ✅ Thêm
        messageType: data.message.messageType || MessageType.TEXT, // ✅ Thêm
        metadata: data.message.metadata || undefined, // ✅ Thêm
      };

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      setTimeout(() => scrollToBottom(), 100);

      socket.emit("markAsSeen", {
        conversationId: conversationId,
        userId: currentUserId,
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
  }, [socket, currentUserId, conversationId, isOpen, scrollToBottom]);

  useEffect(() => {
    if (!isOpen || !conversationId || !currentUserId) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await chatService.getMessagesConversation(
          conversationId,
          currentUserId
        );

        if (res && res.messages) {
          const messagesWithStatus = res.messages.map((msg: any) => ({
            ...msg,
            createdAt: msg.createdAt || new Date().toISOString(),
            images: msg.metadata?.images || msg.images || [], // ✅ Thêm
            messageType: msg.messageType || MessageType.TEXT, // ✅ Thêm
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
          setMessages(messagesWithStatus);
        }
      } catch (error) {
        setError("Không thể tải tin nhắn");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isOpen, conversationId, currentUserId]);

  // ✅ Send message (with image support)
  const handleSend = async () => {
    if (!socket || !currentUserId) return;
    if (!inputText.trim() && selectedImages.length === 0) return;

    setUploading(true);

    try {
      let imageUrls: string[] = [];

      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(selectedImages.map((p) => p.file));
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const messageText = inputText.trim() || `${imageUrls.length} ảnh`;

      setInputText("");
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
        messageType: imageUrls.length > 0 ? "image" : "text",
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setTimeout(() => scrollToBottom(), 100);

      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: otherUser.id,
        content: messageText,
        conversationId: conversationId,
        tempId,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        messageType: imageUrls.length > 0 ? "image" : "text",
      });
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
      handleSend();
    }
  };

  // ✅ Cleanup previews on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, [selectedImages]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed bottom-0 right-4 sm:right-20 lg:right-24 w-[90%] sm:w-[350px] md:w-[400px] h-[550px] z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="w-9 h-9">
                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                <AvatarFallback className="bg-blue-700 text-white">
                  {otherUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{otherUser.name}</p>
              <p className="text-xs text-blue-100">
                {isOnline ? "Đang hoạt động" : "Không hoạt động"}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStartVideoCall}
              className="text-white hover:bg-blue-700 h-8 w-8"
            >
              <Video className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-blue-700 h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
          ref={scrollRef}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">Chưa có tin nhắn nào</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const showAvatar =
                message.sender === "friend" &&
                (index === 0 || messages[index - 1].sender !== "friend");

              const messageStatus = getMessageStatus(message);
              const showDateSeparator = shouldShowDateSeparator(
                message,
                messages[index - 1]
              );

              return (
                <div key={message.id || message.tempId}>
                  {showDateSeparator && (
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                        {formatDateSeparator(
                          message.createdAt || message.timestamp
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex flex-col",
                      message.sender === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex gap-2 max-w-[75%]",
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      )}
                    >
                      {message.sender === "friend" && (
                        <div
                          className={cn(
                            "w-7 h-7 flex-shrink-0 self-end",
                            showAvatar ? "visible" : "invisible"
                          )}
                        >
                          {showAvatar && (
                            <Avatar className="w-7 h-7">
                              <AvatarImage
                                src={message.avatar || otherUser.avatarUrl}
                                alt={otherUser.name}
                              />
                              <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                                {otherUser.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-1 min-w-0">
                        {/* ✅ CONDITIONAL RENDER DỰA VÀO messageType */}
                        {message.messageType === MessageType.CALL ? (
                          <CallMessage message={message} />
                        ) : (
                          <>
                            {/* ✅ Image Message */}
                            {message.images && message.images.length > 0 && (
                              <div
                                className={cn(
                                  "rounded-2xl overflow-hidden",
                                  message.sender === "user"
                                    ? "bg-blue-600"
                                    : "bg-white border border-gray-200"
                                )}
                              >
                                <ImageMessage images={message.images} />
                              </div>
                            )}

                            {/* ✅ Text Message */}
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
                                >
                                  <p className="text-sm whitespace-pre-wrap">
                                    {message.text}
                                  </p>
                                </div>
                              )}
                          </>
                        )}

                        {/* ✅ Timestamp and Status */}
                        <div
                          className={cn(
                            "flex items-center gap-1 px-1",
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          <span className="text-[10px] text-gray-500">
                            {message.timestamp}
                          </span>
                          {message.sender === "user" && (
                            <MessageStatusIcon status={messageStatus} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                  {otherUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
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

        {/* ✅ Input Area */}
        <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
          <div className="flex items-center gap-2">
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

            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Aa"
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={uploading}
            />

            <Button
              onClick={handleSend}
              disabled={
                (!inputText.trim() && selectedImages.length === 0) || uploading
              }
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-9 p-0 flex-shrink-0"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* ✅ Error Message */}
          {error && (
            <div className="mt-2 text-xs text-red-500 text-center">{error}</div>
          )}
        </div>
      </div>

      {/* ✅ Incoming Call Notification */}
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

      {/* ✅ Video Call Modal */}
      {friendData && socket && (
        <VideoCallModal
          isOpen={isCallOpen}
          onClose={handleCloseCall}
          friendData={friendData}
          socket={socket}
          currentUserId={currentUserId}
          currentUserInfo={{
            name: currentUserName,
            avatar: profile?.avatarUrl ?? "",
          }}
          isIncoming={isIncomingCall}
          incomingCallData={incomingCallData}
        />
      )}
    </>
  );
}
