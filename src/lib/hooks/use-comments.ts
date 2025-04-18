import { useState } from 'react';
import { toast } from 'sonner';
import {VideoService} from '@/services/video-service';
import CommentService from '@/services/comment-service';
import { CommentCreateRequest, CommentUpdateRequest } from '@/types/video';

export const useComments = (videoId?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  // Get video comments
  const getVideoComments = async (id: number = videoId || 0) => {
    setIsLoading(true);
    
    try {
      const response = await VideoService.getVideoComments(id);
      
      if (response.data) {
        setComments(response.data);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get video comments error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load comments. Please try again.'
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add comment to video
  const addComment = async (data: CommentCreateRequest) => {
    setIsLoading(true);
    
    try {
      const response = await VideoService.addComment(data.videoId, data);
      
      if (response.data) {
        // Update comments list
        setComments((prev) => [response.data, ...prev]);
      }
      
      toast.success('Comment added successfully');
      return response.data;
    } catch (error: any) {
      console.error('Add comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to add comment. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get comment replies
  const getCommentReplies = async (commentId: number) => {
    try {
      const response = await CommentService.getCommentReplies(commentId);
      return response.data;
    } catch (error: any) {
      console.error('Get comment replies error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load replies. Please try again.'
      );
      return [];
    }
  };

  // Reply to comment
  const replyToComment = async (commentId: number, content: string) => {
    setIsLoading(true);
    
    try {
      const response = await CommentService.replyToComment(commentId, content);
      
      if (response.data) {
        // Update comments list by adding reply to the parent comment
        setComments((prev) => 
          prev.map((comment) => {
            if (comment.id === commentId) {
              // If replies array doesn't exist, create it
              const replies = comment.replies || [];
              return {
                ...comment,
                replies: [...replies, response.data]
              };
            }
            return comment;
          })
        );
      }
      
      toast.success('Reply added successfully');
      return response.data;
    } catch (error: any) {
      console.error('Reply to comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to add reply. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update comment
  const updateComment = async (commentId: number, data: CommentUpdateRequest) => {
    setIsLoading(true);
    
    try {
      const response = await CommentService.updateComment(commentId, data);
      
      // Update comments list
      if (response.data) {
        setComments((prev) => 
          prev.map((comment) => {
            if (comment.id === commentId) {
              return response.data;
            }
            // Check if the comment is in replies of another comment
            if (comment.replies) {
              const updatedReplies = comment.replies.map((reply: any) => 
                reply.id === commentId ? response.data : reply
              );
              return {
                ...comment,
                replies: updatedReplies
              };
            }
            return comment;
          })
        );
      }
      
      toast.success('Comment updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('Update comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to update comment. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete comment
  const deleteComment = async (commentId: number) => {
    setIsLoading(true);
    
    try {
      await CommentService.deleteComment(commentId);
      
      // Update comments list by removing the deleted comment
      setComments((prev) => {
        // First, check if it's a top-level comment
        const newComments = prev.filter((comment) => comment.id !== commentId);
        
        // If counts match, it wasn't a top-level comment, so check replies
        if (newComments.length === prev.length) {
          return prev.map((comment) => {
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.filter((reply: any) => reply.id !== commentId)
              };
            }
            return comment;
          });
        }
        
        return newComments;
      });
      
      toast.success('Comment deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Delete comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to delete comment. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Heart comment
  const heartComment = async (commentId: number) => {
    try {
      const response = await CommentService.heartComment(commentId);
      
      // Update comments list
      if (response.data) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return response.data;
            }
            // Check if the comment is in replies of another comment
            if (comment.replies) {
              const updatedReplies = comment.replies.map((reply: any) => 
                reply.id === commentId ? response.data : reply
              );
              return {
                ...comment,
                replies: updatedReplies
              };
            }
            return comment;
          })
        );
      }
      
      toast.success('Comment hearted');
      return response.data;
    } catch (error: any) {
      console.error('Heart comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to heart comment. Please try again.'
      );
      return null;
    }
  };

  // Unheart comment
  const unheartComment = async (commentId: number) => {
    try {
      const response = await CommentService.unheartComment(commentId);
      
      // Update comments list
      if (response.data) {
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return response.data;
            }
            // Check if the comment is in replies of another comment
            if (comment.replies) {
              const updatedReplies = comment.replies.map((reply: any) => 
                reply.id === commentId ? response.data : reply
              );
              return {
                ...comment,
                replies: updatedReplies
              };
            }
            return comment;
          })
        );
      }
      
      toast.success('Comment unhearted');
      return response.data;
    } catch (error: any) {
      console.error('Unheart comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to unheart comment. Please try again.'
      );
      return null;
    }
  };

  // Pin comment
  const pinComment = async (commentId: number) => {
    try {
      const response = await CommentService.pinComment(commentId);
      
      // Update comments list
      if (response.data) {
        // First, unpin all other comments
        const updatedComments = comments.map((comment) => ({
          ...comment,
          isPinned: false,
        }));
        
        // Then, pin the selected comment
        setComments(
          updatedComments.map((comment) =>
            comment.id === commentId ? response.data : comment
          )
        );
      }
      
      toast.success('Comment pinned successfully');
      return response.data;
    } catch (error: any) {
      console.error('Pin comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to pin comment. Please try again.'
      );
      return null;
    }
  };

  // Unpin comment
  const unpinComment = async (commentId: number) => {
    try {
      const response = await CommentService.unpinComment(commentId);
      
      // Update comments list
      if (response.data) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? response.data : comment
          )
        );
      }
      
      toast.success('Comment unpinned successfully');
      return response.data;
    } catch (error: any) {
      console.error('Unpin comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to unpin comment. Please try again.'
      );
      return null;
    }
  };

  return {
    isLoading,
    comments,
    getVideoComments,
    addComment,
    getCommentReplies,
    replyToComment,
    updateComment,
    deleteComment,
    heartComment,
    unheartComment,
    pinComment,
    unpinComment,
  };
};