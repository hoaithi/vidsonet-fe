'use client';

import { Video } from '@/types/video';
import VideoCard from './video-card';

interface VideoGridProps {
  videos: Video[];
  showChannel?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function VideoGrid({ 
  videos,
  showChannel = true,
  columns = 3,
  className = ''
}: VideoGridProps) {
  // Handle empty state
  if (!videos || videos.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-muted-foreground">No videos found</p>
      </div>
    );
  }
  
  // Determine grid columns class based on prop
  const gridColumnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridColumnsClass} gap-4 md:gap-6 ${className}`}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          showChannel={showChannel}
        />
      ))}
    </div>
  );
}

export default VideoGrid;