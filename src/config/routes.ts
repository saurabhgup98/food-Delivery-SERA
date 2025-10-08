export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  RESTAURANT: '/restaurant/:id',
  PROFILE: '/profile',
  ORDERS: '/orders',
  FAVORITES: '/favorites',
  NOTIFICATIONS: '/notifications',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  CART: '/cart'
} as const;

export type RouteKey = keyof typeof ROUTES;