import React, { useState } from 'react';

interface NotificationSettings {
  orderUpdates: boolean;
  promotionalOffers: boolean;
  newRestaurants: boolean;
  priceDrops: boolean;
  deliveryReminders: boolean;
  birthdayOffers: boolean;
  appUpdates: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotionalOffers: true,
    newRestaurants: false,
    priceDrops: true,
    deliveryReminders: true,
    birthdayOffers: true,
    appUpdates: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '08:00'
  });

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleQuietHoursToggle = () => {
    setQuietHours(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setQuietHours(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving notification settings:', { settings, quietHours });
  };

  const notificationCategories = [
    {
      title: 'Order & Delivery',
      description: 'Updates about your food orders and delivery status',
      settings: [
        { key: 'orderUpdates', label: 'Order Status Updates', description: 'Real-time updates on order preparation and delivery' },
        { key: 'deliveryReminders', label: 'Delivery Reminders', description: 'Reminders when your food is on the way' }
      ]
    },
    {
      title: 'Offers & Promotions',
      description: 'Deals, discounts, and promotional offers',
      settings: [
        { key: 'promotionalOffers', label: 'Promotional Offers', description: 'Special deals and discount notifications' },
        { key: 'priceDrops', label: 'Price Drop Alerts', description: 'Notifications when your favorite items go on sale' },
        { key: 'birthdayOffers', label: 'Birthday Offers', description: 'Special offers on your birthday' }
      ]
    },
    {
      title: 'Discover & Explore',
      description: 'New restaurants and menu updates',
      settings: [
        { key: 'newRestaurants', label: 'New Restaurants', description: 'Discover new restaurants in your area' }
      ]
    },
    {
      title: 'App & System',
      description: 'App updates and system notifications',
      settings: [
        { key: 'appUpdates', label: 'App Updates', description: 'Important app updates and new features' }
      ]
    }
  ];

  const deliveryMethods = [
    {
      key: 'pushNotifications',
      label: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: '📱'
    },
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: '📧'
    },
    {
      key: 'smsNotifications',
      label: 'SMS Notifications',
      description: 'Receive notifications via SMS',
      icon: '💬'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
          <p className="text-gray-400 text-sm">Customize how and when you receive notifications</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Save Settings
        </button>
      </div>

      {/* Delivery Methods */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Notification Delivery Methods</h4>
        <div className="space-y-4">
          {deliveryMethods.map((method) => (
            <div key={method.key} className="flex items-center justify-between p-4 bg-dark-600 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{method.icon}</div>
                <div>
                  <h5 className="text-white font-medium">{method.label}</h5>
                  <p className="text-gray-400 text-sm">{method.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[method.key as keyof NotificationSettings]}
                  onChange={() => handleToggle(method.key as keyof NotificationSettings)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sera-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sera-orange"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Categories */}
      <div className="space-y-6">
        {notificationCategories.map((category) => (
          <div key={category.title} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
            <div className="mb-4">
              <h4 className="text-white font-medium">{category.title}</h4>
              <p className="text-gray-400 text-sm">{category.description}</p>
            </div>
            
            <div className="space-y-3">
              {category.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-3 bg-dark-600 rounded-lg">
                  <div className="flex-1">
                    <h5 className="text-white font-medium">{setting.label}</h5>
                    <p className="text-gray-400 text-sm">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings[setting.key as keyof NotificationSettings]}
                      onChange={() => handleToggle(setting.key as keyof NotificationSettings)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-dark-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sera-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sera-orange"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quiet Hours */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-medium">Quiet Hours</h4>
            <p className="text-gray-400 text-sm">Pause notifications during specific hours</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quietHours.enabled}
              onChange={handleQuietHoursToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-dark-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sera-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sera-orange"></div>
          </label>
        </div>
        
        {quietHours.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={quietHours.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={quietHours.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notification Preview */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Notification Preview</h4>
        <div className="space-y-3">
          <div className="p-4 bg-dark-600 rounded-lg border-l-4 border-sera-orange">
            <div className="flex items-start space-x-3">
              <div className="text-sera-orange text-lg">🍕</div>
              <div className="flex-1">
                <h5 className="text-white font-medium">Order Update</h5>
                <p className="text-gray-300 text-sm">Your pizza is being prepared and will be ready in 15 minutes!</p>
                <p className="text-gray-400 text-xs mt-1">2 minutes ago</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-dark-600 rounded-lg border-l-4 border-green-500">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-lg">🎉</div>
              <div className="flex-1">
                <h5 className="text-white font-medium">Special Offer</h5>
                <p className="text-gray-300 text-sm">Get 20% off on your next order! Use code SAVE20</p>
                <p className="text-gray-400 text-xs mt-1">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 text-center">
          <div className="text-2xl font-bold text-sera-orange">24</div>
          <div className="text-gray-400 text-sm">Notifications Today</div>
        </div>
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 text-center">
          <div className="text-2xl font-bold text-green-400">156</div>
          <div className="text-gray-400 text-sm">This Week</div>
        </div>
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 text-center">
          <div className="text-2xl font-bold text-blue-400">89%</div>
          <div className="text-gray-400 text-sm">Read Rate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <h4 className="text-white font-medium mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-dark-600 rounded-lg text-left hover:bg-dark-500 transition-colors duration-200">
            <div className="text-sera-orange text-lg mb-2">🔕</div>
            <h5 className="text-white font-medium">Mute All Notifications</h5>
            <p className="text-gray-400 text-sm">Temporarily pause all notifications</p>
          </button>
          <button className="p-4 bg-dark-600 rounded-lg text-left hover:bg-dark-500 transition-colors duration-200">
            <div className="text-sera-orange text-lg mb-2">📊</div>
            <h5 className="text-white font-medium">Notification History</h5>
            <p className="text-gray-400 text-sm">View your notification history</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
