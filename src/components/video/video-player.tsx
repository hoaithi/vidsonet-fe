// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import {
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   SkipForward,
//   Settings,
//   Loader
// } from 'lucide-react';
// import { Slider } from '@/components/ui/slider';
// import { formatTime } from '@/lib/utils';
// import { VideoProgressUpdateRequest } from '@/types/video';

// interface VideoPlayerProps {
//   videoUrl: string;
//   videoId: string;
//   onProgressUpdate?: (progress: VideoProgressUpdateRequest) => void;
//   initialProgress?: number;
//   autoPlay?: boolean;
// }

// export function VideoPlayer({
//   videoUrl,
//   videoId,
//   onProgressUpdate,
//   initialProgress = 0,
//   autoPlay = false
// }: VideoPlayerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const lastMouseMoveRef = useRef<number>(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [hasCompleted, setHasCompleted] = useState(false);

//   // Initialize player
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Set initial volume
//     video.volume = volume;

//     // Set initial progress if provided
//     if (initialProgress && initialProgress > 0) {
//       video.currentTime = initialProgress;
//     }

//     // Update duration when metadata is loaded
//     const handleLoadedMetadata = () => {
//       setDuration(video.duration);
//       setIsLoading(false);

//       // Only autoplay if explicitly enabled via prop
//       if (autoPlay) {
//         video.play().then(() => {
//           setIsPlaying(true);
//         }).catch(() => {
//           // Autoplay failed (probably due to browser policy)
//           setIsPlaying(false);
//           console.log("Autoplay prevented by browser policy");
//         });
//       }
//     };

//     // Update time display
//     const handleTimeUpdate = () => {
//       setCurrentTime(video.currentTime);

//       // Check if video is completed (watched more than 90%)
//       if (!hasCompleted && video.duration > 0 && (video.currentTime / video.duration >= 0.9)) {
//         setHasCompleted(true);
//       }
//     };

//     // Handle play state changes
//     const handlePlay = () => {
//       setIsPlaying(true);
//     };

//     const handlePause = () => {
//         setIsPlaying(false);
//         // Keep controls visible when paused for easier interaction
//         setShowControls(true);
//     };

//     // Handle video ended
//     const handleEnded = () => {
//       setIsPlaying(false);
//       setHasCompleted(true);

//       // Update progress as completed when video ends
//       if (onProgressUpdate) {
//         onProgressUpdate({
//           currentTime: 0, // Reset to 0 since video is completed
//           duration: Math.floor(video.duration),
//           isCompleted: true
//         });
//       }
//     };

//     // Handle buffering
//     const handleWaiting = () => {
//       setIsBuffering(true);
//     };

//     const handleCanPlay = () => {
//       setIsBuffering(false);
//     };

//     // Add event listeners
//     video.addEventListener('loadedmetadata', handleLoadedMetadata);
//     video.addEventListener('timeupdate', handleTimeUpdate);
//     video.addEventListener('play', handlePlay);
//     video.addEventListener('pause', handlePause);
//     video.addEventListener('ended', handleEnded);
//     video.addEventListener('waiting', handleWaiting);
//     video.addEventListener('canplay', handleCanPlay);

//     // Add click event listener to toggle play/pause
//     video.addEventListener('click', togglePlay);

//     // Clean up
//     return () => {
//       video.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       video.removeEventListener('timeupdate', handleTimeUpdate);
//       video.removeEventListener('play', handlePlay);
//       video.removeEventListener('pause', handlePause);
//       video.removeEventListener('ended', handleEnded);
//       video.removeEventListener('waiting', handleWaiting);
//       video.removeEventListener('canplay', handleCanPlay);
//       video.removeEventListener('click', togglePlay);
//     };
//   }, [videoUrl, initialProgress, autoPlay, volume, hasCompleted, onProgressUpdate]);

// const lastTimeRef = useRef(0);

// // Cập nhật ref mỗi khi video chạy
// useEffect(() => {
//   const video = videoRef.current;
//   if (!video) return;

//   const handleTimeUpdate = () => {
//     lastTimeRef.current = video.currentTime;
//     setCurrentTime(video.currentTime);

