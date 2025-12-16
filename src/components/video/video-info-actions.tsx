// components/video/video-info-actions.tsx
'use client';
import { ThumbsUp, ThumbsDown, Clock, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getRelativeTime } from "@/lib/utils";

export  function VideoInfoActions({
  video,
  userReaction,
  isOwner,
  onLike,
  onDislike,
  onWatchLater,
  onShare,
  onDeleteVideo,
}: any) {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold">{video.title}</h1>

      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
        <span>{video.viewCount} views</span> • <span>{getRelativeTime(video.publishedAt)}</span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onLike} className="flex items-center gap-1">
          <ThumbsUp className={`h-4 w-4 ${userReaction.hasLiked ? "fill-current" : ""}`} />
          {video.likeCount > 0 && <span>{video.likeCount}</span>}
        </Button>

        <Button variant="outline" size="sm" onClick={onDislike} className="flex items-center gap-1">
          <ThumbsDown className={`h-4 w-4 ${userReaction.hasDisliked ? "fill-current text-destructive" : ""}`} />
          {video.dislikeCount > 0 && <span>{video.dislikeCount}</span>}
        </Button>

        <Button variant="outline" size="sm" onClick={onWatchLater} className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Watch Later</span>
        </Button>

        <Button variant="outline" size="sm" onClick={onShare} className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={`/video/${video.id}/edit`}>Edit Video</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteVideo} className="text-destructive">
                Delete Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
