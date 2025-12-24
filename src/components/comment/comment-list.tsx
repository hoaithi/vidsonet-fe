'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquare, Heart, MoreHorizontal, Reply, Loader2, Pin } from 'lucide-react';

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
import { useComments } from '@/lib/hooks/use-comments';
import { Comment as GenericComment } from '@/types/video';
import { commentSchema } from '@/lib/validation';
import { getRelativeTime } from '@/lib/utils';

export type CommentType = 'VIDEO' | 'POST';

interface CommentListProps {
  targetId: string; // videoId or postId
  commentType: CommentType;
  isOwner?: boolean; // owner of the video/post
}

export default function CommentList({ targetId, commentType, isOwner = false }: CommentListProps) {
  const { isAuthenticated, profile } = useAuthStore();

  // Single comments hook for both types
  const commentHook = useComments(targetId, commentType);

  const [replyingTo, setReplyingTo] = useState<string | number | null>(null);
  const [editingComment, setEditingComment] = useState<string | number | null>(null);

  // Load comments on mount/when id changes
  useEffect(() => {
    commentHook.getItemComments(targetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, commentType]);

  // Comment form
  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  // Reply form
  const replyForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
  });

  const isLoading = commentHook.isLoading;

  const comments = useMemo(() => {
    return (commentHook.comments as GenericComment[]) || [];
  }, [commentHook.comments]);

  const getCommentCountText = () => {
    const count = comments.length;
    if (count === 0) return 'No comments';
    if (count === 1) return '1 Comment';
    return `${count} Comments`;
  };

  const onCommentSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated) return;

    await commentHook.addComment({ content: values.content, itemId: targetId, commentType });
    commentForm.reset();
  };

  const onReplySubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated || replyingTo === null) return;

    const replyData: CommentCreateRequest = {
      content: values.content,
      itemId: targetId,
      parentId: String(replyingTo),
      commentType,
    };

    await commentHook.replyToComment(String(replyingTo), replyData);
    replyForm.reset();
    setReplyingTo(null);
  };

  const onEditSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!isAuthenticated || editingComment === null) return;

    await commentHook.updateComment(String(editingComment), { content: values.content });
    editForm.reset();
    setEditingComment(null);
  };

  const cancelAction = () => {
    setReplyingTo(null);
    setEditingComment(null);
    replyForm.reset();
    editForm.reset();
  };

  const toggleHeart = async (commentId: string | number, currentHearted: boolean) => {
    if (!isAuthenticated) return;

    // owner can heart; backend toggles
    if (currentHearted) {
      await commentHook.unheartComment(String(commentId));
    } else {
      await commentHook.heartComment(String(commentId));
    }
  };

  const togglePin = async (commentId: string | number, currentPinned: boolean) => {
    if (!isAuthenticated || commentType !== 'VIDEO' || !isOwner) return;
    if (currentPinned) {
      await commentHook.unpinComment(String(commentId));
    } else {
      await commentHook.pinComment(String(commentId));
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    if (!isAuthenticated) return;
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    await commentHook.deleteComment(String(commentId));
  };

  const renderComment = (comment: GenericComment, isReply: boolean = false) => {
    const ownerName = (comment as GenericComment).owner.fullName;
    const ownerAvatar = (comment as GenericComment).owner.avatarUrl;
    const ownerId = (comment as GenericComment).owner.id;

    const isOwnerOfComment = profile?.id === ownerId;

    const canReply = isAuthenticated && !isReply;
    const canEdit = isAuthenticated && isOwnerOfComment;
    const canDelete = isAuthenticated && (isOwnerOfComment || isOwner);
    const canHeart = isAuthenticated && (!isReply) && (commentType === 'VIDEO' ? isOwner : isOwner); // post: only owner hearts, keep same rule
    const canPin = isAuthenticated && !isReply && commentType === 'VIDEO' && isOwner;

  const hearted = (comment as GenericComment).hearted as boolean;
  const pinned = commentType === 'VIDEO' ? (comment as GenericComment).isPinned : false;

    return (
      <div key={String(comment.id)} className={`flex gap-3 ${pinned ? 'bg-muted/50 p-3 rounded-lg' : ''} ${isReply ? 'mt-3 ml-10' : 'mt-6'}`}>
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={ownerAvatar || ''} alt={ownerName} />
          <AvatarFallback>{ownerName?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{ownerName}</span>
            <span className="text-xs text-muted-foreground">{getRelativeTime((comment as any).createdAt as string)}</span>
            {pinned && (
              <span className="text-xs text-primary inline-flex items-center gap-1"><Pin className="h-3 w-3" />Pinned</span>
            )}
          </div>

          {editingComment === comment.id ? (
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="mt-2">
              <Textarea
                {...editForm.register('content')}
                defaultValue={comment.content as unknown as string}
                placeholder="Edit your comment..."
                className="min-h-20"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={cancelAction}>Cancel</Button>
                <Button type="submit" size="sm" disabled={editForm.formState.isSubmitting}>
                  {editForm.formState.isSubmitting ? (<Loader2 className="h-4 w-4 animate-spin" />) : ('Save')}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm mt-1">{(comment as any).content}</p>
          )}

          <div className="flex items-center gap-4 mt-2">
            {canReply && (
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground" onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}

            {canHeart && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${hearted ? 'text-red-500' : 'text-muted-foreground'}`}
                onClick={() => toggleHeart(comment.id as any, hearted)}
              >
                <Heart className="h-4 w-4 mr-1" />
                {hearted ? 'Hearted' : 'Heart'}
              </Button>
            )}

            {(canEdit || canDelete || canPin) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => setEditingComment(comment.id)}>Edit</DropdownMenuItem>
                  )}

                  {canDelete && (
                    <DropdownMenuItem onClick={() => handleDeleteComment(comment.id)}>Delete</DropdownMenuItem>
                  )}

                  {canPin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => togglePin(comment.id, pinned)}>
                        {pinned ? 'Unpin' : 'Pin'}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {replyingTo === comment.id && (
            <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="mt-3">
              <Textarea {...replyForm.register('content')} placeholder="Add a reply..." className="min-h-20" />
              <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="outline" size="sm" onClick={cancelAction}>Cancel</Button>
                <Button type="submit" size="sm" disabled={replyForm.formState.isSubmitting}>
                  {replyForm.formState.isSubmitting ? (<Loader2 className="h-4 w-4 animate-spin" />) : ('Reply')}
                </Button>
              </div>
            </form>
          )}

          {Array.isArray((comment as any).replies) && (comment as any).replies.length > 0 && (
            <div className="mt-3">
              {(comment as any).replies.map((reply: any) => renderComment(reply, true))}
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
        {comments.length ? getCommentCountText() : 'Comments'}
      </h3>

      {isAuthenticated ? (
        <div className="mt-4 flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={profile?.avatarUrl || ''} alt={profile?.fullName} />
            <AvatarFallback>{profile?.fullName?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>

          <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="flex-1">
            <Textarea {...commentForm.register('content')} placeholder="Add a comment..." className="min-h-20" />
            <div className="flex justify-end mt-2">
              <Button type="submit" disabled={commentForm.formState.isSubmitting}>
                {commentForm.formState.isSubmitting ? (<Loader2 className="h-4 w-4 animate-spin mr-2" />) : null}
                Comment
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mt-4 text-center py-4 border rounded-lg">
          <p className="text-muted-foreground">
            Please <Button variant="link" className="px-1 h-auto" onClick={() => (window.location.href = '/login')}>sign in</Button> to comment
          </p>
        </div>
      )}

      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : comments && comments.length > 0 ? (
          <>
            {/* For VIDEO: pinned first */}
            {commentType === 'VIDEO'
              ? [
                  ...(comments as GenericComment[]).filter((c) => c.isPinned).map((c) => renderComment(c)),
                  ...(comments as GenericComment[]).filter((c) => !c.isPinned).map((c) => renderComment(c)),
                ]
              : (comments as GenericComment[]).map((c) => renderComment(c))}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
}
