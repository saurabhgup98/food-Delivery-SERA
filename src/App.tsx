import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import AuthModals from './components/Auth/AuthModals';
import ContactForm from './components/Contact/ContactForm';
import ExplorePage from './components/Explore/ExplorePage';
import RestaurantDetail from './components/Restaurant/RestaurantDetail';
import './index.css';

const App: React.FC = () => {
  // Mock data for demonstration
  const mockUser = null; // Change to user object when logged in
  const cartItemCount = 0;

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-dark-900">
            <Header 
              user={mockUser} 
              cartItemCount={cartItemCount}
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
              <Route path="/profile" element={<div className="p-8 text-center text-white">Profile Page - Coming Soon</div>} />
              <Route path="/favorites" element={<div className="p-8 text-center text-white">Favorites Page - Coming Soon</div>} />
            </Routes>

            {/* Auth Modals */}
            <AuthModals />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
