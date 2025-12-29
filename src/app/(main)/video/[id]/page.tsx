"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video/video-player";
import CommentList from "@/components/video/comment-list";
import { PremiumContentDialog } from "@/components/video/premium-content-dialog";
import { useAuthStore } from "@/store/auth-store";
import { useVideos } from "@/lib/hooks/use-videos";
import { useSubscription } from "@/lib/hooks/use-subscription";
import { formatViewCount, getRelativeTime } from "@/lib/utils";
import { VideoProgressUpdateRequest, Video } from "@/types/video";
import { VideoService } from "@/services/video-service";
import { VideoInfoActions } from "@/components/video/video-info-actions";
import { ChannelInfoSection } from "@/components/video/channel-info-section";
import { chatService } from "@/services/chat-service";
export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const { isAuthenticated, profile } = useAuthStore();
  const {
    getVideo,
    likeVideo,
    dislikeVideo,
    addToWatchLater,
    userReaction,
    checkUserReaction,
    resetUserReaction,
  } = useVideos();
  const {
    isSubscribed,
    subscriberCount,
    checkSubscription,
    getSubscriberCount,
    subscribeToChannel,
    unsubscribeFromChannel,
  } = useSubscription();

  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumChannelId, setPremiumChannelId] = useState<string>("");

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const hasCalledApi = useRef(false);
  // Thêm hàm để lấy hoặc tạo conversation
  const getOrCreateConversation = async (channelOwnerId: string) => {
    if (!isAuthenticated || !profile || !video) return null;

    setIsLoadingConversation(true);
    try {
      // Gọi chatService để tạo hoặc lấy conversation
      const conversation = await chatService.findOrCreateConversation(
        profile.id.toString(), // Current user ID
        channelOwnerId.toString(), // Channel owner ID
        {
          name: profile.fullName || "Unknown",
          avatar: profile.avatarUrl,
        },
        {
          name: video.profileName || "Unknown",
          avatar: video.profileImage,
        }
      );

      console.log("Created/Found conversation:", conversation);
      return conversation.id;
    } catch (error) {
      console.error("Error getting conversation:", error);
      toast.error("Không thể tạo cuộc hội thoại");
      return null;
    } finally {
      setIsLoadingConversation(false);
    }
  };

  // Fetch video data
  useEffect(() => {
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;
    const fetchVideo = async () => {
      setIsLoading(true);

      try {
        // Get the video details with user ID if logged in
        const profileId = isAuthenticated && profile ? profile.id : undefined;

        // Call VideoService directly instead of using hook
        const response = await getVideo(videoId);
        const videoData = response;

        resetUserReaction();

        if (videoData) {
          setVideo(videoData);
          console.log("videoData info:", videoData?.profileImage);
          console.log("video info:", video?.profileImage);

          // Check if user is the video owner
          if (isAuthenticated && profile && videoData.profileId === profileId) {
            setIsOwner(true);
          }
          // if(isAuthenticated && profile){
          //   await checkUserReaction(videoId, profile.id);
          // }

          // // Increment view count
          // await VideoService.incrementView(videoId, userId);

          // Check subscription status if not the owner
          if (isAuthenticated && !isOwner && videoData.profileId) {
            checkSubscription(videoData.profileId);
            getSubscriberCount(videoData.profileId);
          }

          // Load related videos from the same channel, excluding current video
          try {
            const relatedRes = await VideoService.getVideosByChannelId(
              videoData.profileId.toString(),
              0,
              6,
              "publishedAt",
              "desc"
            );
            if (relatedRes.result) {
              const items = relatedRes.result.content.filter(
                (v) => v.id !== videoId
              );
              setRelatedVideos(items);
            }
          } catch (err) {
            console.error("Failed to load related videos:", err);
          }
        }
      } catch (error: any) {
        console.error("Error fetching video:", error);
        console.log("Error response:", error.response?.data);

        // Check if it's a premium content error
        if (error.response?.data?.code === 4003) {
          // Extract channel ID from error response
          const channelId = error.response?.data?.data?.channelId || 0;
          console.log("Premium content detected, channelId:", channelId);
          setPremiumChannelId(channelId);
          setShowPremiumDialog(true);
        } else {
          toast.error("Failed to load video. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId, isAuthenticated, profile]);

  // Fetch user reaction state
  useEffect(() => {
    const fetchUserReaction = async () => {
      if (isAuthenticated && profile) {
        try {
          await checkUserReaction(videoId);
        } catch (error) {
          console.error("Error fetching user reaction:", error);
        }
      }
    };

    fetchUserReaction();
  }, [videoId, isAuthenticated, profile]);

  // Handle progress update
  const handleProgressUpdate = async (progress: VideoProgressUpdateRequest) => {
    if (!isAuthenticated || !video) return;

    try {
      await VideoService.updateVideoProgress(video.id, progress);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Handle delete video

  const handleDeleteVideo = async () => {
    if (!isAuthenticated || !video) {
      toast.error("You must be signed in to delete this video");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this video? this action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const success = await VideoService.deleteVideo(videoId);
      if (success) {
        router.push(`/channel/${video.profileId}`);
      }
    } catch (error) {
      // Error toasts are handled inside the hook
      console.error("Delete video failed:", error);
    }
  };

  // Handle like/dislike
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to like videos");
      return;
    }

    try {
      const response = await likeVideo(videoId);
      if (response) {
        setVideo(response);
        checkUserReaction(videoId);
      }
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to dislike videos");
      return;
    }

    try {
      const response = await dislikeVideo(videoId);
      if (response) {
        setVideo(response);
        checkUserReaction(videoId);
      }
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  // Handle watch later
  const handleWatchLater = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add videos to Watch Later");
      return;
    }

    try {
      await addToWatchLater(videoId);
    } catch (error) {
      console.error("Error adding to watch later:", error);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: video?.title || "Check out this video",
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast.success("Link copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
          toast.error("Failed to copy link");
        });
    }
  };

  // Handle subscribe/unsubscribe
  const handleSubscriptionToggle = async () => {
    if (!isAuthenticated || !video) {
      toast.error("Please sign in to subscribe");
      return;
    }
    try {
      if (isSubscribed) {
        await unsubscribeFromChannel(video.profileId);
      } else {
        await subscribeToChannel(video.profileId);
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  // Render error state if no video
  // Render error / locked video state
  // Render error / locked video state
  if (!video) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player Placeholder */}
          <div className="relative w-full aspect-video rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
            <div className="text-center space-y-6 p-8">
              <div className="inline-flex p-5 rounded-full bg-yellow-500/10">
                <svg
                  className="h-12 w-12 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-white">
                  Nội dung dành cho Thành viên
                </h1>
                <p className="text-slate-400 text-sm max-w-md">
                  Video này chỉ khả dụng với người dùng có gói{" "}
                  <span className="text-yellow-400 font-medium">
                    Membership
                  </span>
                </p>
              </div>

              <Button
                asChild
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <Link href="/">← Quay lại trang chủ</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Related Videos</h3>
          <p className="text-sm text-muted-foreground">
            No related videos available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Video Player */}
        <VideoPlayer
          videoUrl={video.videoUrl}
          videoId={video.id}
          initialProgress={video.currentProgress || 0}
          onProgressUpdate={handleProgressUpdate}
          autoPlay={true}
        />
        <VideoInfoActions
          video={video}
          userReaction={userReaction}
          isOwner={isOwner}
          onLike={handleLike}
          onDislike={handleDislike}
          onWatchLater={handleWatchLater}
          onShare={handleShare}
          onDeleteVideo={handleDeleteVideo}
        />

        {/* SỬA PHẦN NÀY */}
        <ChannelInfoSection
          channel={{
            id: video.profileId.toString(), // Dùng profileId từ video
            name: video.profileName || "Unknown Channel", // Dùng profileName từ video
            avatarUrl: video.profileImage, // Dùng profileImage từ video
            subscriberCount: subscriberCount, // Dùng subscriberCount từ state
          }}
          isSubscribed={isSubscribed}
          isLoading={isLoadingConversation}
          onToggleSubscribe={handleSubscriptionToggle}
          isOwner={isOwner}
          // Props cho chat
          currentUserId={profile?.id?.toString()} // Sửa từ userId thành id
          currentUserName={profile?.fullName}
          conversationId={conversationId || undefined}
          onRequestConversation={async () => {
            // Tạo conversation khi click nút chat
            const convId = await getOrCreateConversation(video.profileId);
            if (convId) {
              setConversationId(convId);
              return convId;
            }
            return null;
          }}
        />

        {/* Description */}
        {video.description && (
          <div className="whitespace-pre-line text-sm">{video.description}</div>
        )}

        {/* Comments */}
        <CommentList videoId={video.id} isVideoOwner={isOwner} />
      </div>

      {/* Related Videos */}
      <div className="space-y-4">
        <h3 className="font-medium">Related Videos</h3>

        {relatedVideos.length > 0 ? (
          <div className="space-y-4">
            {relatedVideos.map((relatedVideo) => (
              <Link
                key={relatedVideo.id}
                href={`/video/${relatedVideo.id}`}
                className="block"
              >
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-40 aspect-video rounded-md bg-muted overflow-hidden">
                    {relatedVideo.thumbnailUrl ? (
                      <img
                        src={relatedVideo.thumbnailUrl}
                        alt={relatedVideo.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedVideo.profileName}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>{formatViewCount(relatedVideo.viewCount)}</span>
                      <span className="mx-1">•</span>
                      <span>{getRelativeTime(relatedVideo.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No related videos found
          </p>
        )}
      </div>
    </div>
  );
}
