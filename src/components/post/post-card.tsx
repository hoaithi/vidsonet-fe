'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown, MessageSquare, MoreHorizontal, Heart, Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuthStore } from '@/store/auth-store';
import { usePosts } from '@/lib/hooks/use-posts';
import { Post } from '@/types/post';
import { getRelativeTime } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
}

export function PostCard({ post, showActions = true, onEdit }: PostCardProps) {
  const { isAuthenticated, profile } = useAuthStore();
  const { likePost, dislikePost, deletePost } = usePosts();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [postData, setPostData] = useState<Post>(post);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);

  const isOwner = isAuthenticated && profile && profile.id === post.profileId;

  // Handle like
  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    const updated = await likePost(post.id);
    if (updated) {
      setPostData(updated);
      setHasLiked(true);
      setHasDisliked(false);
    }
    setIsLiking(false);
  };

  // Handle dislike
  const handleDislike = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (isDisliking) return;
    setIsDisliking(true);
    const updated = await dislikePost(post.id);
    if (updated) {
      setPostData(updated);
      setHasDisliked(true);
      setHasLiked(false);
    }
    setIsDisliking(false);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!isOwner) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;
    
    setIsDeleting(true);
    const success = await deletePost(post.id);
    if (!success) {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${post.profileId}`} className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={post.profileImage || ''} 
                alt={post.profileName} 
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>
                {(post.profileName|| 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-sm">
                {post.profileName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {getRelativeTime(post.createdAt)}
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <span> • edited</span>
                )}
              </p>
            </div>
          </Link>
          
          {(isOwner || showActions) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwner && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(post)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {postData.imageUrl && (
            <div className="relative w-full overflow-hidden rounded-md bg-muted aspect-[4/3] sm:aspect-video">
              <Image
                src={postData.imageUrl}
                alt={postData.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
              />
            </div>
          )}
          <Link href={`/posts/${postData.id}`} className="block">
            <h2 className="text-lg font-semibold hover:text-primary transition-colors">
              {postData.title}
            </h2>
          </Link>
          
          <div className="text-sm whitespace-pre-line">
            {postData.content.length > 300 ? (
              <>
                {postData.content.substring(0, 300)}...
                <Link href={`/posts/${postData.id}`} className="text-primary hover:underline ml-1">
                  Read more
                </Link>
              </>
            ) : (
              postData.content
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1 hover:text-foreground ${hasLiked ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-current text-primary" : ""}`} />
              {postData.likeCount > 0 && <span className="text-xs">{postData.likeCount}</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              disabled={isDisliking}
              className={`flex items-center gap-1 hover:text-foreground ${hasDisliked ? "text-destructive" : "text-muted-foreground"}`}
            >
              <ThumbsDown className={`h-4 w-4 ${hasDisliked ? "fill-current text-destructive" : ""}`} />
              {postData.dislikeCount > 0 && <span className="text-xs">{postData.dislikeCount}</span>}
            </Button>
            
            <Link href={`/posts/${postData.id}#comments`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                {postData.commentCount > 0 && <span className="text-xs">{postData.commentCount}</span>}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;