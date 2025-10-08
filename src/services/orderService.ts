import { ApiClient } from './base/apiClient';
import { 
  Order, 
  CreateOrderRequest, 
  OrderResponse, 
  OrdersResponse 
} from '../types/order.types';

export class OrderService extends ApiClient {
  // Create a new order
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Get user's orders
  async getUserOrders(params?: {
    status?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
  }): Promise<OrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest<OrdersResponse>(endpoint);
  }

  // Get a specific order by ID
  async getOrder(orderId: string): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>(`/orders/${orderId}`);
  }
}

export const orderService = new OrderService();
