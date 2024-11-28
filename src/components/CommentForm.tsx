import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string, userTag: string) => void;
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [userTag, setUserTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content, userTag.trim());
    setContent('');
    setUserTag('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="space-y-3">
        <textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent h-24 bg-amber-50"
        />
        <input
          type="text"
          placeholder="Custom tag (optional)"
          value={userTag}
          onChange={(e) => setUserTag(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          <MessageCircle size={18} />
          Add Comment
        </button>
      </div>
    </form>
  );
}