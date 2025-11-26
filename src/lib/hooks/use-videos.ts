import { useState } from 'react';
import { toast } from 'sonner';
import { useVideoStore } from '@/store/video-store';
import { VideoService } from '@/services/video-service';
import { VideoSearchRequest, VideoUpload, VideoUpdateRequest, VideoProgressUpdateRequest } from '@/types/video';
import { UserReactionStatus } from '@/types/video';
export const useVideos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const { setCurrentVideo, setLoading } = useVideoStore();

  // Search videos
  const searchVideos = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'publishedAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ) => {
    setIsLoading(true);

    try {
      const response = await VideoService.searchVideos({}, page, size, sortBy, sortDir);
      setSearchResults(response.result);
      return response.result;
    } catch (error: any) {
      console.error('Search videos error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to search videos. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload video
  const uploadVideo = async (data: VideoUpload) => {
    setIsLoading(true);

    try {
      const response = await VideoService.uploadVideo(data);

      toast.success('Video uploaded successfully');
      return response.result;
    } catch (error: any) {
      console.error('Upload video error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to upload video. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get video details
  const getVideo = async (id: string) => {
    setLoading(true);

    try {
      const response = await VideoService.getVideoById(id);

      if (response.result) {
        setCurrentVideo(response.result);
      }

      return response.result;
    } catch (error: any) {
      console.error('Get video error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load video. Please try again.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update video progress
  const updateVideoProgress = async (id: string, data: VideoProgressUpdateRequest) => {
    try {
      await VideoService.updateVideoProgress(id, data);
    } catch (error: any) {
      console.error('Update video progress error:', error);
      // Silent error - don't show toast for this operation
    }
  };

  // Like video
  const likeVideo = async (id: string) => {
    try {
      const response = await VideoService.likeVideo(id);

      if (response.result) {
        setCurrentVideo(response.result);
      }

      return response.result;
    } catch (error: any) {
      console.error('Like video error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to like video. Please try again.'
      );
      return null;
    }
  };

  // Dislike video
  const dislikeVideo = async (id: string) => {
    try {
      const response = await VideoService.dislikeVideo(id);

      if (response.result) {
        setCurrentVideo(response.result);
      }

      return response.result;
    } catch (error: any) {
      console.error('Dislike video error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to dislike video. Please try again.'
      );
      return null;
    }
  };

  // Add to watch later
  const addToWatchLater = async (id: string) => {
    try {
      await VideoService.addToWatchLater(id);

      toast.success('Added to Watch Later');
      return true;
    } catch (error: any) {
      console.error('Add to watch later error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to add to Watch Later. Please try again.'
      );
      return false;
    }
  };

  // Get watch later videos
  const getWatchLaterVideos = async (
    page: number = 0,
    size: number = 12,
    sortBy: string = 'addedAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ) => {
    setIsLoading(true);

    try {
      const response = await VideoService.getWatchLaterVideos(page, size, sortBy, sortDir);
      return response.result;
    } catch (error: any) {
      console.error('Get watch later videos error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load Watch Later videos. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update video
  const updateVideo = async (id: string, data: VideoUpdateRequest) => {
    setIsLoading(true);

    try {
      const response = await VideoService.updateVideo(id, data);

      if (response.result) {
        setCurrentVideo(response.result);
      }

      toast.success('Video updated successfully');
      return response.result;
    } catch (error: any) {
      console.error('Update video error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to update video. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete video
  const deleteVideo = async (id: string) => {
    setIsLoading(true);

    try {
      await VideoService.deleteVideo(id);

      toast.success('Video deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Delete video error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to delete video. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  
  const [userReaction, setUserReaction] = useState<UserReactionStatus>({hasLiked:false,hasDisliked:false});
  const checkUserReaction = async (videoId: string, userId?: string) => {
      const response = await VideoService.getUserReaction(videoId, userId);
      if(response.result&&response.result.hasReacted){
        setUserReaction({
          hasLiked: response.result.reactionType === "LIKE",
          hasDisliked: response.result.reactionType === "DISLIKE"
        })
      }else{
        setUserReaction({
          hasDisliked:false,
          hasLiked:false
        })
      }

  }
  const resetUserReaction = () => {
    setUserReaction({
      hasDisliked:false,
      hasLiked: false
    })
  }

  return {
    isLoading,
    searchResults,
    userReaction,
    searchVideos,
    uploadVideo,
    getVideo,
    updateVideoProgress,
    likeVideo,
    dislikeVideo,
    addToWatchLater,
    getWatchLaterVideos,
    updateVideo,
    deleteVideo,
    checkUserReaction,
    resetUserReaction
  };
};