export interface Post {
  id: string;
  title: string;
  content: string;
  userTag: string;
  timestamp: number;
  cookedVotes: number;
  gmiVotes: number;
  comments: Comment[];
  images: string[];
}

export interface Comment {
  id: string;
  content: string;
  userTag: string;
  timestamp: number;
  parentId?: string;
}

export type VoteType = 'COOKED' | 'GMI';

export type ViewMode = 'list' | 'catalog';
export type SortMode = 'newest' | 'topCooked' | 'topGMI' | 'trending';