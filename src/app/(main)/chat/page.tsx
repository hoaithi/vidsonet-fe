// "use client";// import { Input } from "@/components/ui/input";// import { cn } from "@/lib/utils";// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";// import {//   MoreVertical,//   Paperclip,//   Phone,//   Search,//   Send,
//   Smile,
//   Video,
//   Image as ImageIcon,
// } from "lucide-react";
// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { chatService } from "@/services/chat-service";
// import { ConversationList, ConversationMessagesResponse } from "@/types/chat";
// import { useSocketContext } from "@/providers/SocketProvider";

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

// export interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "friend";
//   timestamp: string;
//   senderName?: string;
//   avatar?: string;
//   reaction?: string;
// }

// export const mockConversations: Conversation[] = [
//   {
//     id: "1",
//     name: "Alex Chen",
//     avatar: "/user-avatar-1.png",
//     lastMessage:
//       "That sounds exciting! What kind of project are you working on?That sounds exciting! What kind of project are you working on?",
//     timestamp: "2:36 PM",
//     unread: true,
//     isOnline: true,
//     lastSeen: "Đang hoạt động",
//     messageCount: 5,
//   },
//   {
//     id: "2",
//     name: "Sarah Kim",
//     avatar: "/diverse-user-avatar-set-2.png",
//     lastMessage: "Thanks for sharing that tutorial!",
//     timestamp: "1:20 PM",
//     unread: true,
//     isOnline: true,
//     lastSeen: "Đang hoạt động",
//     messageCount: 12,
//   },
//   {
//     id: "3",
//     name: "Tech Enthusiasts",
//     avatar: "/diverse-user-avatars-3.png",
//     lastMessage: "Mike: Anyone tried the new framework?",
//     timestamp: "Yesterday",
//     unread: false,
//     isOnline: false,
//     lastSeen: "Hoạt động 2 giờ trước",
//     messageCount: 45,
//   },
//   {
//     id: "4",
//     name: "David Wilson",
//     avatar: "/user-avatar-4.png",
//     lastMessage: "See you tomorrow at the meeting!",
//     timestamp: "Yesterday",
//     unread: false,
//     isOnline: false,
//     lastSeen: "Hoạt động 1 ngày trước",
//     messageCount: 8,
//   },
//   {
//     id: "5",
//     name: "Emma Rodriguez",
//     avatar: "/user-avatar-5.png",
//     lastMessage: "The code review looks good 👍",
//     timestamp: "2 days ago",
//     unread: false,
//     isOnline: true,
//     lastSeen: "Đang hoạt động",
//     messageCount: 23,
//   },
//   {
//     id: "6",
//     name: "React Developers",
//     avatar: "/group-avatar-1.png",
//     lastMessage: "Lisa: New React 19 features are amazing!",
//     timestamp: "3 days ago",
//     unread: false,
//     isOnline: false,
//     lastSeen: "Hoạt động 1 giờ trước",
//     messageCount: 156,
//   },
//   {
//     id: "6",
//     name: "React Developers",
//     avatar: "/group-avatar-1.png",
//     lastMessage: "Lisa: New React 19 features are amazing!",
//     timestamp: "3 days ago",
//     unread: false,
//     isOnline: false,
//     lastSeen: "Hoạt động 1 giờ trước",
//     messageCount: 156,
//   },
//   {
//     id: "6",
//     name: "React Developers",
//     avatar: "/group-avatar-1.png",
//     lastMessage: "Lisa: New React 19 features are amazing!",
//     timestamp: "3 days ago",
//     unread: false,
//     isOnline: false,
//     lastSeen: "Hoạt động 1 giờ trước",
//     messageCount: 156,
//   },
//   {
//     id: "6",
//     name: "React Developers",
//     avatar: "/group-avatar-1.png",
//     lastMessage: "Lisa: New React 19 features are amazing!",
//     timestamp: "3 days ago",
//     unread: false,
//     isOnline: false,
//     lastSeen: "Hoạt động 1 giờ trước",
//     messageCount: 156,
//   },
// ];

