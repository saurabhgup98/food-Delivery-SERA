import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingCart, MapPin } from 'lucide-react';
import PrimaryCenteredActionBtn from '../Button/PrimaryCenteredActionBtn';

// Custom SVG Icons
const LogOutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface MenuLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
}

interface UserMenuProps {
  user: {
    username: string;
    email: string;
  };
  onLogout: () => void;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onClose }) => {
  const menuLinks: MenuLink[] = [
    {
      to: '/profile',
      label: 'My Profile',
      icon: <User className="w-4 h-4" />,
      hoverColor: 'hover:bg-sera-blue/20 hover:text-sera-blue'
    },
    {
      to: '/orders',
      label: 'My Orders',
      icon: <ShoppingCart className="w-4 h-4" />,
      hoverColor: 'hover:bg-sera-orange/20 hover:text-sera-orange'
    },
    {
      to: '/favorites',
      label: 'Favorites',
      icon: <Heart className="w-4 h-4" />,
      hoverColor: 'hover:bg-red-500/20 hover:text-red-500'
    },
    {
      to: '/addresses',
      label: 'My Addresses',
      icon: <MapPin className="w-4 h-4" />,
      hoverColor: 'hover:bg-green-500/20 hover:text-green-500'
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <SettingsIcon className="w-4 h-4" />,
      hoverColor: 'hover:bg-gray-500/20 hover:text-gray-400'
    }
  ];

  return (
    <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl shadow-2xl border border-dark-600/50 transition-all duration-300 transform scale-95 backdrop-blur-sm z-[60] opacity-100 visible scale-100">
      {/* Header */}
      <div className="p-4 border-b border-dark-600/50 bg-gradient-to-r from-dark-700/50 to-dark-600/50 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sera-blue to-sera-blue/80 rounded-full flex items-center justify-center border-2 border-sera-blue/30 shadow-lg">
            <span className="text-white font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user.username}</p>
            <p className="text-gray-400 text-xs truncate">{user.email}</p>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Menu Links */}
      <div className="p-2">
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white transition-all duration-200 ${link.hoverColor}`}
          >
            {link.icon}
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Footer - Logout Button */}
      <div className="p-3 border-t border-dark-600/50 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-b-xl">
        <PrimaryCenteredActionBtn
          onClick={onLogout}
          text="Logout"
          size="sm"
          className="w-full bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
          leftIconNode={<LogOutIcon className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};

export default UserMenu;
