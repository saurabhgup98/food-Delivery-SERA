import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useSearch } from "../hooks/useSearch";
import HeaderMain from "../components/Header/HeaderMain";
import FloatingCartButton from "../components/Layout/FloatingCartButton";
import ChatWidget from "../components/Chat/ChatWidget";
import AuthModals from "../components/Auth/components/AuthModals";
import CartModal from "../components/Cart/CartModal";
import { AppRoutes } from "./AppRoutes";
import { AppProviders } from "./providers";
import "../index.css";

const CartModalWrapper: React.FC = () => {
  const { isModalOpen, closeModal } = useCart();
  return <CartModal isOpen={isModalOpen} onClose={closeModal} />;
};

const AppContent: React.FC = () => {
  const { handleSearch } = useSearch();

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-dark-900">
        <HeaderMain onSearch={handleSearch} />
        <AppRoutes />
        <FloatingCartButton />
        <CartModalWrapper />
        <AuthModals />
        <ChatWidget />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
