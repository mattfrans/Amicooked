import React, { useState } from 'react';
import { Send } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface CreatePostProps {
  onSubmit: (title: string, content: string, userTag: string, images: string[]) => void;
}

export default function CreatePost({ onSubmit }: CreatePostProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userTag, setUserTag] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (images.length > 5) return;
    onSubmit(title, content, userTag.trim(), images);
    setTitle('');
    setContent('');
    setUserTag('');
    setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 border border-amber-100">
      <h2 className="text-2xl font-bold mb-4 text-amber-900">Create New Thread</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent h-32 bg-amber-50"
        />
        <ImageUpload images={images} onImagesChange={setImages} />
        <input
          type="text"
          placeholder="Custom tag (optional)"
          value={userTag}
          onChange={(e) => setUserTag(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-50"
        />
        <button
          type="submit"
          className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
        >
          <Send size={20} /> Post Thread
        </button>
      </div>
    </form>
  );
}