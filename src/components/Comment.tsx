import React from 'react';
import type { Comment as CommentType } from '../types';
import { formatTimestamp } from '../utils/formatDate';

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="pl-4 border-l-2 border-amber-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-amber-700">{comment.userTag}</span>
        <span className="text-xs text-gray-500">
          {formatTimestamp(comment.timestamp)}
        </span>
      </div>
      <p className="text-gray-700">{comment.content}</p>
    </div>
  );
}