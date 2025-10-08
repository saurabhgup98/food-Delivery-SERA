export interface OrderItem {
  itemId: string;
  name: string;
  price: string;
  quantity: number;
  customization?: {
    size?: string;
    spiceLevel?: string;
    addOns?: string[];
  };
  totalPrice: string;
}

export interface Order {
  _id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  deliveryInstructions?: string;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}