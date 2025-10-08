import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header/Header';
import AuthModals from './components/Auth/AuthModals';
import ChatWidget from './components/Chat/ChatWidget';
import FloatingCartButton from './components/Layout/FloatingCartButton';
import LoadingSpinner from './components/Common/LoadingSpinner';
import { routeConfig } from './config/routeConfig';
import { useSearch } from './hooks/useSearch';
import './index.css';

const AppContent: React.FC = () => {
  const { handleSearch } = useSearch();

  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="min-h-screen bg-dark-900">
        <Header onSearch={handleSearch} />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {routeConfig.map((route, index) => (
              <Route 
                key={index}
                path={route.path} 
                element={route.element} 
              />
            ))}
          </Routes>
        </Suspense>

        <FloatingCartButton />
        <AuthModals />
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