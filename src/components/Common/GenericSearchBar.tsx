import React from 'react';
import { Search } from 'lucide-react';

interface GenericSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  className?: string;
}

const GenericSearchBar: React.FC<GenericSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search restaurants, cuisines, or dishes...",
  className = ""
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className={`flex-1 w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-blue focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </form>
    </div>
  );
};

export default GenericSearchBar;
