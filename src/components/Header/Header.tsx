import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Menu, 
  X,
  MapPin,
  Bell
} from 'lucide-react';
import { User as UserType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../Navigation/Navigation';
import SearchBar from '../SearchBar/SearchBar';
import { CartIcon } from '../Cart';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isLoading, openLoginModal, openSignupModal, logout } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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
    logout();
    // Navigate to home page after logout
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const handleProfileOptionClick = () => {
    setIsProfileDropdownOpen(false);
  };

  // Get first letter of user's name for profile circle
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-sera-pink to-sera-orange shadow-lg sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-2 lg:px-14">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo, Brand Name, and Navigation */}
          <div className="flex items-center space-x-8 ">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2 group">
              {/* SERA Logo - Scooter Delivery Icon */}
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {/* Scooter Icon */}
                  <div className="relative w-6 h-6">
                    {/* Scooter body */}
                    <div className="absolute bottom-0 left-0 w-4 h-2 bg-sera-blue rounded-full"></div>
                    {/* Scooter handle */}
                    <div className="absolute top-0 right-0 w-1 h-3 bg-sera-blue rounded-full"></div>
                    {/* Delivery box */}
                    <div className="absolute bottom-1 right-1 w-2 h-1.5 bg-sera-yellow rounded-sm"></div>
                    {/* Person */}
                    <div className="absolute top-1 left-1 w-1 h-1.5 bg-sera-orange rounded-full"></div>
                  </div>
                </div>
                {/* Animated delivery trail */}
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
              </div>
              
              {/* Brand Name */}
              <div className="hidden sm:block mr-6">
                <h1 className="text-white font-display font-bold text-xl">
                  <span className="text-white">SERA</span>
                  <span className="text-sera-yellow"> FOOD</span>
                </h1>
                <p className="text-xs text-white/80 font-medium">DELIVERY</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <Navigation />
          </div>

          {/* Right Side - Search Bar and Actions */}
          <div className="flex items-center space-x-12">
            {/* Search Bar */}
            <div className="hidden lg:flex w-68">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Location */}
              <div className="hidden sm:flex items-center space-x-1 text-white/80 hover:text-white cursor-pointer transition-colors px-1 py-1 rounded-lg hover:bg-white/10">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Deliver to</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-sera-yellow rounded-full text-xs flex items-center justify-center text-dark-900 font-bold">
                  3
                </span>
              </button>

              {/* Cart */}
              <CartIcon />

              {/* User Menu / Auth Buttons */}
              {isLoading ? (
                // Show loading skeleton while checking authentication
                <div className="flex items-center space-x-2 p-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="hidden sm:block w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <div className="relative group">
                  <button 
                    className="flex items-center space-x-2 p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    }}
                  >
                    {/* User Profile Circle with First Letter */}
                    <div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center border-2 border-white/40 hover:border-white/60 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <span className="text-white font-bold text-sm">
                        {getUserInitial(user.name)}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  </button>
                  
                  {/* Enhanced Dropdown Menu */}
                  <div 
                    className={`absolute right-0 mt-3 w-64 bg-gradient-to-br from-dark-800 to-dark-900 rounded-xl shadow-2xl border border-dark-600/50 transition-all duration-300 transform scale-95 backdrop-blur-sm z-[60] ${
                      isProfileDropdownOpen 
                        ? 'opacity-100 visible scale-100' 
                        : 'opacity-0 invisible scale-95'
                    }`}
                    ref={profileDropdownRef}
                  >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-dark-600/50 bg-gradient-to-r from-dark-700/50 to-dark-600/50 rounded-t-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-sera-blue to-sera-blue/80 rounded-full flex items-center justify-center border-2 border-sera-blue/30 shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {getUserInitial(user.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-gray-400 text-xs truncate">{user.email}</p>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-green-400 text-xs font-medium">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-gradient-to-r hover:from-sera-blue/20 hover:to-sera-blue/10 hover:text-white rounded-lg transition-all duration-200 group/item"
                        onClick={handleProfileOptionClick}
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-sera-blue to-sera-blue/80 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="font-medium">Profile</span>
                      </Link>
                      
                      <Link 
                        to="/orders" 
                        className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-gradient-to-r hover:from-sera-orange/20 hover:to-sera-orange/10 hover:text-white rounded-lg transition-all duration-200 group/item"
                        onClick={handleProfileOptionClick}
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-sera-orange to-sera-orange/80 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="font-medium">My Orders</span>
                      </Link>
                      
                      <Link 
                        to="/favorites" 
                        className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-pink-500/10 hover:text-white rounded-lg transition-all duration-200 group/item"
                        onClick={handleProfileOptionClick}
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Favorites</span>
                      </Link>

                      <Link 
                        to="/settings" 
                        className="flex items-center space-x-3 px-3 py-2.5 text-gray-300 hover:bg-gradient-to-r hover:from-gray-500/20 hover:to-gray-500/10 hover:text-white rounded-lg transition-all duration-200 group/item"
                        onClick={handleProfileOptionClick}
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Settings</span>
                      </Link>
                    </div>

                    {/* Logout Section */}
                    <div className="p-2 border-t border-dark-600/50 bg-gradient-to-r from-dark-700/30 to-dark-600/30 rounded-b-xl">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-3 py-2.5 text-red-400 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/10 hover:text-red-300 rounded-lg transition-all duration-200 w-full group/item"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={openLoginModal}
                    className="btn-secondary text-sm px-2 py-2"
                  >
                    Login
                  </button>
                  <button 
                    onClick={openSignupModal}
                    className="btn-accent text-sm px-2 py-2"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

                 {/* Mobile Search Bar */}
         <div className="lg:hidden pb-4">
           <SearchBar onSearch={handleSearch} />
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
    </header>
  );
};

export default Header;
