// Import all services for the unified API service
import { restaurantService } from './restaurantService';
import { orderService } from './orderService';
import { userService } from './userService';
import { addressService } from './addressService';
import { contactService } from './contactService';
import { locationService } from './locationService';
import { notificationService } from './notificationService';
import { promotionService } from './promotionService';
import { chatService } from './chatService';

// Re-export all types
export * from '../types/restaurant.types';
export * from '../types/order.types';
export * from '../types/address.types';
export * from '../types/common.types';

// Re-export constants
export { API_BASE_URL } from './api/constants';

// Re-export individual services
export { restaurantService } from './restaurantService';
export { orderService } from './orderService';
export { userService } from './userService';
export { addressService } from './addressService';
export { contactService } from './contactService';
export { locationService } from './locationService';
export { notificationService } from './notificationService';
export { promotionService } from './promotionService';
export { chatService } from './chatService';

class ApiService {
  // Restaurant methods
  getRestaurants = restaurantService.getRestaurants.bind(restaurantService);
  getRestaurant = restaurantService.getRestaurant.bind(restaurantService);
  getRestaurantMenu = restaurantService.getRestaurantMenu.bind(restaurantService);
  getRestaurantFoodItems = restaurantService.getRestaurantFoodItems.bind(restaurantService);

  // Order methods
  createOrder = orderService.createOrder.bind(orderService);
  getUserOrders = orderService.getUserOrders.bind(orderService);
  getOrder = orderService.getOrder.bind(orderService);

  // User methods
  completeProfile = userService.completeProfile.bind(userService);
  changePassword = userService.changePassword.bind(userService);

  // Address methods
  getAddresses = addressService.getAddresses.bind(addressService);
  createAddress = addressService.createAddress.bind(addressService);
  updateAddress = addressService.updateAddress.bind(addressService);
  deleteAddress = addressService.deleteAddress.bind(addressService);

  // Contact methods
  submitContactForm = contactService.submitContactForm.bind(contactService);
  getContactSubmissions = contactService.getContactSubmissions.bind(contactService);

  // Location methods
  getCountryCodes = locationService.getCountryCodes.bind(locationService);
  getCountries = locationService.getCountries.bind(locationService);
  getStates = locationService.getStates.bind(locationService);
  getCities = locationService.getCities.bind(locationService);

  // Notification methods
  getNotifications = notificationService.getNotifications.bind(notificationService);
  createNotification = notificationService.createNotification.bind(notificationService);
  updateNotification = notificationService.updateNotification.bind(notificationService);

  // Promotion methods
  createPromoCode = promotionService.createPromoCode.bind(promotionService);
  getPromoCodes = promotionService.getPromoCodes.bind(promotionService);

  // Chat methods
  sendChatMessage = chatService.sendChatMessage.bind(chatService);
}

// Export the unified API service for backward compatibility
export const apiService = new ApiService();