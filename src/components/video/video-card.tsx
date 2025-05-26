'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatViewCount, getRelativeTime, formatTime } from '@/lib/utils';
import { Video } from '@/types/video';
interface VideoCardProps {
  video: Video;
  showChannel?: boolean;
}

export function VideoCard({ video, showChannel = true }: VideoCardProps) {
  const router = useRouter();

  // Handle click on video card (excluding channel link area)
  const handleVideoClick = () => {
    router.push(`/video/${video.id}`);
  };

  return (
    <div className="group cursor-pointer">
      {/* Video thumbnail and title - clickable area for video */}
      <div onClick={handleVideoClick}>
        <div className="aspect-video relative rounded-lg overflow-hidden bg-muted/50">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <PlayCircle className="h-12 w-12 opacity-50" />
            </div>
          )}
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatTime(video.duration)}
          </div>
          
          {/* Premium badge */}
          {video.isPremium && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Premium
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-2 flex">
        {showChannel && (
          <div 
            className="mr-3 flex-shrink-0 cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/channel/${video.user.id}`);
            }}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={video.user.channelPicture || video.user.profilePicture || ''} alt={video.user.channelName || video.user.username} />
              <AvatarFallback>{(video.user.channelName || video.user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div onClick={handleVideoClick}>
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary cursor-pointer">
              {video.title}
            </h3>
          </div>
          
          {showChannel && (
            <div 
              className="block mt-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/channel/${video.user.id}`);
              }}
            >
              <p className="text-muted-foreground text-sm hover:text-foreground">
                {video.user.channelName || video.user.username}
              </p>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-1">
            <span>{formatViewCount(video.viewCount)}</span>
            <span className="mx-1">•</span>
            <span>{getRelativeTime(video.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;