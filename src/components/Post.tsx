import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Post as PostType, Comment as CommentType } from '../types';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { generateRandomTag } from '../utils/generateTag';
import { formatTimestamp } from '../utils/formatDate';

interface PostProps {
  post: PostType;
  onVote: (postId: string, voteType: 'COOKED' | 'GMI') => void;
  onAddComment: (postId: string, comment: CommentType) => void;
}

export default function Post({ post, onVote, onAddComment }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAddComment = (content: string, userTag: string) => {
    const newComment: CommentType = {
      id: Date.now().toString(),
      content,
      userTag: userTag || generateRandomTag(),
      timestamp: Date.now(),
    };
    onAddComment(post.id, newComment);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-amber-100">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-amber-900">{post.title}</h2>
        <div className="flex flex-col items-end">
          <span className="text-sm text-amber-600 font-medium">
            {formatTimestamp(post.timestamp)}
          </span>
          <span className="text-sm text-amber-600">by {post.userTag}</span>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{post.content}</p>

      {post.images.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between border-t border-amber-100 pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onVote(post.id, 'COOKED')}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
          >
            <span className="text-2xl">🔥</span>
            <span>{post.cookedVotes} Cooked</span>
          </button>
          
          <button
            onClick={() => onVote(post.id, 'GMI')}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-700"
          >
            <span className="text-2xl">🚀</span>
            <span>{post.gmiVotes} GMI</span>
          </button>
        </div>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700"
        >
          <MessageCircle size={20} />
          <span>{post.comments.length} comments</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 border-t border-amber-100 pt-4">
          <CommentForm onSubmit={handleAddComment} />
          <div className="mt-6 space-y-4">
            {post.comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}