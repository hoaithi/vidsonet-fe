'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PostCard from '@/components/post/post-card';
import PostComments from '@/components/post/post-comments';
import { usePosts } from '@/lib/hooks/use-posts';
import { useAuthStore } from '@/store/auth-store';
import { Post } from '@/types/post';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const { isAuthenticated, profile } = useAuthStore();
  const { getPost } = usePosts();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      
      try {
        const postData = await getPost(postId);
        if (postData) {
          setPost(postData);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Check if user is post owner
  const isOwner = isAuthenticated && profile && post && profile.id === post.user.id;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div className="flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    );
  }

  // Error state
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The post you're looking for might have been removed or is unavailable.
        </p>
        <Button asChild variant="default">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/channel/${post.user.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Channel
          </Link>
        </Button>
      </div>

      {/* Post content */}
      <div className="space-y-6">
        <article>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="whitespace-pre-line text-base leading-relaxed">
            {post.content}
          </div>
        </article>

        {/* Post actions (embedded in PostCard but we can also show them here) */}
        <PostCard post={post} showActions={false} />
      </div>

      {/* Comments section */}
      <div id="comments">
        <PostComments postId={post.id} isPostOwner={isOwner || undefined} />
      </div>
    </div>
  );
}