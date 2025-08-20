import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose }) => {
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
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        );
      case 'delivery':
        return <MapPin className="w-4 h-4 text-green-500" />;
      case 'promotion':
        return (
          <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case 'review':
        return (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef}
        className="absolute top-full right-0 mt-2 w-96 max-h-[600px] bg-dark-800 rounded-xl shadow-2xl border border-dark-600 z-50 transform transition-all duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
          opacity: isOpen ? 1 : 0
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-dark-600 bg-gradient-to-r from-dark-700 to-dark-800 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sera-blue rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                <p className="text-gray-400 text-xs">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2 py-1 bg-sera-blue/20 text-sera-blue text-xs rounded-lg hover:bg-sera-blue/30 transition-colors"
                >
                  Mark all read
                </button>
              )}
                             <Link
                 to="/notifications"
                 onClick={onClose}
                 className="px-3 py-1 bg-dark-700 text-white text-xs rounded-lg hover:bg-dark-600 transition-colors flex items-center space-x-1"
               >
                 <span>View all</span>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </Link>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-dark-700 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-gray-500" />
              </div>
              <h4 className="text-white font-medium text-sm mb-1">No notifications</h4>
              <p className="text-gray-400 text-xs">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:bg-dark-700/50 mb-2 ${
                    getNotificationColor(notification.type)
                  } ${!notification.isRead ? 'ring-1 ring-sera-blue/20' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-white font-medium text-xs truncate">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-1.5 h-1.5 bg-sera-blue rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-3">
                                                       <span className="text-gray-500 text-xs flex items-center space-x-1">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                             </svg>
                             <span>{notification.timestamp}</span>
                           </span>
                            {notification.amount && (
                              <span className="text-sera-orange text-xs font-medium">
                                {notification.amount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          {notification.action && (
                            <button className="px-2 py-1 bg-sera-blue text-white text-xs rounded hover:bg-blue-600 transition-colors">
                              {notification.action}
                            </button>
                          )}
                                                     {!notification.isRead && (
                             <button
                               onClick={() => markAsRead(notification.id)}
                               className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                               title="Mark as read"
                             >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                               </svg>
                             </button>
                           )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 5 && (
          <div className="p-3 border-t border-dark-600 bg-gradient-to-r from-dark-700 to-dark-800 rounded-b-xl">
            <Link
              to="/notifications"
              onClick={onClose}
              className="w-full text-center text-sera-blue text-sm font-medium hover:text-blue-400 transition-colors"
            >
              View all {notifications.length} notifications
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsDropdown;
