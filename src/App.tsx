import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import CatalogPost from './components/CatalogPost';
import ViewControls from './components/ViewControls';
import { generateRandomTag } from './utils/generateTag';
import { sortPosts } from './utils/sortPosts';
import type { Post as PostType, Comment as CommentType, ViewMode, SortMode } from './types';

function App() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const handleCreatePost = (title: string, content: string, userTag: string, images: string[]) => {
    const newPost: PostType = {
      id: Date.now().toString(),
      title,
      content,
      userTag: userTag || generateRandomTag(),
      timestamp: Date.now(),
      cookedVotes: 0,
      gmiVotes: 0,
      comments: [],
      images,
    };
    setPosts([newPost, ...posts]);
  };

  const handleVote = (postId: string, voteType: 'COOKED' | 'GMI') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          cookedVotes: voteType === 'COOKED' ? post.cookedVotes + 1 : post.cookedVotes,
          gmiVotes: voteType === 'GMI' ? post.gmiVotes + 1 : post.gmiVotes,
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, comment: CommentType) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [comment, ...post.comments],
        };
      }
      return post;
    }));
  };

  const sortedPosts = sortPosts(posts, sortMode);

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-white shadow-md border-b border-amber-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Flame size={32} className="text-amber-500" />
            <h1 className="text-3xl font-bold text-amber-900">amicooked</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CreatePost onSubmit={handleCreatePost} />
        
        <ViewControls
          viewMode={viewMode}
          sortMode={sortMode}
          onViewModeChange={setViewMode}
          onSortModeChange={setSortMode}
        />
        
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {sortedPosts.map(post => (
              <Post
                key={post.id}
                post={post}
                onVote={handleVote}
                onAddComment={handleAddComment}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedPosts.map(post => (
              <CatalogPost
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
              />
            ))}
          </div>
        )}
        
        {sortedPosts.length === 0 && (
          <div className="text-center text-amber-700 py-12">
            <p className="text-xl">No posts yet. Be the first to share something!</p>
          </div>
        )}

        {viewMode === 'catalog' && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-3xl">
              <Post
                post={sortedPosts.find(p => p.id === selectedPost)!}
                onVote={handleVote}
                onAddComment={handleAddComment}
              />
              <button
                onClick={() => setSelectedPost(null)}
                className="fixed top-4 right-4 text-white hover:text-amber-200"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;