//     if (!hasCompleted && video.duration > 0 && video.currentTime / video.duration >= 0.9) {
//       setHasCompleted(true);
//     }
//   };

//   video.addEventListener("timeupdate", handleTimeUpdate);
//   return () => video.removeEventListener("timeupdate", handleTimeUpdate);
// }, [hasCompleted]);

//   // Update progress on component unmount or when video changes
//   useEffect(() => {
//   const handleBeforeUnload = () => {
//     if (videoRef.current && onProgressUpdate && duration > 0) {
//       const video = videoRef.current;
//       const lastTime = lastTimeRef.current;

//       if (hasCompleted || (lastTime / video.duration >= 0.9)) {
//         onProgressUpdate({
//           currentTime: 0,
//           duration: Math.floor(video.duration),
//           isCompleted: true,
//         });
//       } else if (lastTime > 0) {
//         onProgressUpdate({
//           currentTime: Math.floor(lastTime),
//           duration: Math.floor(video.duration),
//           isCompleted: false,
//         });
//       }
//     }
//   };

//   // Gọi khi user reload hoặc đóng tab
//   window.addEventListener("beforeunload", handleBeforeUnload);

//   return () => {
//     // Cleanup khi component unmount
//     handleBeforeUnload();
//     window.removeEventListener("beforeunload", handleBeforeUnload);
//   };
// }, [videoUrl, videoId, onProgressUpdate, duration, hasCompleted]);

//   // Toggle play/pause
//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (isPlaying) {
//       video.pause();
//     } else {
//       video.play().catch((error) => {
//         console.error('Error playing video:', error);
//       });
//     }

//   };

//   // Toggle mute
//   const toggleMute = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.muted = !isMuted;
//     setIsMuted(!isMuted);
//   };

//   // Handle volume change
//   const handleVolumeChange = (value: number[]) => {
//     const newVolume = value[0];
//     const video = videoRef.current;
//     if (!video) return;

//     video.volume = newVolume;
//     setVolume(newVolume);

//     if (newVolume === 0) {
//       setIsMuted(true);
//       video.muted = true;
//     } else if (isMuted) {
//       setIsMuted(false);
//       video.muted = false;
//     }
//   };

//   // Handle seeking
//   const handleSeek = (value: number[]) => {
//     const newTime = value[0];
//     const video = videoRef.current;
//     if (!video) return;

//     video.currentTime = newTime;
//     setCurrentTime(newTime);
//   };

//   // Toggle fullscreen
//   const toggleFullscreen = () => {
//     const container = containerRef.current;
//     if (!container) return;

//     if (!isFullscreen) {
//       if (container.requestFullscreen) {
//         container.requestFullscreen();
//       }
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   };

//   // Listen for fullscreen changes
//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       setIsFullscreen(!!document.fullscreenElement);
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//     };
//   }, []);

//   // Handle controls visibility (throttled for mousemove, immediate on enter/leave)
//   const showControlsTemporarily = () => {
//     const now = Date.now();
//     // Throttle updates to prevent flicker on rapid mouse movements
//     if (now - lastMouseMoveRef.current < 100) {
//       return;
//     }
//     lastMouseMoveRef.current = now;

//     if (!showControls) {
//       setShowControls(true);
//     }

//     if (hideControlsTimeoutRef.current) {
//       clearTimeout(hideControlsTimeoutRef.current);
//       hideControlsTimeoutRef.current = null;
//     }

//     // Hide controls after 2 seconds of inactivity while playing
//     hideControlsTimeoutRef.current = setTimeout(() => {
//       if (isPlaying) {
//         setShowControls(false);
//       }
//     }, 2000);
//   };

