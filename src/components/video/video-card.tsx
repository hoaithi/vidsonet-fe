// 'use client';

// import Link from 'next/link';
// import { PlayCircle } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { formatViewCount, getRelativeTime, formatTime } from '@/lib/utils';
// import { Video } from '@/types/video';

// interface VideoCardProps {
//   video: Video;
//   showChannel?: boolean;
// }

// export function VideoCard({ video, showChannel = true }: VideoCardProps) {
//   return (
//     <div className="group cursor-pointer">
//       <Link href={`/video/${video.id}`} className="block">
//         <div className="aspect-video relative rounded-lg overflow-hidden bg-muted/50">
//           {video.thumbnailUrl ? (
//             <img
//               src={video.thumbnailUrl}
//               alt={video.title}
//               className="object-cover w-full h-full transition-transform group-hover:scale-105"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-muted">
//               <PlayCircle className="h-12 w-12 opacity-50" />
//             </div>
//           )}
          
//           {/* Duration badge */}
//           <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
//             {formatTime(video.duration)}
//           </div>
          
//           {/* Premium badge */}
//           {video.isPremium  && (
//             <Badge variant="secondary" className="absolute top-2 left-2">
//               Premium
//             </Badge>
//           )}
//         </div>
//       </Link>
      
//       <div className="mt-2 flex">
//         {showChannel && (
//           <Link href={`/channel/${video.user.id}`} className="mr-3 flex-shrink-0">
//             <Avatar className="h-9 w-9">
//               <AvatarImage src={video.user.channelPicture || video.user.profilePicture || ''} alt={video.user.channelName || video.user.username} />
//               <AvatarFallback>{(video.user.channelName || video.user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
//             </Avatar>
//           </Link>
//         )}
        
//         <div className="flex-1 min-w-0">
//           <Link href={`/video/${video.id}`} className="block">
//             <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
//               {video.title}
//             </h3>
//           </Link>
          
//           {showChannel && (
//             <Link href={`/channel/${video.user.id}`} className="block mt-1">
//               <p className="text-muted-foreground text-sm">
//                 {video.user.channelName || video.user.username}
//               </p>
//             </Link>
//           )}
          
//           <div className="text-xs text-muted-foreground mt-1">
//             <span>{formatViewCount(video.viewCount)}</span>
//             <span className="mx-1">•</span>
//             <span>{getRelativeTime(video.publishedAt)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VideoCard;


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatViewCount, getRelativeTime, formatTime } from '@/lib/utils';
import { Video } from '@/types/video';
import { useAuthStore } from '@/store/auth-store';
import UserService from '@/services/user-service';

interface VideoCardProps {
  video: Video;
  showChannel?: boolean;
}

export function VideoCard({ video, showChannel = true }: VideoCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [canAccessPremium, setCanAccessPremium] = useState<boolean>(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(false);

  // Check if user can access premium content
  useEffect(() => {
    const checkPremiumAccess = async () => {
      if (!video.isPremium || !isAuthenticated) {
        return;
      }

      // Don't check access if user is the video owner
      if (user && video.user.id === user.id) {
        setCanAccessPremium(true);
        return;
      }

      setIsCheckingAccess(true);
      try {
        // Check if user has membership for this channel
        const response = await UserService.checkMembership(video.user.id);
        setCanAccessPremium(response.data || false);
      } catch (error) {
        console.error('Error checking membership:', error);
        setCanAccessPremium(false);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkPremiumAccess();
  }, [video.isPremium, video.user.id, isAuthenticated, user]);

  // Determine if video is blocked (premium and user can't access)
  const isBlocked = video.isPremium && !canAccessPremium;
  
  // Render card content
  const CardContent = () => (
    <>
      <div className="aspect-video relative rounded-lg overflow-hidden bg-muted/50">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`object-cover w-full h-full transition-transform ${
              !isBlocked ? 'group-hover:scale-105' : ''
            } ${isBlocked ? 'opacity-70' : ''}`}
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
          <Badge variant="secondary" className="absolute top-2 left-2 flex items-center gap-1">
            {isBlocked && <Lock className="h-3 w-3" />}
            Premium
          </Badge>
        )}

        {/* Premium overlay */}
        {isBlocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <Lock className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Members Only</p>
              <p className="text-sm mt-1">Subscribe to access this premium content</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2 flex">
        {showChannel && (
          <Link href={`/channel/${video.user.id}`} className="mr-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={video.user.channelPicture || video.user.profilePicture || ''} alt={video.user.channelName || video.user.username} />
              <AvatarFallback>{(video.user.channelName || video.user.username || 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-sm line-clamp-2 ${!isBlocked ? 'group-hover:text-primary' : ''}`}>
            {video.title}
          </h3>
          
          {showChannel && (
            <Link href={`/channel/${video.user.id}`} className="block mt-1" onClick={(e) => e.stopPropagation()}>
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
    </>
  );

  // If premium content is blocked, wrap in tooltip
  if (isBlocked) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="group cursor-pointer" 
            >
              <CardContent />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subscribe to {video.user.channelName || video.user.username} to watch this premium video</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Otherwise, normal link behavior
  return (
    <div className="group cursor-pointer">
      <Link href={`/video/${video.id}`} className="block">
        <CardContent />
      </Link>
    </div>
  );
}

export default VideoCard;