"use client";import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2, MessageCircle } from "lucide-react";
import ChatDetailModal from "../chat-detail/ChatDetailModal";
import { useState } from "react";

interface ChannelInfoSectionProps {
  channel: {
    id: string;
    name: string;
    avatarUrl?: string;
    subscriberCount?: number;
  };
  isSubscribed: boolean;
  isLoading?: boolean;
  onToggleSubscribe: () => Promise<void>;
  isOwner?: boolean;
  // Props for chat
  currentUserId?: string;
  currentUserName?: string;
  conversationId?: string;

  apiBaseUrl?: string;
  onRequestConversation?: () => Promise<string | null>; // Thêm callback để lấy conversationId
}

export function ChannelInfoSection({
  channel,
  isSubscribed,
  isLoading = false,
  onToggleSubscribe,
  isOwner = false,
  currentUserId,
  currentUserName,
  conversationId: initialConversationId,

  onRequestConversation,
}: ChannelInfoSectionProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId || null
  );
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const handleOpenChat = async () => {
    console.log("Opening chat...", {
      currentUserId,
      currentUserName,
      conversationId,
      channelId: channel.id,
    });

    // Kiểm tra dữ liệu cần thiết
    if (!currentUserId || !currentUserName) {
      console.error("Missing user data:", { currentUserId, currentUserName });
      return;
    }

    // Nếu chưa có conversationId, tạo mới
    if (!conversationId && onRequestConversation) {
      setIsCreatingConversation(true);
      try {
        const newConversationId = await onRequestConversation();
        console.log("Created conversation:", newConversationId);

        if (newConversationId) {
          setConversationId(newConversationId);
          setIsChatOpen(true);
        } else {
          console.error("Failed to create conversation");
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
      } finally {
        setIsCreatingConversation(false);
      }
    } else if (conversationId) {
      // Nếu đã có conversationId, mở chat trực tiếp
      setIsChatOpen(true);
    } else {
      console.error("No conversation ID and no way to create one");
    }
  };

  // Disable nút nếu thiếu dữ liệu cần thiết hoặc đang tạo conversation
  const isChatDisabled =
    !currentUserId || !currentUserName || isOwner || isCreatingConversation;

  return (
    <>
      <div className="flex items-center justify-between border-b pb-4">
        {/* Thông tin kênh */}
        <div className="flex items-center gap-3">
          <Link href={`/profile/${channel.id}`}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={channel.avatarUrl || "/default-avatar.png"}
                alt={channel.name}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <div>
            <Link href={`/profile/${channel.id}`}>
              <p className="font-semibold hover:underline">{channel.name}</p>
            </Link>
            <p className="text-sm text-muted-foreground">
              {channel.subscriberCount ?? 0} subscribers
            </p>
          </div>
        </div>

        {/* Các nút bên phải */}
        <div className="flex items-center gap-2">
          {!isOwner && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenChat}
                disabled={isChatDisabled}
                className="flex items-center gap-2"
              >
                {isCreatingConversation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
                Nhắn tin
              </Button>

              <Button
                variant={isSubscribed ? "secondary" : "default"}
                size="sm"
                onClick={onToggleSubscribe}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Chat Modal - chỉ render khi có đủ dữ liệu */}
      {isChatOpen && currentUserId && currentUserName && conversationId && (
        <ChatDetailModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          conversationId={conversationId}
          otherUser={{
            id: channel.id,
            name: channel.name,
            avatarUrl: channel.avatarUrl,
          }}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
        />
      )}
    </>
  );
}
