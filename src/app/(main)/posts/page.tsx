'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PostCard from '@/components/post/post-card';
import PostForm from '@/components/post/post-form';
import { useAuthStore } from '@/store/auth-store';
import { usePosts } from '@/lib/hooks/use-posts';
import UserService from '@/services/user-service';
import { Post } from '@/types/post';
import { Subscription } from '@/types/user';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PostService from '@/services/post-service';

export default function PostsFeedPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const { createPost } = usePosts(); // Only use createPost from the hook
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionPosts, setSubscriptionPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]); // Separate state for user posts
  const [feedLoading, setFeedLoading] = useState(true);
  const [userPostsLoading, setUserPostsLoading] = useState(true);

  // Check if user has a channel
  const hasNoChannel = user && (!user.channelName || user.channelName.trim() === '');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch subscription posts
  useEffect(() => {
    const fetchSubscriptionPosts = async () => {
      if (!isAuthenticated) return;
      
      setFeedLoading(true);
      
      try {
        // Get user subscriptions
        const subscriptionsResponse = await UserService.getUserSubscriptions();
        if (subscriptionsResponse.data) {
          setSubscriptions(subscriptionsResponse.data);
          
          // Get channel IDs
          const channelIds = subscriptionsResponse.data.map(sub => sub.channel.id);
          
          // If there are subscriptions, fetch posts from those channels
          if (channelIds.length > 0) {
            let allPosts: Post[] = [];
            
            // Fetch posts from each channel separately
            for (const channelId of channelIds) {
              try {
                const postsResponse = await PostService.getPostsByUserId(channelId, 0, 5);
                
                if (postsResponse.data && postsResponse.data.content) {
                  allPosts = [...allPosts, ...postsResponse.data.content];
                }
              } catch (error) {
                console.error(`Error fetching posts for channel ${channelId}:`, error);
              }
            }
            
            // Sort by creation date (newest first)
            allPosts.sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            
            setSubscriptionPosts(allPosts);
          }
        }
      } catch (error) {
        console.error('Error fetching subscription posts:', error);
      } finally {
        setFeedLoading(false);
      }
    };

    fetchSubscriptionPosts();
  }, [isAuthenticated]);

  // Fetch user's own posts for "Your Posts" tab
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!isAuthenticated || !user) return;
      
      setUserPostsLoading(true);
      
      try {
        const response = await PostService.getPostsByUserId(user.id, 0, 10);
        if (response.data) {
          setUserPosts(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setUserPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [isAuthenticated, user]);

  // Handle create post button click
  const handleCreatePostClick = () => {
    if (hasNoChannel) {
      // Don't open form, will show warning in the form component
      return;
    }
    setShowPostForm(true);
  };
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowPostForm(false);
    setEditingPost(null);
  };

  // Handle form success
  const handleFormSuccess = () => {
    // Refresh user posts after creating new post
    if (user) {
      PostService.getPostsByUserId(user.id, 0, 10)
        .then(response => {
          if (response.data) {
            setUserPosts(response.data.content);
          }
        })
        .catch(error => {
          console.error('Error refreshing user posts:', error);
        });
    }
    handleFormClose();
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Channel requirement warning */}
      {hasNoChannel && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Channel Required</AlertTitle>
          <AlertDescription>
            You need to set up your channel before you can create posts.{' '}
            <Button 
              variant="link" 
              className="px-1 h-auto" 
              onClick={() => window.location.href = '/settings'}
            >
              Set up channel
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button onClick={handleCreatePostClick} disabled={hasNoChannel || userPostsLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="your-posts">Your Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="mt-6">
          {feedLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading posts from your subscriptions...</p>
            </div>
          ) : subscriptionPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">No Posts from Subscriptions</h2>
              <p className="text-muted-foreground mb-6">
                {subscriptions.length === 0 
                  ? "You haven't subscribed to any channels yet. Subscribe to channels to see their posts here!"
                  : "The channels you've subscribed to haven't posted anything yet."
                }
              </p>
              {subscriptions.length === 0 && (
                <Button onClick={() => router.push('/explore')}>
                  Explore Channels
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {subscriptionPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="your-posts" className="mt-6">
          {userPostsLoading && userPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your posts...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">No Posts Yet</h2>
              <p className="text-muted-foreground mb-6">
                {hasNoChannel
                  ? "Set up your channel to start creating posts and sharing with your subscribers!"
                  : "You haven't created any posts yet. Share your thoughts with your subscribers!"
                }
              </p>
              {!hasNoChannel && (
                <Button onClick={() => setShowPostForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Post form dialog */}
      <PostForm
        open={showPostForm}
        onOpenChange={handleFormClose}
        post={editingPost}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}