// const mockMessages: Message[] = [
//   {
//     id: "1",
//     text: "Hey! How are you doing?",
//     sender: "friend",
//     timestamp: "2:30 PM",
//     senderName: "Alex Chen",
//     avatar: "/user-avatar-1.png",
//   },
//   {
//     id: "2",
//     text: "I'm doing great! Just working on a new project.",
//     sender: "user",
//     timestamp: "2:32 PM",
//   },
//   {
//     id: "3",
//     text: "That sounds exciting! What kind of project are you working on?",
//     sender: "friend",
//     timestamp: "2:36 PM",
//     senderName: "Alex Chen",
//     avatar: "/user-avatar-1.png",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
//   {
//     id: "4",
//     text: "It's a chat application using Next.js and React!",
//     sender: "user",
//     timestamp: "2:38 PM",
//   },
// ];

// export default function ChatPage() {
//   const [conversations] = useState<Conversation[]>(mockConversations);
//   const [listConversations, setListConversation] = useState<ConversationList>(
//     []
//   );

//   const [listMessagesConversations, setListMessagesConversation] = useState<
//     Message[]
//   >([]);

//   const [activeConversation, setActiveConversation] = useState<string | null>(
//     "1"
//   );
//   const [searchQuery, setSearchQuery] = useState("");
//   const [messages, setMessages] = useState<Message[]>(mockMessages);
//   const [newMessage, setNewMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const { socket, isConnected } = useSocketContext(); // ✅ lấy socket từ context

//   useEffect(() => {
//     if (!socket) return;

//     console.log("🎧 Listening for new messages...");

//     socket.on("newMessage", (data) => {
//       console.log("💬 New message received:", data);

//       if (data.conversation.id !== activeConversation) {
//         console.log("Message from different conversation, ignoring for now");
//         return;
//       }

//       // ✅ Transform data để match với Message type
//       const transformedMessage: Message = {
//         id: data.message.id,
//         text: data.message.text,
//         sender: data.message.sender === "user" ? "friend" : "user", // ⚠️ Đảo ngược vì đây là tin nhắn người khác gửi đến
//         timestamp: data.message.timestamp,
//         senderName: data.message.senderName,
//         avatar: data.conversation.avatar || undefined,
//       };

//       setListMessagesConversation((prev) => [...prev, transformedMessage]);
//     });

//     // cleanup khi unmount
//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, activeConversation]);

//   useEffect(() => {
//     getListConversation();
//     getListMessageConversation();
//   }, []);

//   const getListConversation = async () => {
//     try {
//       const res = await chatService.getConversation(
//         "673145fe-04a3-4f6d-ad27-7694bc087fd4"
//       );
//       console.log("check dataa ress", res);
//       if (res) {
//         setListConversation(res);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getListMessageConversation = async () => {
//     try {
//       const res = await chatService.getMessagesConversation(
//         "b5bc0ba5-6197-481b-808b-3be49b808dd3"
//       );
//       console.log("check dataa ress message ", res?.messages);
//       if (res) {
//         setListMessagesConversation(res?.messages);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Get friend data from active conversation
//   const friendData = conversations.find(
//     (conv) => conv.id === activeConversation
//   ) || {
//     name: "Unknown",
//     avatar: "/placeholder-avatar.png",
//     isOnline: false,
//   };

//   const filteredConversations = listConversations.filter(
//     (conv) =>
//       conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       const message: Message = {
//         id: Date.now().toString(),
//         text: newMessage,
//         sender: "user",
//         timestamp: new Date().toLocaleTimeString("en-US", {
//           hour: "numeric",
//           minute: "2-digit",
//         }),
//       };
//       setMessages([...messages, message]);
//       setNewMessage("");

//       console.log("new message ", message);

//       // Simulate friend typing and response
//       setIsTyping(true);
//       setTimeout(() => {
//         setIsTyping(false);
//         const friendResponse: Message = {
//           id: (Date.now() + 1).toString(),
//           text: "That's great! I'll check it out.",
//           sender: "friend",
//           timestamp: new Date().toLocaleTimeString("en-US", {
//             hour: "numeric",
//             minute: "2-digit",
//           }),
//           senderName: friendData.name,
//           avatar: friendData.avatar,
//         };
//         setMessages((prev) => [...prev, friendResponse]);
//       }, 2000);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const onVideoCall = () => {
//     console.log("Starting video call...");
//     // Add video call logic here
//   };

