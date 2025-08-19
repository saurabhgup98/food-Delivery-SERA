import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

interface Order {
  id: string;
  restaurantName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'delivered' | 'cancelled' | 'in-progress';
  rating?: number;
  review?: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getUserOrders({ limit: 100 });
        if (response.success) {
          // Transform API orders to match our interface
          const transformedOrders: Order[] = response.data.orders.map((apiOrder: any) => ({
            id: apiOrder._id,
            restaurantName: apiOrder.restaurantName,
            items: apiOrder.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: parseFloat(item.price)
            })),
            totalAmount: apiOrder.total,
            orderDate: apiOrder.createdAt,
            deliveryDate: apiOrder.status === 'delivered' ? apiOrder.updatedAt : null,
            status: apiOrder.status === 'delivered' ? 'delivered' : 
                   apiOrder.status === 'cancelled' ? 'cancelled' : 'in-progress',
            rating: undefined, // API doesn't have ratings yet
            review: undefined
          }));
          setOrders(transformedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data
        setOrders([
          {
            id: 'ORD001',
            restaurantName: 'Spice Garden',
            items: [
              { name: 'Butter Chicken', quantity: 1, price: 350 },
              { name: 'Naan', quantity: 2, price: 30 },
              { name: 'Dal Makhani', quantity: 1, price: 180 }
            ],
            totalAmount: 590,
            orderDate: '2024-01-15T18:30:00',
            deliveryDate: '2024-01-15T19:45:00',
            status: 'delivered',
            rating: 4,
            review: 'Great food and fast delivery!'
          },
          {
            id: 'ORD002',
            restaurantName: 'Pizza Palace',
            items: [
              { name: 'Margherita Pizza', quantity: 1, price: 450 },
              { name: 'Garlic Bread', quantity: 1, price: 120 }
            ],
            totalAmount: 570,
            orderDate: '2024-01-14T20:00:00',
            deliveryDate: '2024-01-14T21:15:00',
            status: 'delivered',
            rating: 3
          },
          {
            id: 'ORD003',
            restaurantName: 'Chinese Wok',
            items: [
              { name: 'Chicken Fried Rice', quantity: 1, price: 280 },
              { name: 'Spring Rolls', quantity: 1, price: 150 }
            ],
            totalAmount: 430,
            orderDate: '2024-01-13T19:00:00',
            deliveryDate: '2024-01-13T20:30:00',
            status: 'delivered',
            rating: 5,
            review: 'Amazing taste and generous portions!'
          },
          {
            id: 'ORD004',
            restaurantName: 'Royal Darbar',
            items: [
              { name: 'Biryani', quantity: 1, price: 450 },
              { name: 'Raita', quantity: 1, price: 80 }
            ],
            totalAmount: 530,
            orderDate: '2024-01-12T19:30:00',
            deliveryDate: '2024-01-12T20:45:00',
            status: 'delivered',
            rating: 4
          },
          {
            id: 'ORD005',
            restaurantName: 'Thai Delight',
            items: [
              { name: 'Pad Thai', quantity: 1, price: 380 },
              { name: 'Tom Yum Soup', quantity: 1, price: 220 }
            ],
            totalAmount: 600,
            orderDate: '2024-01-11T20:00:00',
            deliveryDate: '2024-01-11T21:15:00',
            status: 'delivered',
            rating: 5
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReorder = (order: Order) => {
    // TODO: Implement reorder functionality
    console.log('Reordering:', order);
  };

  const handleRateOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Order History</h3>
            <p className="text-gray-400 text-sm">View and manage your past orders</p>
          </div>
        </div>
        <div className="bg-dark-700 rounded-lg p-8 text-center border border-dark-600">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-sera-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Order History</h3>
          <p className="text-gray-400 text-sm">View and manage your past orders</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-sera-orange">{orders.length}</div>
          <div className="text-sm text-gray-400">Total Orders</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant or dish..."
              className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="in-progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Quick Stats */}
          <div className="flex items-end">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="text-xs text-gray-400">Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {orders.filter(o => o.status === 'in-progress').length}
                </div>
                <div className="text-xs text-gray-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">
                  {orders.filter(o => o.status === 'cancelled').length}
                </div>
                <div className="text-xs text-gray-400">Cancelled</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-dark-700 rounded-lg p-8 text-center border border-dark-600">
            <div className="text-4xl mb-4">📋</div>
            <h4 className="text-white font-medium mb-2">No orders found</h4>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-dark-700 rounded-lg p-6 border border-dark-600">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-medium">{order.restaurantName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-gray-400 text-sm">#{order.id}</span>
                  </div>
                  
                  <div className="text-gray-400 text-sm">
                    Ordered: {formatDate(order.orderDate)}
                    {order.deliveryDate && (
                      <span className="ml-4">Delivered: {formatDate(order.deliveryDate)}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-sera-orange">₹{order.totalAmount}</div>
                  {order.rating && (
                    <div className="flex items-center justify-end mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < order.rating! ? 'text-yellow-400' : 'text-gray-600'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h5 className="text-gray-300 font-medium mb-2">Order Items:</h5>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-400">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review */}
              {order.review && (
                <div className="mb-4 p-3 bg-dark-600 rounded-lg">
                  <div className="text-sm text-gray-300">
                    <span className="font-medium">Your Review:</span> "{order.review}"
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-600">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm"
                  >
                    Reorder
                  </button>
                  {!order.rating && (
                    <button
                      onClick={() => handleRateOrder(order)}
                      className="px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200 text-sm"
                    >
                      Rate & Review
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200">
                    Track
                  </button>
                  <button className="px-3 py-1 bg-dark-600 text-white text-sm rounded hover:bg-dark-500 transition-colors duration-200">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white font-medium mb-4">Rate your order</h3>
            <p className="text-gray-400 text-sm mb-4">
              How was your experience with {selectedOrder.restaurantName}?
            </p>
            
            {/* Rating Stars */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-2xl text-yellow-400 hover:scale-110 transition-transform duration-200"
                >
                  ★
                </button>
              ))}
            </div>
            
            {/* Review Text */}
            <textarea
              placeholder="Share your experience (optional)"
              rows={3}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent"
            />
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
