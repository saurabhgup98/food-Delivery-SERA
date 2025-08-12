import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
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

interface HeaderProps {
  user?: UserType | null;
  cartItemCount?: number;
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  cartItemCount = 0, 
  onSearch 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openLoginModal, openSignupModal } = useAuth();

  const handleSearch = (query: string) => {
    onSearch?.(query);
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
            <Navigation cartItemCount={cartItemCount} />
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
              <Link 
                to="/cart" 
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-sera-yellow rounded-full text-xs flex items-center justify-center text-dark-900 font-bold animate-bounce-gentle">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu / Auth Buttons */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-xl border border-dark-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/favorites" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                      >
                        Favorites
                      </Link>
                      <hr className="border-dark-600 my-1" />
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 transition-colors">
                        Logout
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
               cartItemCount={cartItemCount} 
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
