import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Using SVG icons instead of lucide-react to avoid import issues

const HeroSection: React.FC = () => {
  const { openSignupModal } = useAuth();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900/90 via-dark-800/80 to-sera-pink/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900240-9f452e3e5b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
              <span className="text-gradient">SERA</span>
              <br />
              <span className="text-white">FOOD DELIVERY</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Taste the Convenience: Food, Fast and Delivered to Your Doorstep
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-sera-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
              <span className="text-sm font-medium">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-sera-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="text-sm font-medium">Best Restaurants</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-sera-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="text-sm font-medium">Wide Coverage</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/explore" 
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <span>Explore Restaurants</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </Link>
            <button 
              onClick={openSignupModal}
              className="btn-secondary text-lg px-8 py-4"
            >
              Join SERA
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-sera-pink mb-2">500+</div>
              <div className="text-sm text-gray-400">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-sera-blue mb-2">10K+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-sera-orange mb-2">50K+</div>
              <div className="text-sm text-gray-400">Orders Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-sera-yellow mb-2">4.8★</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Food Icons */}
        <div className="absolute top-20 left-10 animate-bounce-gentle">
          <div className="w-16 h-16 bg-sera-pink/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🍕</span>
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <div className="w-12 h-12 bg-sera-blue/20 rounded-full flex items-center justify-center">
            <span className="text-xl">🍔</span>
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
          <div className="w-14 h-14 bg-sera-orange/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">🍜</span>
          </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <div className="w-10 h-10 bg-sera-yellow/20 rounded-full flex items-center justify-center">
            <span className="text-lg">🍣</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