//   return (
//     <div className="bg-white fixed inset-0 z-50 flex overflow-x-hidden overflow-y-hidden">
//       {/* Left Sidebar - Conversations */}
//       <div className="w-[400px] bg-white border-r flex flex-col min-h-0">
//         {/* Message Header */}
//         <div className="p-2 border-b border-gray-200 flex-shrink-0">
//           {/* Header Title */}
//           <div className="flex items-center justify-between mb-2">
//             <h2 className="text-2xl font-bold text-gray-900">Tin nhắn</h2>
//           </div>

//           {/* Search Input */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Tìm kiếm cuộc trò chuyện..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//             />
//           </div>
//         </div>

//         {/* Conversation List */}
//         <div className="flex-1 overflow-y-auto">
//           {filteredConversations.length === 0 ? (
//             <div className="p-4 text-center text-gray-600">
//               {searchQuery
//                 ? "Không tìm thấy cuộc trò chuyện nào"
//                 : "Chưa có tin nhắn"}
//             </div>
//           ) : (
//             <div className="space-y-1 p-2">
//               {filteredConversations.map((conversation) => (
//                 <div
//                   key={conversation.id}
//                   onClick={() => setActiveConversation(conversation.id)}
//                   className={cn(
//                     "p-3 rounded-lg cursor-pointer transition-all duration-200",
//                     activeConversation === conversation.id
//                       ? "bg-blue-50"
//                       : "hover:bg-gray-50"
//                   )}
//                 >
//                   <div className="flex items-center gap-3">
//                     {/* Avatar with online indicator */}
//                     <div className="relative">
//                       <Avatar className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-full">
//                         <AvatarImage
//                           src={conversation.avatar}
//                           alt={conversation.name}
//                           className="w-full h-full object-cover"
//                         />
//                         <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold">
//                           {conversation.name.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       {conversation.isOnline && (
//                         <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                       )}
//                     </div>

//                     {/* Conversation Info */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h3
//                           className={cn(
//                             "font-semibold truncate",
//                             conversation.unread
//                               ? "text-gray-900"
//                               : "text-gray-700"
//                           )}
//                         >
//                           {conversation.name}
//                         </h3>
//                         <span className="text-xs text-gray-500 flex-shrink-0">
//                           {conversation.timestamp}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <p
//                           className={cn(
//                             "text-sm truncate",
//                             conversation.unread
//                               ? "text-gray-900 font-medium"
//                               : "text-gray-600"
//                           )}
//                         >
//                           {conversation.lastMessage}
//                         </p>
//                         {conversation.unread && (
//                           <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Right Side - Chat Area */}
//       <div className="flex-1 bg-gray-200 flex flex-col min-h-0 p-4">
//         {activeConversation ? (
//           <div className="flex flex-col flex-1 min-h-0 bg-white rounded-2xl p-3">
//             {/* Chat Header */}
//             <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {/* Friend Avatar */}
//                   <div className="relative">
//                     <Avatar className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-full">
//                       <AvatarImage
//                         src={friendData.avatar}
//                         alt={friendData.name}
//                         className="w-full h-full object-cover"
//                       />
//                       <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold">
//                         {friendData.name.charAt(0).toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     {friendData.isOnline && (
//                       <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                     )}
//                   </div>

//                   {/* Friend Info */}
//                   <div>
//                     <h3 className="font-semibold text-gray-900">
//                       {friendData.name}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {friendData.isOnline
//                         ? "Đang hoạt động"
//                         : "Hoạt động gần đây"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex items-center gap-1">
//                   <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center">
//                     <Phone className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={onVideoCall}
//                     className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center"
//                   >
//                     <Video className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
//               {listMessagesConversations?.map((message, index) => {
//                 const showAvatar =
//                   message?.sender === "friend" &&
//                   (index === 0 ||
//                     listMessagesConversations[index - 1].sender !== "friend");

