import React from 'react';
import { KanbanSquare, List } from 'lucide-react';
import { useDealStore } from '../store/dealStore';
import clsx from 'clsx';

export default function ViewToggle() {
  const { viewMode, setViewMode } = useDealStore();

  return (
    <div className="flex bg-dark-700 rounded-lg p-1">
      <button
        onClick={() => setViewMode('kanban')}
        className={clsx(
          'flex items-center px-3 py-1.5 rounded-md transition-colors',
          viewMode === 'kanban'
            ? 'bg-dark-600 text-white'
            : 'text-gray-400 hover:text-white'
        )}
      >
        <KanbanSquare className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">Kanban</span>
      </button>
      
      <button
        onClick={() => setViewMode('list')}
        className={clsx(
          'flex items-center px-3 py-1.5 rounded-md transition-colors',
          viewMode === 'list'
            ? 'bg-dark-600 text-white'
            : 'text-gray-400 hover:text-white'
        )}
      >
        <List className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">List</span>
      </button>
    </div>
  );
}