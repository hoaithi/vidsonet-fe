'use client';

import { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipForward, 
  Settings,
  Loader
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatTime } from '@/lib/utils';
import { VideoProgressUpdateRequest } from '@/types/video';

interface VideoPlayerProps {
  videoUrl: string;
  videoId: number;
  onProgressUpdate?: (progress: VideoProgressUpdateRequest) => void;
  initialProgress?: number;
  autoPlay?: boolean;
}

export function VideoPlayer({ 
  videoUrl, 
  videoId,
  onProgressUpdate,
  initialProgress = 0,
  autoPlay = false
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
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);

  // Initialize player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial volume
    video.volume = volume;
    
    // Set initial progress if provided
    if (initialProgress && initialProgress > 0) {
      video.currentTime = initialProgress;
    }

    // Update duration when metadata is loaded
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      
      // Auto play if enabled
      if (autoPlay) {
        video.play().catch(() => {
          // Auto play failed (probably due to browser policy)
          setIsPlaying(false);
        });
      }
    };

    // Update time display
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Update progress to backend every 5 seconds
      if (onProgressUpdate && video.currentTime - lastProgressUpdate >= 5) {
        onProgressUpdate({
          currentTime: Math.floor(video.currentTime),
          duration: Math.floor(video.duration),
          isCompleted: video.currentTime / video.duration >= 0.9 // Mark as completed if 90% watched
        });
        setLastProgressUpdate(video.currentTime);
      }
    };

    // Handle video ended
    const handleEnded = () => {
      setIsPlaying(false);
      
      // Update progress as completed
      if (onProgressUpdate) {
        onProgressUpdate({
          currentTime: Math.floor(video.duration),
          duration: Math.floor(video.duration),
          isCompleted: true
        });
      }
    };

    // Handle buffering
    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    // Clean up
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoUrl, initialProgress, autoPlay, onProgressUpdate, lastProgressUpdate, volume]);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }

    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle volume change
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

  // Handle seeking
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle fullscreen
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

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle controls visibility
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Hide controls after 3 seconds of inactivity
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  // Add mouse move event listener to show controls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => {
      showControlsTemporarily();
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, controlsTimeout]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Skip forward 10 seconds
  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  };

  // Change playback rate
  const changePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;

    // Cycle through rates: 1.0, 1.25, 1.5, 1.75, 2.0, 0.5, 0.75
    const rates = [1.0, 1.25, 1.5, 1.75, 2.0, 0.5, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    
    video.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full group aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={showControlsTemporarily}
      onClick={(e) => {
        // Toggle play/pause on container click, unless clicking on controls
        if (e.target === containerRef.current || e.target === videoRef.current) {
          togglePlay();
        }
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        playsInline
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      )}
      
      {/* Buffering indicator */}
      {isBuffering && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Loader className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}
      
      {/* Video controls */}
      <div 
        className={`absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div className="w-full mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>
        
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause button */}
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
            
            {/* Skip forward button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                skipForward();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>
            
            {/* Volume control */}
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
            
            {/* Time display */}
            <div className="text-white text-xs ml-2">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Playback rate button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                changePlaybackRate();
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <span className="text-white text-xs font-medium">{playbackRate}x</span>
            </button>
            
            {/* Settings button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Add settings menu functionality here
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            {/* Fullscreen button */}
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