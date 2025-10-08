import React from 'react';
import { User } from '../../services/api/types';

interface ProfileOverviewProps {
  user: User;
  totalSpent: number;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, totalSpent }) => {
  return (
    <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-dark-600 shadow-2xl">
      <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-sera-blue to-blue-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-4 border-sera-blue/30">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-dark-800">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse m-auto mt-1"></div>
          </div>
        </div>
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{user?.username || 'User'}</h2>
          <p className="text-gray-300 text-sm sm:text-base mb-3">{user?.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              ✓ Verified
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              🥇 Gold
            </span>
          </div>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sera-orange to-orange-500 bg-clip-text text-transparent">
            ₹{totalSpent.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm">Total Spent</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;