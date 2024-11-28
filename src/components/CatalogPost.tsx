import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { Post as PostType } from '../types';
import { formatTimestamp } from '../utils/formatDate';

interface CatalogPostProps {
  post: PostType;
  onClick: () => void;
}

export default function CatalogPost({ post, onClick }: CatalogPostProps) {
  const thumbnail = post.images[0] || null;
  
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-amber-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {thumbnail ? (
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-amber-50 flex items-center justify-center">
          <span className="text-amber-300 text-4xl">📝</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-amber-900 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-lg">🔥</span>
              {post.cookedVotes}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-lg">🚀</span>
              {post.gmiVotes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={16} />
              {post.comments.length}
            </span>
          </div>
          <span className="text-amber-600 text-xs">
            {formatTimestamp(post.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}