import { useState } from 'react';
import { toast } from 'sonner';
import { useVideoStore } from '@/store/video-store';
import { VideoService } from '@/services/video-service';
import { VideoSearchRequest, VideoUpload, VideoUpdateRequest, VideoProgressUpdateRequest } from '@/types/video';

export const useVideos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const { setCurrentVideo, setLoading } = useVideoStore();

  // Search videos
  const searchVideos = async (
    params: VideoSearchRequest,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'publishedAt',
    sortDir: 'asc' | 'desc' = 'desc'
  ) => {
    setIsLoading(true);

    try {
      const response = await VideoService.searchVideos(params, page, size, sortBy, sortDir);
      setSearchResults(response.data);
      return response.data;
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
      return response.data;
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
  const getVideo = async (id: number, userId?: number) => {
    setLoading(true);

    try {
      const response = await VideoService.getVideoById(id, userId);

      if (response.data) {
        setCurrentVideo(response.data);
      }

      return response.data;
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
  const updateVideoProgress = async (id: number, data: VideoProgressUpdateRequest) => {
    try {
      await VideoService.updateVideoProgress(id, data);
    } catch (error: any) {
      console.error('Update video progress error:', error);
      // Silent error - don't show toast for this operation
    }
  };

  // Like video
  const likeVideo = async (id: number) => {
    try {
      const response = await VideoService.likeVideo(id);

      if (response.data) {
        setCurrentVideo(response.data);
      }

      return response.data;
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
  const dislikeVideo = async (id: number) => {
    try {
      const response = await VideoService.dislikeVideo(id);

      if (response.data) {
        setCurrentVideo(response.data);
      }

      return response.data;
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
  const addToWatchLater = async (id: number) => {
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
      return response.data;
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
  const updateVideo = async (id: number, data: VideoUpdateRequest) => {
    setIsLoading(true);

    try {
      const response = await VideoService.updateVideo(id, data);

      if (response.data) {
        setCurrentVideo(response.data);
      }

      toast.success('Video updated successfully');
      return response.data;
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
  const deleteVideo = async (id: number) => {
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

  return {
    isLoading,
    searchResults,
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
  };
};