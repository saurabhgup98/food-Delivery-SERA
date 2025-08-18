import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import DeliveryAddresses from './DeliveryAddresses';
import FoodPreferences from './FoodPreferences';
import PaymentMethods from './PaymentMethods';
import NotificationSettings from './NotificationSettings';

// Mock orders data (in real app, this would come from API)
const mockOrders = [
  {
    id: 'ORD001',
    restaurantName: 'Spice Garden',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 350 },
      { name: 'Naan', quantity: 2, price: 30 },
      { name: 'Dal Makhani', quantity: 1, price: 180 }
    ],
    totalAmount: 590,
    orderDate: '2024-01-15T18:30:00',
    deliveryDate: '2024-01-15T19:45:00',
    status: 'delivered',
    rating: 4,
    review: 'Great food and fast delivery!'
  },
  {
    id: 'ORD002',
    restaurantName: 'Pizza Palace',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 450 },
      { name: 'Garlic Bread', quantity: 1, price: 120 }
    ],
    totalAmount: 570,
    orderDate: '2024-01-14T20:00:00',
    deliveryDate: '2024-01-14T21:15:00',
    status: 'delivered',
    rating: 3
  },
  {
    id: 'ORD003',
    restaurantName: 'Chinese Wok',
    items: [
      { name: 'Chicken Fried Rice', quantity: 1, price: 280 },
      { name: 'Spring Rolls', quantity: 1, price: 150 }
    ],
    totalAmount: 430,
    orderDate: '2024-01-13T19:00:00',
    deliveryDate: '2024-01-13T20:30:00',
    status: 'delivered',
    rating: 5,
    review: 'Amazing taste and generous portions!'
  }
];

// Calculate total spent from delivered orders
const totalSpent = mockOrders
  .filter(order => order.status === 'delivered')
  .reduce((total, order) => total + order.totalAmount, 0);

type TabType = 'personal' | 'addresses' | 'preferences' | 'payment' | 'notifications';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('personal');

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

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'addresses', label: 'Delivery Addresses', icon: '📍' },
    { id: 'preferences', label: 'Food Preferences', icon: '🍽️' },
    { id: 'payment', label: 'Payment Methods', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfo />;
      case 'addresses':
        return <DeliveryAddresses />;
      case 'preferences':
        return <FoodPreferences />;
      case 'payment':
        return <PaymentMethods />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <PersonalInfo />;
    }
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
        <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-dark-600 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative self-center sm:self-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-sera-blue to-blue-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-4 border-sera-blue/30">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-dark-800">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse m-auto mt-1"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h2>
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

        {/* Tabs */}
        <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl border border-dark-600 overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="border-b border-dark-600 bg-gradient-to-r from-dark-700 to-dark-600">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
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
