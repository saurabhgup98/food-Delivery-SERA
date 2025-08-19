import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import AuthModals from './components/Auth/AuthModals';
import ContactForm from './components/Contact/ContactForm';
import ExplorePage from './components/Explore/ExplorePage';
import FavoritesPage from './components/Favorites/FavoritesPage';
import RestaurantDetail from './components/Restaurant/RestaurantDetail';
import CartModal from './components/Cart/CartModal';
import ProfilePage from './components/Profile/ProfilePage';
import OrderHistoryPage from './components/Orders/OrderHistoryPage';
import ChatWidget from './components/Chat/ChatWidget';
import { useCart } from './contexts/CartContext';
import './index.css';

const AppContent: React.FC = () => {
  const { state: cartState } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Header 
          onSearch={handleSearch}
        />
        
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/contact" element={<ContactForm isOpen={true} onClose={() => window.history.back()} />} />
          <Route path="/login" element={<div className="p-8 text-center text-white">Login Page - Coming Soon</div>} />
          <Route path="/register" element={<div className="p-8 text-center text-white">Register Page - Coming Soon</div>} />
          <Route path="/cart" element={<div className="p-8 text-center text-white">Cart Page - Coming Soon</div>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>

        {/* Global Floating Cart Button */}
        {cartState.totalItems > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-16 h-16 bg-gradient-to-r from-sera-blue to-sera-blue/90 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group border-2 border-white/20"
            >
              <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-sera-orange to-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
                {cartState.totalItems}
              </div>
              {/* Cart total amount tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-dark-800 text-white text-sm rounded-lg shadow-lg border border-dark-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <span>Total:</span>
                  <span className="font-bold text-sera-orange">₹{cartState.totalAmount}</span>
                </div>
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-800"></div>
              </div>
            </button>
          </div>
        )}

        {/* Global Cart Modal */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />

        {/* Auth Modals */}
        <AuthModals />
        
        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
