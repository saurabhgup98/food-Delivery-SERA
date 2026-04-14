import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import { ComingSoonPage } from './common/ComingSoonPage';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const ExplorePage = lazy(() => import('../pages/explore'));
const RestaurantDetail = lazy(() => import('../components/Restaurant/RestaurantDetail'));
const ContactForm = lazy(() => import('../components/Contact/ContactForm'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const OrderHistoryPage = lazy(() => import('../components/Order/OrderHistoryPage'));
const NotificationsPage = lazy(() => import('../components/Notification/NotificationsPage'));

// Route configuration
export const routeConfig = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    exact: true,
  },
  {
    path: ROUTES.EXPLORE,
    element: <ExplorePage />,
  },
  {
    path: ROUTES.RESTAURANT,
    element: <RestaurantDetail />,
  },
  {
    path: ROUTES.CONTACT,
    element: <ContactForm isOpen={true} onClose={() => window.history.back()} />,
  },
  {
    path: ROUTES.LOGIN,
    element: <ComingSoonPage title="Login Page" />,
  },
  {
    path: ROUTES.REGISTER,
    element: <ComingSoonPage title="Register Page" />,
  },
  {
    path: ROUTES.CART,
    element: <ComingSoonPage title="Cart Page" />,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: ROUTES.ORDERS,
    element: <OrderHistoryPage />,
  },
  {
    path: ROUTES.FAVORITES,
    element: <Navigate to="/explore?mode=favorites" replace />,
  },
  {
    path: ROUTES.NOTIFICATIONS,
    element: <NotificationsPage />,
  },
];

