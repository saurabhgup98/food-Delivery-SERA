import { lazy } from 'react';
import { ROUTES } from './routes';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const ExplorePage = lazy(() => import('../pages/explore'));
const RestaurantDetail = lazy(() => import('../components/Restaurant/RestaurantDetail'));
const ContactForm = lazy(() => import('../components/Contact/ContactForm'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const OrderHistoryPage = lazy(() => import('../components/Orders/OrderHistoryPage'));
const FavoritesPage = lazy(() => import('../components/Favorites/FavoritesPage'));
const NotificationsPage = lazy(() => import('../components/Notifications/NotificationsPage'));

// Simple coming soon component
const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
      <p className="text-gray-400">Coming Soon</p>
    </div>
  </div>
);

// Route configuration
export const routeConfig = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    exact: true
  },
    {
      path: ROUTES.EXPLORE,
      element: <ExplorePage />
    },
  {
    path: ROUTES.RESTAURANT,
    element: <RestaurantDetail />
  },
  {
    path: ROUTES.CONTACT,
    element: <ContactForm isOpen={true} onClose={() => window.history.back()} />
  },
  {
    path: ROUTES.LOGIN,
    element: <ComingSoonPage title="Login Page" />
  },
  {
    path: ROUTES.REGISTER,
    element: <ComingSoonPage title="Register Page" />
  },
  {
    path: ROUTES.CART,
    element: <ComingSoonPage title="Cart Page" />
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />
  },
  {
    path: ROUTES.ORDERS,
    element: <OrderHistoryPage />
  },
  {
    path: ROUTES.FAVORITES,
    element: <FavoritesPage />
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <NotificationsPage />
  }
];
