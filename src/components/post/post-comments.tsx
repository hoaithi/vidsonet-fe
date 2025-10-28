"use client";

import CommentList from '@/components/comment/comment-list';

interface Props { postId: string | number; isPostOwner?: boolean }

export function PostComments({ postId, isPostOwner = false }: Props) {
  return (
    <CommentList targetId={String(postId)} commentType="POST" isOwner={isPostOwner} />
  );
}

export default PostComments;

