import { useState } from 'react';
import { toast } from 'sonner';
import PostService from '@/services/post-service';
import { Post, PostCreateRequest, PostUpdateRequest } from '@/types/post';

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

// Note: usePostComments has been removed in favor of the unified use-comments hook.