//   // Add mouse move event listener to show controls
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     const handleMouseMove = () => {
//       showControlsTemporarily();
//     };

//     container.addEventListener('mousemove', handleMouseMove);
//     container.addEventListener('mouseenter', () => {
//       // Always show immediately on mouse enter
//       if (hideControlsTimeoutRef.current) {
//         clearTimeout(hideControlsTimeoutRef.current);
//         hideControlsTimeoutRef.current = null;
//       }
//       setShowControls(true);
//     });
//     container.addEventListener('mouseleave', () => {
//       // Always hide immediately on mouse leave
//       if (hideControlsTimeoutRef.current) {
//         clearTimeout(hideControlsTimeoutRef.current);
//         hideControlsTimeoutRef.current = null;
//       }
//       setShowControls(false);
//     });

//     return () => {
//       container.removeEventListener('mousemove', handleMouseMove);
//       container.removeEventListener('mouseenter', () => {});
//       container.removeEventListener('mouseleave', () => {});
//     };
//   }, [isPlaying]);

//   // Clean up timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (hideControlsTimeoutRef.current) {
//         clearTimeout(hideControlsTimeoutRef.current);
//         hideControlsTimeoutRef.current = null;
//       }
//     };
//   }, []);

//   // Skip forward 10 seconds
//   const skipForward = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.currentTime = Math.min(video.currentTime + 10, video.duration);
//   };

//   // Change playback rate
//   const changePlaybackRate = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Cycle through rates: 1.0, 1.25, 1.5, 1.75, 2.0, 0.5, 0.75
//     const rates = [1.0, 1.25, 1.5, 1.75, 2.0, 0.5, 0.75];
//     const currentIndex = rates.indexOf(playbackRate);
//     const nextIndex = (currentIndex + 1) % rates.length;
//     const newRate = rates[nextIndex];

//     video.playbackRate = newRate;
//     setPlaybackRate(newRate);
//   };

//   // Handle video click to toggle play/pause
//   const handleVideoClick = (e: React.MouseEvent) => {
//     // Prevent event bubbling to avoid duplicate toggles
//     e.stopPropagation();
//     togglePlay();
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full group aspect-video bg-black rounded-lg overflow-hidden"
//       onMouseMove={showControlsTemporarily}
//       onClick={handleVideoClick}
//     >
//       {/* Video element with click handler */}
//       <video
//         ref={videoRef}
//         src={videoUrl}
//         className="w-full h-full object-contain cursor-pointer"
//         playsInline
//         onClick={handleVideoClick}
//       />

//       {/* Loading overlay */}
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//           <Loader className="w-12 h-12 animate-spin text-primary" />
//         </div>
//       )}

//       {/* Buffering indicator */}
//       {isBuffering && !isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//           <Loader className="w-10 h-10 animate-spin text-primary" />
//         </div>
//       )}

//       {/* Video controls */}
//       <div
//         className={`absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-200 ${
//           showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         {/* Progress bar */}
//         <div className="w-full mb-2 pointer-events-auto">
//           <Slider
//             value={[currentTime]}
//             min={0}
//             max={duration || 100}
//             step={0.1}
//             onValueChange={handleSeek}
//             className="cursor-pointer"
//           />
//         </div>

//         {/* Controls row */}
//         <div className="flex items-center justify-between pointer-events-auto">
//           <div className="flex items-center gap-2">
//             {/* Play/Pause button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 togglePlay();
//               }}
//               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
//             >
//               {isPlaying ? (
//                 <Pause className="w-5 h-5 text-white" />
//               ) : (
//                 <Play className="w-5 h-5 text-white" />
//               )}
//             </button>

//             {/* Skip forward button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 skipForward();
//               }}
//               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
//             >
//               <SkipForward className="w-5 h-5 text-white" />
//             </button>

//             {/* Volume control */}
//             <div className="flex items-center">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleMute();
//                 }}
//                 className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
//               >
//                 {isMuted || volume === 0 ? (
//                   <VolumeX className="w-5 h-5 text-white" />
//                 ) : (
//                   <Volume2 className="w-5 h-5 text-white" />
//                 )}
//               </button>

//               <div className="w-20 hidden sm:block">
//                 <Slider
//                   value={[isMuted ? 0 : volume]}
//                   min={0}
//                   max={1}
//                   step={0.01}
//                   onValueChange={handleVolumeChange}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               </div>
//             </div>

//             {/* Time display */}
//             <div className="text-white text-xs ml-2">
//               <span>{formatTime(currentTime)}</span>
//               <span className="mx-1">/</span>
//               <span>{formatTime(duration)}</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Playback rate button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 changePlaybackRate();
//               }}
//               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
//             >
//               <span className="text-white text-xs font-medium">{playbackRate}x</span>
//             </button>

//             {/* Settings button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 // Add settings menu functionality here
//               }}
//               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
//             >
//               <Settings className="w-5 h-5 text-white" />
//             </button>

//             {/* Fullscreen button */}
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleFullscreen();
//               }}
//               className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
//             >
//               <Maximize className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VideoPlayer;

"use client";

import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  Settings,
  Loader,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/utils";
import { VideoProgressUpdateRequest } from "@/types/video";
import { VideoService } from "@/services/video-service";

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string;
  onProgressUpdate?: (progress: VideoProgressUpdateRequest) => void;
  initialProgress?: number;
  autoPlay?: boolean;
}

