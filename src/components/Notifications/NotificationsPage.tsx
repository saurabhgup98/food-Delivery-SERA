import React, { useState } from 'react';
import { Bell, Check, X, Clock, Star, MapPin, ShoppingBag, Gift, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'delivery' | 'review';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  action?: string;
  orderId?: string;
  amount?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Confirmed! 🎉',
      message: 'Your order #ORD-2024-001 has been confirmed and is being prepared.',
      timestamp: '2 minutes ago',
      isRead: false,
      icon: '📦',
      action: 'Track Order',
      orderId: 'ORD-2024-001'
    },
    {
      id: '2',
      type: 'delivery',
      title: 'Your order is on the way! 🚚',
      message: 'Order #ORD-2024-002 is out for delivery. Expected arrival: 25-30 minutes.',
      timestamp: '15 minutes ago',
      isRead: false,
      icon: '🚚',
      action: 'Track Delivery',
      orderId: 'ORD-2024-002'
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Special Offer! 🎁',
      message: 'Get 20% off on your next order. Use code: SERA20. Valid until tomorrow.',
      timestamp: '1 hour ago',
      isRead: true,
      icon: '🎁',
      action: 'Use Code'
    },
    {
      id: '4',
      type: 'review',
      title: 'Rate your recent order ⭐',
      message: 'How was your experience with Spice Garden? Share your feedback!',
      timestamp: '2 hours ago',
      isRead: true,
      icon: '⭐',
      action: 'Rate Now',
      orderId: 'ORD-2024-003'
    },
    {
      id: '5',
      type: 'system',
      title: 'Payment Successful 💳',
      message: 'Payment of ₹450 has been processed successfully for order #ORD-2024-004.',
      timestamp: '3 hours ago',
      isRead: true,
      icon: '💳',
      amount: '₹450',
      orderId: 'ORD-2024-004'
    },
    {
      id: '6',
      type: 'promotion',
      title: 'New Restaurant Added! 🍕',
      message: 'Pizza Palace is now available in your area. Try their signature Margherita!',
      timestamp: '5 hours ago',
      isRead: true,
      icon: '🍕',
      action: 'Explore Menu'
    },
    {
      id: '7',
      type: 'delivery',
      title: 'Order Delivered! ✅',
      message: 'Your order #ORD-2024-005 has been delivered successfully. Enjoy your meal!',
      timestamp: '1 day ago',
      isRead: true,
      icon: '✅',
      orderId: 'ORD-2024-005'
    },
    {
      id: '8',
      type: 'system',
      title: 'Account Update 🔒',
      message: 'Your account security has been updated. Login from a new device.',
      timestamp: '2 days ago',
      isRead: true,
      icon: '🔒',
      action: 'Review Activity'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'promotions'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'orders':
        return notifications.filter(n => n.type === 'order' || n.type === 'delivery');
      case 'promotions':
        return notifications.filter(n => n.type === 'promotion');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case 'delivery':
        return <MapPin className="w-5 h-5 text-green-500" />;
      case 'promotion':
        return <Gift className="w-5 h-5 text-pink-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'border-l-blue-500 bg-blue-500/5';
      case 'delivery':
        return 'border-l-green-500 bg-green-500/5';
      case 'promotion':
        return 'border-l-pink-500 bg-pink-500/5';
      case 'review':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'system':
        return 'border-l-gray-500 bg-gray-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
              { key: 'orders', label: 'Orders', count: notifications.filter(n => n.type === 'order' || n.type === 'delivery').length },
              { key: 'promotions', label: 'Offers', count: notifications.filter(n => n.type === 'promotion').length }
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
          {getFilteredNotifications().length === 0 ? (
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
                key={notification.id}
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
                            <Clock className="w-3 h-3" />
                            <span>{notification.timestamp}</span>
                          </span>
                          {notification.amount && (
                            <span className="text-sera-orange text-xs font-medium">
                              {notification.amount}
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
                        {notification.action && (
                          <button className="px-3 py-1 bg-sera-blue text-white text-xs rounded-lg hover:bg-blue-600 transition-colors">
                            {notification.action}
                          </button>
                        )}
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
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
                {notifications.filter(n => n.type === 'order' || n.type === 'delivery').length}
              </div>
              <div className="text-gray-400 text-sm">Order Updates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
