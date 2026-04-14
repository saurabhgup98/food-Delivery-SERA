import React from 'react';

interface ComingSoonPageProps {
  title: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <p className="text-gray-400">Coming Soon</p>
    </div>
  </div>
);

