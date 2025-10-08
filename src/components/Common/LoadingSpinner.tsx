import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-sera-pink/30 border-t-sera-pink rounded-full animate-spin"></div>
        <p className="text-white/80 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
