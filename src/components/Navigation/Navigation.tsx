import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface NavigationProps {
  isMobile?: boolean;
  onMobileMenuClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  isMobile = false, 
  onMobileMenuClose 
}) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-1 pt-4">
        <Link 
          to="/" 
          className={`flex items-center space-x-3 px-4 py-3 text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg group ${isActive('/') ? 'bg-sera-yellow/20 text-sera-yellow' : 'text-white/90'}`}
          onClick={handleLinkClick}
        >
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive('/') ? 'bg-sera-yellow text-dark-900' : 'bg-white/10 text-white group-hover:bg-sera-yellow group-hover:text-dark-900'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="flex-1">Home</span>
          {isActive('/') && (
            <div className="w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
          )}
        </Link>
        
        <Link 
          to="/explore" 
          className={`flex items-center space-x-3 px-4 py-3 text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg group ${isActive('/explore') ? 'bg-sera-yellow/20 text-sera-yellow' : 'text-white/90'}`}
          onClick={handleLinkClick}
        >
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive('/explore') ? 'bg-sera-yellow text-dark-900' : 'bg-white/10 text-white group-hover:bg-sera-yellow group-hover:text-dark-900'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="flex-1">Explore</span>
          {isActive('/explore') && (
            <div className="w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
          )}
        </Link>
        
        <Link 
          to="/contact"
          className={`flex items-center space-x-3 px-4 py-3 text-white font-medium transition-all duration-300 hover:bg-white/10 rounded-lg group ${isActive('/contact') ? 'bg-sera-yellow/20 text-sera-yellow' : 'text-white/90'}`}
          onClick={handleLinkClick}
        >
          <div className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all duration-300 ${isActive('/contact') ? 'bg-sera-yellow text-dark-900' : 'bg-white/10 text-white group-hover:bg-sera-yellow group-hover:text-dark-900'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="flex-1">Contact Us</span>
          {isActive('/contact') && (
            <div className="w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
          )}
        </Link>
        
        {/* Additional Mobile Menu Items */}
        <div className="border-t border-white/20 mt-2 pt-2">
          <Link 
            to="/cart" 
            className="flex items-center space-x-3 px-4 py-3 text-white/90 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg group"
            onClick={handleLinkClick}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 text-white group-hover:bg-sera-yellow group-hover:text-dark-900 transition-all duration-300">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="flex-1">Cart</span>
            {/* Cart count will be handled by CartIcon component */}
          </Link>
          
          <Link 
            to="/orders" 
            className="flex items-center space-x-3 px-4 py-3 text-white/90 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg group"
            onClick={handleLinkClick}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 text-white group-hover:bg-sera-yellow group-hover:text-dark-900 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="flex-1">My Orders</span>
          </Link>
          
          <Link 
            to="/favorites" 
            className="flex items-center space-x-3 px-4 py-3 text-white/90 font-medium transition-all duration-300 hover:bg-white/10 rounded-lg group"
            onClick={handleLinkClick}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 text-white group-hover:bg-sera-yellow group-hover:text-dark-900 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="flex-1">Favorites</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Desktop Navigation
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <Link 
        to="/" 
        className={`relative px-3 py-1 text-white font-semibold transition-all duration-500 hover:text-sera-yellow group overflow-hidden ${isActive('/') ? 'text-sera-yellow' : 'text-white/95'}`}
      >
        <span className="relative z-10 flex items-center">
          Home
          {isActive('/') && (
            <div className="ml-2 w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
          )}
        </span>
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-sera-yellow/20 to-sera-orange/20 rounded-lg transform transition-all duration-500 ${isActive('/') ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}></div>
        {/* Animated border */}
        <div className={`absolute inset-0 border-2 border-sera-yellow rounded-lg transform transition-all duration-500 ${isActive('/') ? 'scale-100 opacity-100' : 'scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}></div>
        {/* Shimmer effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ${isActive('/') ? 'translate-x-full' : '-translate-x-full group-hover:translate-x-full'}`}></div>
      </Link>
      
      <Link 
        to="/explore" 
        className={`relative px-3 py-1 text-white font-semibold transition-all duration-500 hover:text-sera-yellow group overflow-hidden ${isActive('/explore') ? 'text-sera-yellow' : 'text-white/95'}`}
      >
        <span className="relative z-10 flex items-center">
          Explore
          {isActive('/explore') && (
            <div className="ml-2 w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
          )}
        </span>
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-sera-yellow/20 to-sera-orange/20 rounded-lg transform transition-all duration-500 ${isActive('/explore') ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}></div>
        {/* Animated border */}
        <div className={`absolute inset-0 border-2 border-sera-yellow rounded-lg transform transition-all duration-500 ${isActive('/explore') ? 'scale-100 opacity-100' : 'scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}></div>
        {/* Shimmer effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ${isActive('/explore') ? 'translate-x-full' : '-translate-x-full group-hover:translate-x-full'}`}></div>
      </Link>
      
             <Link 
         to="/contact"
         className={`relative px-3 py-1 text-white font-semibold transition-all duration-500 hover:text-sera-yellow group overflow-hidden ${isActive('/contact') ? 'text-sera-yellow' : 'text-white/95'}`}
       >
        <span className="relative z-10 flex items-center">
          Contact Us
          {isActive('/contact') && (
            <div className="ml-2 w-2 h-2 bg-sera-yellow rounded-full animate-pulse"></div>
          )}
        </span>
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-sera-yellow/20 to-sera-orange/20 rounded-lg transform transition-all duration-500 ${isActive('/contact') ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}></div>
        {/* Animated border */}
        <div className={`absolute inset-0 border-2 border-sera-yellow rounded-lg transform transition-all duration-500 ${isActive('/contact') ? 'scale-100 opacity-100' : 'scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}></div>
                 {/* Shimmer effect */}
         <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-all duration-700 ${isActive('/contact') ? 'translate-x-full' : '-translate-x-full group-hover:translate-x-full'}`}></div>
       </Link>
    </nav>
  );
};

export default Navigation;