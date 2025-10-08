import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PROFILE_TABS, TabType } from '../config/profileConfig';
import { useProfileData } from '../hooks/useProfileData';
import ProfileOverview from '../components/Profile/ProfileOverview';

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
    const tab = PROFILE_TABS.find(t => t.id === activeTab);
    if (!tab) return null;
    
    const Component = React.lazy(tab.component);
    return (
      <React.Suspense fallback={<div className="text-center text-white">Loading...</div>}>
        <Component />
      </React.Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-12">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-sera-orange to-sera-yellow bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Profile Overview Card */}
        <ProfileOverview user={user} totalSpent={totalSpent} />

        {/* Tabs */}
        <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl border border-dark-600 overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="border-b border-dark-600 bg-gradient-to-r from-dark-700 to-dark-600">
            <div className="flex overflow-x-auto scrollbar-hide">
              {PROFILE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center justify-center space-x-2 px-4 sm:px-6 lg:px-8 py-4 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-1 min-w-0 relative ${
                    activeTab === tab.id
                      ? 'text-sera-orange border-b-2 border-sera-orange bg-gradient-to-r from-sera-orange/10 to-orange-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
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
