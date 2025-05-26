'use client';

import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PostCard from '@/components/post/post-card';
import PostForm from '@/components/post/post-form';
import { usePosts } from '@/lib/hooks/use-posts';
import { useAuthStore } from '@/store/auth-store';
import { Post } from '@/types/post';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ChannelPostsTabProps {
  userId: number;
  isOwnChannel?: boolean;
}

export function ChannelPostsTab({ userId, isOwnChannel = false }: ChannelPostsTabProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { posts, getPostsByUserId, isLoading } = usePosts();
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Check if user has a channel
  const hasNoChannel = isOwnChannel && user && (!user.channelName || user.channelName.trim() === '');

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPostsByUserId(userId, 0, 10);
      if (result) {
        setHasMore(!result.last);
      }
    };

    fetchPosts();
  }, [userId]);

  // Load more posts
  const loadMorePosts = async () => {
    const nextPage = page + 1;
    const result = await getPostsByUserId(userId, nextPage, 10);
    if (result) {
      setPage(nextPage);
      setHasMore(!result.last);
    }
  };

  // Handle edit post
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
    // Refresh the posts list
    getPostsByUserId(userId, 0, 10).then((result) => {
      if (result) {
        setPage(0);
        setHasMore(!result.last);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Channel requirement warning for own channel without setup */}
      {hasNoChannel && (
        <Alert variant="destructive">
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

      {/* Create post button - only show for own channel with setup */}
      {isOwnChannel && isAuthenticated && !hasNoChannel && (
        <div className="flex justify-end">
          <Button onClick={() => setShowPostForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-6">
        {isLoading && posts.length === 0 ? (
          // Loading state
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground mb-4">
              {isOwnChannel 
                ? hasNoChannel
                  ? "Set up your channel to start creating posts and sharing with your subscribers!"
                  : "You haven't created any posts yet. Share your thoughts with your subscribers!"
                : "This channel hasn't posted anything yet."
              }
            </p>
            {isOwnChannel && !hasNoChannel && (
              <Button onClick={() => setShowPostForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Post
              </Button>
            )}
          </div>
        ) : (
          // Posts list
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={isOwnChannel ? handleEditPost : undefined}
              />
            ))}
            
            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <Button 
                  variant="outline" 
                  onClick={loadMorePosts}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Post form dialog */}
      <PostForm
        open={showPostForm}
        onOpenChange={setShowPostForm}
        post={editingPost}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

export default ChannelPostsTab;