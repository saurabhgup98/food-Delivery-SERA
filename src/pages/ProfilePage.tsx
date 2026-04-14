import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '../hooks/useProfileData';
import { 
  PROFILE_TABS, 
  TabType, 
  getUserInitials, 
  getUserDisplayName, 
  getUserEmail, 
  isUserVerified, 
  getUserMembershipLevel, 
  formatCurrency, 
  getTabContent, 
  getTabButtonClasses, 
  getProfileOverviewClasses, 
  getAvatarClasses, 
  getOnlineIndicatorClasses, 
  getStatusBadgeClasses 
} from './config/ProfilePageConfig';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const { totalSpent } = useProfileData(user);

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

  const renderTabContent = () => {
    return getTabContent(activeTab, PROFILE_TABS);
  };

  // Get user membership level
  const membershipLevel = getUserMembershipLevel(totalSpent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-5">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-5">
        {/* Header - Reduced spacing by 60% */}
        <div className="mb-3 sm:mb-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-sera-orange to-sera-yellow bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Profile Overview Card - Integrated directly */}
        <div className={getProfileOverviewClasses()}>
          <div className="flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className={getAvatarClasses()}>
                {getUserInitials(user)}
              </div>
              <div className={getOnlineIndicatorClasses()}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse m-auto mt-1"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{getUserDisplayName(user)}</h2>
              <p className="text-gray-300 text-sm sm:text-base mb-3">{getUserEmail(user)}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {isUserVerified(user) && (
                  <span className={getStatusBadgeClasses('verified')}>
                    ✓ Verified
                  </span>
                )}
                <span className={`${getStatusBadgeClasses('membership')} ${membershipLevel.bgColor} ${membershipLevel.borderColor}`}>
                  {membershipLevel.icon} {membershipLevel.level}
                </span>
              </div>
            </div>
            <div className="text-center sm:text-right w-full sm:w-auto">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-sera-orange to-orange-500 bg-clip-text text-transparent">
                {formatCurrency(totalSpent)}
              </div>
              <div className="text-gray-400 text-sm">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl border border-dark-600 overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="border-b border-dark-600 bg-gradient-to-r from-dark-700 to-dark-600">
            <div className="flex overflow-x-auto scrollbar-hide">
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={getTabButtonClasses(activeTab === tab.id)}
                >
                  <span className="text-base sm:text-lg flex-shrink-0">{tab.icon}</span>
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  <span className="sm:hidden truncate">{tab.label.split(' ')[0]}</span>
                  
                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sera-orange to-orange-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-dark-800 to-dark-700">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;