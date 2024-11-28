import type { Post, SortMode } from '../types';

const TRENDING_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function sortPosts(posts: Post[], sortMode: SortMode): Post[] {
  const now = Date.now();
  
  switch (sortMode) {
    case 'newest':
      return [...posts].sort((a, b) => b.timestamp - a.timestamp);
      
    case 'topCooked':
      return [...posts].sort((a, b) => b.cookedVotes - a.cookedVotes);
      
    case 'topGMI':
      return [...posts].sort((a, b) => b.gmiVotes - a.gmiVotes);
      
    case 'trending':
      return [...posts].sort((a, b) => {
        // Calculate a trending score based on votes and recency
        const getScore = (post: Post) => {
          const age = (now - post.timestamp) / TRENDING_WINDOW;
          const votes = post.cookedVotes + post.gmiVotes;
          return votes / (age + 1); // Add 1 to avoid division by zero
        };
        return getScore(b) - getScore(a);
      });
      
    default:
      return posts;
  }
}