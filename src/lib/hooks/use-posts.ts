import { useState } from 'react';
import { toast } from 'sonner';
import PostService from '@/services/post-service';
import { Post, PostCreateRequest, PostUpdateRequest, PostComment, PostCommentCreateRequest, PostCommentUpdateRequest } from '@/types/post';

export const usePosts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  // Create a new post
  const createPost = async (data: PostCreateRequest) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.createPost(data);
      
      if (response.result) {
        setPosts(prev => [response.result!, ...prev]);
        toast.success('Post created successfully');
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Create post error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to create post. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get post by ID
  const getPost = async (id: string) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.getPostById(id);
      
      if (response.result) {
        setCurrentPost(response.result);
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Get post error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load post. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get posts by user ID
  const getPostsByUserId = async (userId: string, page: number = 0, size: number = 10) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.getPostsByUserId(userId, page, size);
      
      if (response.result) {
        if (page === 0) {
          setPosts(response.result.content);
        } else {
          setPosts(prev => [...prev, ...response.result!.content]);
        }
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Get posts error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load posts. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update post
  const updatePost = async (id: string, data: PostUpdateRequest) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.updatePost(id, data);
      
      if (response.result) {
        setPosts(prev => prev.map(post => 
          post.id === id ? response.result! : post
        ));
        
        if (currentPost && currentPost.id === id) {
          setCurrentPost(response.result);
        }
        
        toast.success('Post updated successfully');
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Update post error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to update post. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    setIsLoading(true);
    
    try {
      await PostService.deletePost(id);
      
      setPosts(prev => prev.filter(post => post.id !== id));
      
      if (currentPost && currentPost.id === id) {
        setCurrentPost(null);
      }
      
      toast.success('Post deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Delete post error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to delete post. Please try again.'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Like post
  const likePost = async (id: string) => {
    try {
      const response = await PostService.likePost(id);
      
      if (response.result) {
        setPosts(prev => prev.map(post => 
          post.id === id ? response.result! : post
        ));
        
        if (currentPost && currentPost.id === id) {
          setCurrentPost(response.result);
        }
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Like post error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to like post. Please try again.'
      );
      return null;
    }
  };

  // Dislike post
  const dislikePost = async (id: string) => {
    try {
      const response = await PostService.dislikePost(id);
      
      if (response.result) {
        setPosts(prev => prev.map(post => 
          post.id === id ? response.result! : post
        ));
        
        if (currentPost && currentPost.id === id) {
          setCurrentPost(response.result);
        }
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Dislike post error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to dislike post. Please try again.'
      );
      return null;
    }
  };

  return {
    isLoading,
    posts,
    currentPost,
    createPost,
    getPost,
    getPostsByUserId,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
  };
};

export const usePostComments = (postId?: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);

  // Get post comments
  const getPostComments = async (id: number = postId || 0) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.getPostComments(id);
      
      if (response.result) {
        setComments(response.result);
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Get post comments error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load comments. Please try again.'
      );
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Create comment
  const createComment = async (data: PostCommentCreateRequest) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.createComment(data);
      
      if (response.result) {
        setComments(prev => [response.result!, ...prev]);
        toast.success('Comment added successfully');
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Create comment error:', error);
      
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
      const response = await PostService.getCommentReplies(commentId);
      return response.result;
    } catch (error: any) {
      console.error('Get comment replies error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to load replies. Please try again.'
      );
      return [];
    }
  };

  // Update comment
  const updateComment = async (commentId: number, data: PostCommentUpdateRequest) => {
    setIsLoading(true);
    
    try {
      const response = await PostService.updateComment(commentId, data);
      
      if (response.result) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? response.result! : comment
        ));
        
        toast.success('Comment updated successfully');
      }
      
      return response.result;
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
      await PostService.deleteComment(commentId);
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      
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
      const response = await PostService.heartComment(commentId);
      
      if (response.result) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? response.result! : comment
        ));
        
        toast.success('Comment hearted');
      }
      
      return response.result;
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
      const response = await PostService.unheartComment(commentId);
      
      if (response.result) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? response.result! : comment
        ));
        
        toast.success('Comment unhearted');
      }
      
      return response.result;
    } catch (error: any) {
      console.error('Unheart comment error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to unheart comment. Please try again.'
      );
      return null;
    }
  };

  return {
    isLoading,
    comments,
    getPostComments,
    createComment,
    getCommentReplies,
    updateComment,
    deleteComment,
    heartComment,
    unheartComment,
  };
};