//                 return (
//                   <div
//                     key={message.id}
//                     className={cn(
//                       "flex flex-col",
//                       message.sender === "user" ? "items-end" : "items-start"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "flex gap-2 max-w-[75%] sm:max-w-md",
//                         message.sender === "user"
//                           ? "flex-row-reverse"
//                           : "flex-row"
//                       )}
//                     >
//                       {/* Avatar for friend messages */}
//                       {message.sender === "friend" && (
//                         <div
//                           className={cn(
//                             "w-8 h-8 flex-shrink-0 self-end",
//                             showAvatar ? "visible" : "invisible"
//                           )}
//                         >
//                           {showAvatar && (
//                             <Avatar className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-full">
//                               <AvatarImage
//                                 src={message.avatar}
//                                 alt={message.senderName}
//                                 className="w-full h-full object-cover"
//                               />
//                               <AvatarFallback className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs">
//                                 {message.senderName?.charAt(0).toUpperCase()}
//                               </AvatarFallback>
//                             </Avatar>
//                           )}
//                         </div>
//                       )}

//                       {/* Message Bubble */}
//                       <div
//                         className={cn(
//                           "px-3 py-2 break-words overflow-wrap-anywhere",
//                           message.sender === "user"
//                             ? "bg-blue-600 text-white rounded-[18px]   shadow-sm"
//                             : "bg-white text-gray-900 rounded-[18px]  shadow-sm border border-gray-200"
//                         )}
//                       >
//                         <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                           {message.text}
//                         </p>
//                         {message.reaction && (
//                           <div className="mt-1 flex justify-end">
//                             <span className="text-base">
//                               {message.reaction}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Timestamp */}
//                     <div
//                       className={cn(
//                         "mt-1 px-3",
//                         message.sender === "user" ? "mr-0" : "ml-10"
//                       )}
//                     >
//                       <span className="text-[11px] text-gray-500">
//                         {message.timestamp}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Typing Indicator */}
//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-200">
//                     <div className="flex gap-1">
//                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.1s" }}
//                       ></div>
//                       <div
//                         className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       ></div>
//                     </div>
//                     <span className="text-xs text-gray-500">đang nhập...</span>
//                   </div>
//                 </div>
//               )}

//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="p-2 border-t border-gray-200 bg-white flex-shrink-0">
//               <div className="flex items-center gap-2">
//                 {/* Attachment Button */}
//                 <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
//                   <Paperclip className="w-5 h-5" />
//                 </button>

//                 {/* Image Button */}
//                 <button className="text-blue-600 hover:bg-gray-100 w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 flex items-center justify-center">
//                   <ImageIcon className="w-5 h-5" />
//                 </button>

//                 {/* Message Input */}
//                 <div className="flex-1 relative">
//                   <Input
//                     placeholder="Nhập tin nhắn..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 rounded-full pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[40px]"
//                   />
//                   <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:bg-gray-200 w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center">
//                     <Smile className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Send Button */}
//                 <button
//                   onClick={handleSendMessage}
//                   className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
//                   disabled={!newMessage.trim()}
//                 >
//                   <Send className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-gray-50">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Chọn cuộc trò chuyện
//               </h3>
//               <p className="text-gray-600">
//                 Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { chatService } from "@/services/chat-service";
import { ConversationList } from "@/types/chat";
import { useSocketContext } from "@/providers/SocketProvider";

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
}

