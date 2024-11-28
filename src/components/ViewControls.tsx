import React from 'react';
import { LayoutList, LayoutGrid, TrendingUp, Flame, Rocket, Clock } from 'lucide-react';
import type { ViewMode, SortMode } from '../types';

interface ViewControlsProps {
  viewMode: ViewMode;
  sortMode: SortMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSortModeChange: (mode: SortMode) => void;
}

export default function ViewControls({
  viewMode,
  sortMode,
  onViewModeChange,
  onSortModeChange,
}: ViewControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-amber-100">
      <div className="flex items-center gap-2">
        <span className="text-amber-700 font-medium">View:</span>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'
          }`}
        >
          <LayoutList size={20} />
          <span>List</span>
        </button>
        <button
          onClick={() => onViewModeChange('catalog')}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            viewMode === 'catalog' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'
          }`}
        >
          <LayoutGrid size={20} />
          <span>Catalog</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-amber-700 font-medium">Sort by:</span>
        <button
          onClick={() => onSortModeChange('newest')}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            sortMode === 'newest' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'
          }`}
        >
          <Clock size={20} />
          <span>Newest</span>
        </button>
        <button
          onClick={() => onSortModeChange('topCooked')}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            sortMode === 'topCooked' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'
          }`}
        >
          <Flame size={20} />
          <span>Top Cooked</span>
        </button>
        <button
          onClick={() => onSortModeChange('topGMI')}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            sortMode === 'topGMI' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'
          }`}
        >
          <Rocket size={20} />
          <span>Top GMI</span>
        </button>
        <button
          onClick={() => onSortModeChange('trending')}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            sortMode === 'trending' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-amber-50'
          }`}
        >
          <TrendingUp size={20} />
          <span>Trending</span>
        </button>
      </div>
    </div>
  );
}