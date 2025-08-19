import React from 'react';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = ""
}) => {
  return (
    <div className={`flex bg-slate-700 border border-slate-600 rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => onViewModeChange('grid')}
        className={`px-3 py-2 text-sm transition-colors ${
          viewMode === 'grid'
            ? 'bg-sera-blue text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
        </svg>
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`px-3 py-2 text-sm transition-colors ${
          viewMode === 'list'
            ? 'bg-sera-blue text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      </button>
    </div>
  );
};

export default ViewModeToggle;
