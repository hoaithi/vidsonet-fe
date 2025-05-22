'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, Heart, MoreHorizontal, Reply, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuthStore } from '@/store/auth-store';
import { usePostComments } from '@/lib/hooks/use-posts';
import { PostComment } from '@/types/post';
import { getRelativeTime } from '@/lib/utils';

// Comment form validation
const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters'),
});

interface PostCommentsProps {
  postId: number;
  isPostOwner?: boolean;
}

export function PostComments({ postId, isPostOwner = false }: PostCommentsProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { 
    isLoading, 
    comments, 
    getPostComments, 
    createComment, 
    getCommentReplies,
    updateComment, 
    deleteComment, 
    heartComment, 
    unheartComment 
  } = usePostComments(postId);
  
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);

  // Load comments on mount
  useEffect(() => {
    getPostComments(postId);
  }, [postId, getPostComments]);

  // Main comment form
  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  // Reply form
  const replyForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
  });

  // Submit new comment
  const onCommentSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated) return;
    
    await createComment({
      content: values.content,
      postId,
    });
    
    commentForm.reset();
  };

  // Submit reply
  const onReplySubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated || replyingTo === null) return;
    
    await createComment({
      content: values.content,
      postId,
      parentId: replyingTo,
    });
    
    replyForm.reset();
    setReplyingTo(null);
  };

  // Submit edit
  const onEditSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated || editingComment === null) return;
    
    await updateComment(editingComment, { content: values.content });
    
    editForm.reset();
    setEditingComment(null);
  };

  // Cancel actions
  const cancelAction = () => {
    setReplyingTo(null);
    setEditingComment(null);
    replyForm.reset();
    editForm.reset();
  };

  // Toggle heart comment
  const toggleHeart = async (commentId: number, currentHearted: boolean) => {
    if (!isAuthenticated || !isPostOwner) return;
    
    if (currentHearted) {
      await unheartComment(commentId);
    } else {
      await heartComment(commentId);
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId: number) => {
    if (!isAuthenticated) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
      await deleteComment(commentId);
    }
  };

  // Format comment count text
  const getCommentCountText = () => {
    if (!comments) return 'Comments';
    
    const count = comments.length;
    if (count === 0) return 'No comments';
    if (count === 1) return '1 Comment';
    return `${count} Comments`;
  };

  // Render a single comment
  const renderComment = (comment: PostComment, isReply: boolean = false) => {
    const isOwner = user?.id === comment.user.id;
    const showReplyButton = isAuthenticated && !isReply;
    const showEditButton = isAuthenticated && isOwner;
    const showDeleteButton = isAuthenticated && (isOwner || isPostOwner);
    const showHeartButton = isAuthenticated && isPostOwner && !isReply;
    
    return (
      <div 
        key={comment.id} 
        className={`flex gap-3 ${isReply ? 'mt-3 ml-10' : 'mt-6'}`}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.user.profilePicture || ''} alt={comment.user.username} />
          <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.user.username}</span>
            <span className="text-xs text-muted-foreground">{getRelativeTime(comment.createdAt)}</span>
            {comment.isHearted && (
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
            )}
          </div>
          
          {editingComment === comment.id ? (
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="mt-2">
              <Textarea
                {...editForm.register('content')}
                defaultValue={comment.content}
                placeholder="Edit your comment..."
                className="min-h-20"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={cancelAction}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={editForm.formState.isSubmitting}
                >
                  {editForm.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm mt-1">{comment.content}</p>
          )}
          
          <div className="flex items-center gap-4 mt-2">
            {showReplyButton && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-muted-foreground"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            
            {showHeartButton && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${comment.isHearted ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={() => toggleHeart(comment.id, comment.isHearted)}
              >
                <Heart className="h-4 w-4 mr-1" />
                {comment.isHearted ? 'Hearted' : 'Heart'}
              </Button>
            )}
            
            {(showEditButton || showDeleteButton) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {showEditButton && (
                    <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>
                      Edit
                    </DropdownMenuItem>
                  )}
                  
                  {showDeleteButton && (
                    <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="mt-3">
              <Textarea
                {...replyForm.register('content')}
                placeholder="Add a reply..."
                className="min-h-20"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={cancelAction}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={replyForm.formState.isSubmitting}
                >
                  {replyForm.formState.isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Reply'
                  )}
                </Button>
              </div>
            </form>
          )}
          
          {/* Display replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        {getCommentCountText()}
      </h3>
      
      {/* Comment form */}
      {isAuthenticated ? (
        <div className="mt-4 flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={user?.profilePicture || ''} alt={user?.username} />
            <AvatarFallback>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          
          <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="flex-1">
            <Textarea
              {...commentForm.register('content')}
              placeholder="Add a comment..."
              className="min-h-20"
            />
            <div className="flex justify-end mt-2">
              <Button 
                type="submit" 
                disabled={commentForm.formState.isSubmitting}
              >
                {commentForm.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Comment
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-4 text-center py-4 border rounded-lg">
          <p className="text-muted-foreground">
            Please <Button variant="link" className="px-1 h-auto" onClick={() => window.location.href = '/login'}>sign in</Button> to comment
          </p>
        </div>
      )}
      
      {/* Comments list */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments && comments.length > 0 ? (
          <>
            {comments.map(comment => renderComment(comment))}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}

export default PostComments;

function useEffect(arg0: () => void, arg1: (number | ((id?: number) => Promise<PostComment[] | undefined>))[]) {
    throw new Error('Function not implemented.');
}
