import React, { useState, useEffect } from 'react';
import { Bell, X, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'security' | 'registration' | 'review' | 'promo' | 'birthday';
  isRead: boolean;
  action: 'none' | 'rate' | 'use_code' | 'view_order';
  orderId?: string;
  promoCode?: string;
  expiresAt?: string;
  sentEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'security' | 'promo'>('all');

  // Fetch notifications on component mount
  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  const fetchNotifications = async () => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const response = await apiService.getNotifications(user._id);
      if (response.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiService.updateNotification(id, { isRead: true });
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notification => 
          apiService.updateNotification(notification._id, { isRead: true })
        )
      );
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification._id !== id));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'security':
        return notifications.filter(n => n.type === 'security');
      case 'promo':
        return notifications.filter(n => n.type === 'promo' || n.type === 'birthday');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'security':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'registration':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'review':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'promo':
        return (
          <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case 'birthday':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'border-l-red-500 bg-red-500/5';
      case 'registration':
        return 'border-l-green-500 bg-green-500/5';
      case 'review':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'promo':
        return 'border-l-pink-500 bg-pink-500/5';
      case 'birthday':
        return 'border-l-purple-500 bg-purple-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-sera-blue to-sera-darkBlue rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-white/80 text-sm">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-dark-800 rounded-xl p-2 mb-6 border border-dark-700">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'security', label: 'Security', count: notifications.filter(n => n.type === 'security').length },
              { key: 'promo', label: 'Offers', count: notifications.filter(n => n.type === 'promo' || n.type === 'birthday').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? 'bg-sera-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      filter === tab.key ? 'bg-white/20' : 'bg-dark-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sera-blue mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading notifications...</p>
            </div>
          ) : getFilteredNotifications().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-dark-800 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
              <p className="text-gray-400">
                {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            getFilteredNotifications().map((notification) => (
              <div
                key={notification._id}
                className={`bg-dark-800 rounded-xl p-4 border-l-4 transition-all duration-200 hover:bg-dark-700/50 ${
                  getNotificationColor(notification.type)
                } ${!notification.isRead ? 'ring-2 ring-sera-blue/20' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-semibold text-sm">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-sera-blue rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500 text-xs flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatTimestamp(notification.createdAt)}</span>
                          </span>
                          {notification.promoCode && (
                            <span className="text-sera-orange text-xs font-medium">
                              {notification.promoCode}
                            </span>
                          )}
                          {notification.orderId && (
                            <span className="text-gray-500 text-xs">
                              {notification.orderId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {notification.action !== 'none' && (
                          <button className="px-3 py-1 bg-sera-blue text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                            {notification.action === 'use_code' ? 'Use Code' : 
                             notification.action === 'rate' ? 'Rate Now' : 
                             notification.action === 'view_order' ? 'View Order' : notification.action}
                          </button>
                        )}
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                            title="Mark as read"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{notifications.length}</div>
              <div className="text-gray-400 text-sm">Total Notifications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sera-blue mb-1">{unreadCount}</div>
              <div className="text-gray-400 text-sm">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {notifications.filter(n => n.type === 'security').length}
              </div>
              <div className="text-gray-400 text-sm">Security Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
