"use client";

import CommentList from '@/components/comment/comment-list';

interface Props { videoId: string; isVideoOwner?: boolean }

export default function VideoCommentList({ videoId, isVideoOwner = false }: Props) {
  return (
    <CommentList targetId={videoId} commentType="VIDEO" isOwner={isVideoOwner} />
  );
}