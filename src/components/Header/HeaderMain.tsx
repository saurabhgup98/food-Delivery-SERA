// Libraries
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';

// Components
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Navigation from '../Navigation/Navigation';
import PrimarySearchBar from '../Input/PrimarySearchBar';
import NotificationsDropdown from '../Notification/NotificationsDropdown';
import PrimaryCenteredActionBtn from '../Button/PrimaryCenteredActionBtn';
import PrimaryActionBtn from '../Button/PrimaryActionBtn';
import CartModal from '../Cart/CartModal';
import UserMenu from './UserMenu';

import { BtnConfig } from '../../Style';
import {
  getUserInitial,
  getNotificationButtonProps,
  getCartButtonProps,
  getUserProfileButtonProps,
  getHeaderSearchBarProps,
  getAuthButtonConfigs
} from './HeaderConfig';
import BrandNameAndLogo from '../common/BrandNameAndLogo';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const HeaderMain: React.FC<HeaderProps> = ({
  onSearch
}) => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isLoading, logout, openLoginModal, openSignupModal } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close UserMenu Dropdown when clicking outside the drodpown container if it is open 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Navigate to explore page with search query
      navigate(`/explore?search=${encodeURIComponent(query.trim())}`);
    }
    onSearch?.(query);
  };

  const handleLogout = () => {
    logout(); // Uses Logout function from AuthContext to logout the user and clear the user data from the local storage
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileDropdownOpen(false);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const totalCartItems = cartState.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-sera-pink to-sera-orange shadow-lg sticky top-0 z-50 box-border h-16 py-[14px]">
      <div className="max-w-full mx-auto px-4 sm:px-2 lg:px-14 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left Side - Logo, Brand Name, and Navigation */}
          <div className="flex items-center space-x-8 h-full">
            {/* Logo and Brand */}
            <BrandNameAndLogo />

            {/* Desktop Navigation */}
            <Navigation />
          </div>

          {/* Right Side - Search Bar and Actions */}
          <div className="flex items-center space-x-6 h-full">
            {/* Search Bar */}
            <div className="hidden lg:flex w-68 h-full">
              <PrimarySearchBar
                {...getHeaderSearchBarProps(handleSearch)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 h-full">
              {/* Location */}
              <div className="hidden sm:flex items-center space-x-1 text-white/80 hover:text-white cursor-pointer transition-colors px-1 py-1 rounded-lg hover:bg-white/10">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Deliver to</span>
              </div>

              <div className="relative h-full">
                <PrimaryActionBtn
                  {...getNotificationButtonProps(handleNotificationsToggle)}
                />

                <NotificationsDropdown
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              </div>

              <PrimaryActionBtn
                {...getCartButtonProps(handleCartClick, totalCartItems)}
              />

              {/* User Menu / Auth Buttons */}
              {isLoading ? (
                // Show loading skeleton while checking authentication
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="hidden sm:block w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div ref={profileDropdownRef} className="relative group h-full">
                  <div className="flex items-center space-x-2 h-full">
                    <PrimaryActionBtn
                      {...getUserProfileButtonProps(
                        () => {
                          setIsProfileDropdownOpen(!isProfileDropdownOpen);
                        },
                        getUserInitial(user.username), user.username
                      )}
                    />
                  </div>

                  {/* User Menu */}
                  {isProfileDropdownOpen && (
                    <UserMenu
                      user={user}
                      onLogout={handleLogout}
                      onClose={() => setIsProfileDropdownOpen(false)}
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {getAuthButtonConfigs(openLoginModal, openSignupModal).map((btnConfig, index) => (
                    <PrimaryCenteredActionBtn
                      key={index}
                      {...btnConfig}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar and Menu Button */}
        <div className="lg:hidden pb-4">
          <div className="flex items-center space-x-4">
            {/* Reduced Search Bar */}
            <div className="flex-1 max-w-xs">
              <PrimarySearchBar
                {...getHeaderSearchBarProps(handleSearch)}
              />
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors ml-4"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 bg-gradient-to-r from-sera-pink to-sera-orange -mx-4 sm:-mx-2 lg:-mx-14 px-4 sm:px-2 lg:px-14">
            <Navigation
              isMobile={true}
              onMobileMenuClose={() => setIsMobileMenuOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </header>
  );
};

export default HeaderMain;