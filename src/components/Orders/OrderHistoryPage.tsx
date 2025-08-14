import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService, Order as ApiOrder } from '../../services/api';

interface Order {
  _id: string;
  restaurantName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  rating?: number;
  review?: string;
}

const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getUserOrders();
        
        if (response.success) {
          setOrders(response.data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      default:
        return status;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 pt-12">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-sera-orange to-sera-yellow bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Track and manage your food orders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 border border-dark-600 shadow-xl">
            <div className="text-3xl font-bold text-green-400 mb-1">{orders.filter(o => o.status === 'delivered').length}</div>
            <div className="text-gray-400 text-sm">Delivered Orders</div>
            <div className="w-8 h-1 bg-green-400 rounded-full mt-2"></div>
          </div>
                     <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 border border-dark-600 shadow-xl">
             <div className="text-3xl font-bold text-blue-400 mb-1">{orders.filter(o => ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length}</div>
             <div className="text-gray-400 text-sm">Active Orders</div>
             <div className="w-8 h-1 bg-blue-400 rounded-full mt-2"></div>
           </div>
           <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 border border-dark-600 shadow-xl">
             <div className="text-3xl font-bold bg-gradient-to-r from-sera-orange to-orange-500 bg-clip-text text-transparent mb-1">
               ₹{orders.reduce((sum, order) => sum + order.total, 0)}
             </div>
             <div className="text-gray-400 text-sm">Total Spent</div>
             <div className="w-8 h-1 bg-gradient-to-r from-sera-orange to-orange-500 rounded-full mt-2"></div>
           </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 mb-6 border border-dark-600 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Search Orders
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by restaurant or dish..."
                className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-2 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent text-sm sm:text-base"
              >
                                 <option value="all">All Orders</option>
                 <option value="pending">Pending</option>
                 <option value="confirmed">Confirmed</option>
                 <option value="preparing">Preparing</option>
                 <option value="out_for_delivery">Out for Delivery</option>
                 <option value="delivered">Delivered</option>
                 <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {loading ? (
            <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 sm:p-12 text-center border border-dark-600 shadow-xl">
              <div className="text-6xl mb-4">⏳</div>
              <h4 className="text-white font-medium text-xl mb-2">Loading orders...</h4>
              <p className="text-gray-400 text-sm">Please wait while we fetch your order history</p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 sm:p-12 text-center border border-dark-600 shadow-xl">
              <div className="text-6xl mb-4">❌</div>
              <h4 className="text-white font-medium text-xl mb-2">Error loading orders</h4>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-8 sm:p-12 text-center border border-dark-600 shadow-xl">
              <div className="text-6xl mb-4">📋</div>
              <h4 className="text-white font-medium text-xl mb-2">No orders yet</h4>
              <p className="text-gray-400 text-sm">Start ordering delicious food to see your order history here</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-gradient-to-br from-dark-800 to-dark-700 rounded-2xl p-4 sm:p-6 border border-dark-600 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-white font-medium text-sm sm:text-base">{order.restaurantName}</h4>
                      <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-gray-400 text-xs sm:text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Ordered: {formatDate(order.createdAt)}
                    </div>
                  </div>
                  
                  <div className="text-right mt-2 sm:mt-0">
                    <div className="text-lg sm:text-xl font-bold text-sera-orange">₹{order.total}</div>
                    {order.rating && (
                      <div className="flex items-center justify-end mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs sm:text-sm ${i < order.rating! ? 'text-yellow-400' : 'text-gray-600'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-3 sm:mb-4">
                  <h5 className="text-gray-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Order Items:</h5>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-300">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-400">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review */}
                {order.review && (
                  <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-dark-700 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-300">
                      <span className="font-medium">Your Review:</span> "{order.review}"
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pt-3 sm:pt-4 border-t border-dark-700">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-xs sm:text-sm"
                    >
                      Reorder
                    </button>
                    {!order.rating && (
                      <button
                        onClick={() => handleRateOrder(order)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors duration-200 text-xs sm:text-sm"
                      >
                        Rate & Review
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button className="px-2 sm:px-3 py-1.5 sm:py-2 bg-dark-700 text-white text-xs sm:text-sm rounded hover:bg-dark-600 transition-colors duration-200">
                      Track
                    </button>
                    <button className="px-2 sm:px-3 py-1.5 sm:py-2 bg-dark-700 text-white text-xs sm:text-sm rounded hover:bg-dark-600 transition-colors duration-200">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-lg p-4 sm:p-6 max-w-md w-full">
              <h3 className="text-white font-medium mb-3 sm:mb-4">Rate your order</h3>
              <p className="text-gray-400 text-sm mb-3 sm:mb-4">
                How was your experience with {selectedOrder.restaurantName}?
              </p>
              
              {/* Rating Stars */}
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-xl sm:text-2xl text-yellow-400 hover:scale-110 transition-transform duration-200"
                  >
                    ★
                  </button>
                ))}
              </div>
              
              {/* Review Text */}
              <textarea
                placeholder="Share your experience (optional)"
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sera-orange focus:border-transparent text-sm sm:text-base"
              />
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-sera-orange text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