// 🎯 Helper function
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function VideoPlayer({
  videoUrl,
  videoId,
  onProgressUpdate,
  initialProgress = 0,
  autoPlay = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMouseMoveRef = useRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const lastTimeRef = useRef(0);

  // 🎯 VIEW TRACKING STATE - Use useRef instead of useState to avoid dependency issues
  const viewTrackingRef = useRef({
    sessionId: generateSessionId(),
    actualWatchTime: 0,
    lastCheckTime: 0,
    hasInteracted: false,
    isValidView: false,
    lastReportedProgress: 0,
  });

  // For UI display only
  const [displayWatchTime, setDisplayWatchTime] = useState(0);
  const [displayIsValidView, setDisplayIsValidView] = useState(false);

  console.log(
    "🎬 VideoPlayer mounted - Session ID:",
    viewTrackingRef.current.sessionId
  );

  // 🎯 EXPOSE handleInteraction globally
  useEffect(() => {
    const handleInteraction = () => {
      if (viewTrackingRef.current.isValidView) {
        console.log("✅ Valid view already counted");
        return;
      }

      console.log("🎯 User interacted - counting valid view immediately");

      VideoService.markInteraction(videoId, viewTrackingRef.current.sessionId)
        .then(() => {
          console.log("✅ Interaction marked, valid view counted");
          viewTrackingRef.current.hasInteracted = true;
          viewTrackingRef.current.isValidView = true;
          setDisplayIsValidView(true);
        })
        .catch((error) => {
          console.error("❌ Error marking interaction:", error);
        });
    };

    (window as any).__videoPlayerInteraction = handleInteraction;
    console.log("✅ Interaction handler exposed globally");

    return () => {
      delete (window as any).__videoPlayerInteraction;
    };
  }, [videoId]);

  // 🎯 Track ACTUAL watch time (only when video is playing)
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused || !duration) return;

      // ✅ Direct mutation - no re-render
      viewTrackingRef.current.actualWatchTime += 1;
      viewTrackingRef.current.lastCheckTime = video.currentTime;

      // Update display
      setDisplayWatchTime(viewTrackingRef.current.actualWatchTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  // 🎯 VIEW TRACKING LOGIC - Report every 5 seconds
  useEffect(() => {
    console.log("🔄 Starting view tracking interval");

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused || !duration) return;

      const tracking = viewTrackingRef.current;
      const watchPercentage = (video.currentTime / duration) * 100;
      const minWatchTime = Math.min(30, duration * 0.3);

      // ✅ FIX: ONLY check actualWatchTime (remove percentage check to prevent skip abuse)
      const isValid = tracking.actualWatchTime >= minWatchTime;

      console.log(
        `⏱️ Actual watch time: ${tracking.actualWatchTime.toFixed(
          1
        )}s / ${duration.toFixed(
          1
        )}s (current position: ${watchPercentage.toFixed(1)}%)`
      );

      // 🎯 Record valid view when threshold is reached
      if (isValid && !tracking.isValidView) {
        console.log("✅ Valid view threshold reached!");

        VideoService.recordValidView(videoId, {
          sessionId: tracking.sessionId,
          watchDuration: tracking.actualWatchTime,
          watchPercentage: watchPercentage,
          hasInteracted: tracking.hasInteracted,
        })
          .then(() => {
            console.log("✅ Valid view recorded successfully");
            viewTrackingRef.current.isValidView = true;
            setDisplayIsValidView(true);
          })
          .catch((error) => {
            console.error("❌ Error recording valid view:", error);
          });
      }

      // 📊 Update progress every 10%
      const progress = Math.floor(watchPercentage);
      if (progress - tracking.lastReportedProgress >= 10) {
        console.log(`📊 Progress update: ${progress}%`);

        VideoService.updateViewProgress(videoId, {
          sessionId: tracking.sessionId,
          watchDuration: tracking.actualWatchTime,
          watchPercentage: progress,
        });

        viewTrackingRef.current.lastReportedProgress = progress;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [videoId, duration]); // ✅ Stable dependencies only

  // Initialize player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;

    if (initialProgress && initialProgress > 0) {
      video.currentTime = initialProgress;
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      console.log(
        "📹 Video loaded - Duration:",
        video.duration.toFixed(2) + "s"
      );

      if (autoPlay) {
        video
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
            console.log("Autoplay prevented by browser policy");
          });
      }
    };

    const handleTimeUpdate = () => {
      lastTimeRef.current = video.currentTime;
      setCurrentTime(video.currentTime);

      if (
        !hasCompleted &&
        video.duration > 0 &&
        video.currentTime / video.duration >= 0.9
      ) {
        setHasCompleted(true);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasCompleted(true);

      if (onProgressUpdate) {
        onProgressUpdate({
          currentTime: 0,
          duration: Math.floor(video.duration),
          isCompleted: true,
        });
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [
    videoUrl,
    initialProgress,
    autoPlay,
    volume,
    hasCompleted,
    onProgressUpdate,
  ]);

  // Update progress on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (videoRef.current && onProgressUpdate && duration > 0) {
        const video = videoRef.current;
        const lastTime = lastTimeRef.current;

        if (hasCompleted || lastTime / video.duration >= 0.9) {
          onProgressUpdate({
            currentTime: 0,
            duration: Math.floor(video.duration),
            isCompleted: true,
          });
        } else if (lastTime > 0) {
          onProgressUpdate({
            currentTime: Math.floor(lastTime),
            duration: Math.floor(video.duration),
            isCompleted: false,
          });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [videoUrl, videoId, onProgressUpdate, duration, hasCompleted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const showControlsTemporarily = () => {
    const now = Date.now();
    if (now - lastMouseMoveRef.current < 100) {
      return;
    }
    lastMouseMoveRef.current = now;

    if (!showControls) {
      setShowControls(true);
    }

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
      hideControlsTimeoutRef.current = null;
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => {
      showControlsTemporarily();
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
      setShowControls(true);
    });
    container.addEventListener("mouseleave", () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
      setShowControls(false);
    });

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
        hideControlsTimeoutRef.current = null;
      }
    };
  }, []);

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };

  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;

    const rates = [1.0, 1.25, 1.5, 1.75, 2.0, 0.5, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];

    video.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full group aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={showControlsTemporarily}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
        onClick={handleVideoClick}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      )}

      {isBuffering && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      <div
        className={`absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-200 ${
          showControls
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full mb-2 pointer-events-auto">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                skipForward();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="w-20 hidden sm:block">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="text-white text-xs ml-2">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>

           
            {/* {duration > 0 && (
              <div className="ml-4 text-xs">
                {displayIsValidView ? (
                  <span className="text-green-400">✅ View Counted</span>
                ) : (
                  <span className="text-yellow-400">
                    ⏱️{" "}
                    {Math.ceil(
                      Math.max(
                        0,
                        Math.min(30, duration * 0.3) - displayWatchTime
                      )
                    )}
                    s more (watched: {displayWatchTime}s)
                  </span>
                )}
              </div>
            )} */}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                changePlaybackRate();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <span className="text-white text-xs font-medium">
                {playbackRate}x
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
