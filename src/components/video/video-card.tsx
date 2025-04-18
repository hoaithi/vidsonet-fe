'use client';

import Link from 'next/link';
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
  return (
    <div className="group cursor-pointer">
      <Link href={`/video/${video.id}`} className="block">
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
      </Link>
      
      <div className="mt-2 flex">
        {showChannel && (
          <Link href={`/channel/${video.user.id}`} className="mr-3 flex-shrink-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src={video.user.channelPicture || video.user.profilePicture || ''} alt={video.user.channelName || video.user.username} />
              <AvatarFallback>{(video.user.channelName || video.user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <Link href={`/video/${video.id}`} className="block">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
              {video.title}
            </h3>
          </Link>
          
          {showChannel && (
            <Link href={`/channel/${video.user.id}`} className="block mt-1">
              <p className="text-muted-foreground text-sm">
                {video.user.channelName || video.user.username}
              </p>
            </Link>
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