// ✅ Hardcoded User ID - thay bằng ID thực tế của bạn
const CURRENT_USER_ID = "673145fe-04a3-4f6d-ad27-7694bc087fd4";

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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, isConnected, onlineUsers } = useSocketContext();

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

  // ✅ Listen for online/offline events to update specific conversations
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

      // Update active conversation if needed
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

      // Update active conversation if needed
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

  // ✅ Socket listener for real-time messages
  useEffect(() => {
    if (!socket) return;

    console.log("🎧 Listening for new messages...");

    const handleNewMessage = (data: any) => {
      console.log("💬 New message received:", data);

      // Chỉ thêm message nếu đúng conversation đang active
      if (
        activeConversation &&
        data.conversation.id === activeConversation.id
      ) {
        const transformedMessage: Message = {
          id: data.message.id,
          text: data.message.text,
          sender: data.message.sender === "user" ? "friend" : "user",
          timestamp: data.message.timestamp,
          senderName: data.message.senderName,
          avatar: data.conversation.avatar || undefined,
        };

        setListMessagesConversation((prev) => [...prev, transformedMessage]);
      }

      // Cập nhật conversation list
      setListConversation((prev) =>
        prev.map((conv) =>
          conv.id === data.conversation.id
            ? {
                ...conv,
                lastMessage: data.message.text,
                timestamp: data.message.timestamp,
                unread: activeConversation?.id !== data.conversation.id,
              }
            : conv
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, activeConversation]);

  // ✅ Load conversations on mount
  useEffect(() => {
    getListConversation();
  }, []);

  // ✅ Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      getListMessageConversation(activeConversation.id);
    }
  }, [activeConversation]);

  // ✅ Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [listMessagesConversations]);

  const getListConversation = async () => {
    try {
      const res = await chatService.getConversation(CURRENT_USER_ID);
      console.log("✅ Conversations loaded:", res);
      if (res) {
        setListConversation(res);
        // Set first conversation as active by default
        if (res.length > 0 && !activeConversation) {
          setActiveConversation(res[0]);
        }
      }
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
    }
  };

  const getListMessageConversation = async (conversationId: string) => {
    try {
      const res = await chatService.getMessagesConversation(conversationId);
      console.log("✅ Messages loaded:", res?.messages);
      if (res) {
        setListMessagesConversation(res.messages || []);
      }
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    }
  };

  const filteredConversations = listConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || isSending) return;

    setIsSending(true);

    // Optimistic UI update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setListMessagesConversation((prev) => [...prev, optimisticMessage]);
    const messageText = newMessage;
    setNewMessage("");

    try {
      // ✅ Send message via API
      // const res = await chatService.sendMessage({
      //   senderId: CURRENT_USER_ID,
      //   receiverId: activeConversation.receiverId || "",
      //   content: messageText,
      //   conversationId: activeConversation.id,
      // });
      // console.log("✅ Message sent:", res);
      // // Update with real message data from server
      // setListMessagesConversation((prev) =>
      //   prev.map((msg) =>
      //     msg.id === optimisticMessage.id
      //       ? {
      //           ...msg,
      //           id: res.message.id,
      //           timestamp: res.message.timestamp,
      //         }
      //       : msg
      //   )
      // );
      // // Update conversation list
      // setListConversation((prev) =>
      //   prev.map((conv) =>
      //     conv.id === activeConversation.id
      //       ? {
      //           ...conv,
      //           lastMessage: messageText,
      //           timestamp: res.message.timestamp,
      //         }
      //       : conv
      //   )
      // );
    } catch (error) {
      console.error("❌ Error sending message:", error);
      // Remove optimistic message on error
      setListMessagesConversation((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      setNewMessage(messageText); // Restore message text
    } finally {
      setIsSending(false);
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
    // Mark as read
    setListConversation((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv
      )
    );
  };

  return (
    <div className="bg-white fixed inset-0 z-50 flex overflow-x-hidden overflow-y-hidden">
      {/* Left Sidebar - Conversations */}
      <div className="w-[400px] bg-white border-r flex flex-col min-h-0">
        {/* Message Header */}
        <div className="p-2 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Tin nhắn</h2>
          </div>

          {/* Search Input */}
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

        {/* Conversation List */}
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

                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col",
                        message.sender === "user" ? "items-end" : "items-start"
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
                                    message.avatar || activeConversation.avatar
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

                        <div
                          className={cn(
                            "px-3 py-2 break-words overflow-wrap-anywhere",
                            message.sender === "user"
                              ? "bg-blue-600 text-white rounded-[18px] shadow-sm"
                              : "bg-white text-gray-900 rounded-[18px] shadow-sm border border-gray-200"
                          )}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.text}
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "mt-1 px-3",
                          message.sender === "user" ? "mr-0" : "ml-10"
                        )}
                      >
                        <span className="text-[11px] text-gray-500">
                          {message.timestamp}
                        </span>
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
                    disabled={isSending}
                    className="bg-gray-100 border-0 text-gray-900 placeholder-gray-500 rounded-full pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[40px]"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:bg-gray-200 w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newMessage.trim() || isSending}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chọn cuộc trò chuyện
              </h3>
              <p className="text-gray-600">
                Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
