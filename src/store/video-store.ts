import { create } from 'zustand';
import { Video } from '@/types/video';

interface VideoState {
  currentVideo: Video | null;
  recentVideos: Video[];
  isLoading: boolean;
  
  // Actions
  setCurrentVideo: (video: Video) => void;
  clearCurrentVideo: () => void;
  addToRecentVideos: (video: Video) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useVideoStore = create<VideoState>()((set, get) => ({
  currentVideo: null,
  recentVideos: [],
  isLoading: false,
  
  setCurrentVideo: (video: Video) => {
    set({ currentVideo: video });
    
    // Also add to recent videos
    get().addToRecentVideos(video);
  },
  
  clearCurrentVideo: () => {
    set({ currentVideo: null });
  },
  
  addToRecentVideos: (video: Video) => {
    const { recentVideos } = get();
    
    // Check if video already exists in recent videos
    const existingIndex = recentVideos.findIndex((v) => v.id === video.id);
    
    if (existingIndex !== -1) {
      // Remove existing video
      recentVideos.splice(existingIndex, 1);
    }
    
    // Add video to the beginning of the array
    const newRecentVideos = [video, ...recentVideos.slice(0, 9)]; // Keep only 10 videos
    
    set({ recentVideos: newRecentVideos });
  },
  
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));