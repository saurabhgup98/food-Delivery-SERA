import React from 'react';
import { CheckCircle, Clock, MapPin } from 'lucide-react';
import { Order } from '../../services/api';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatOrderTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'confirmed':
        return 'text-blue-400';
      case 'preparing':
        return 'text-orange-400';
      case 'out_for_delivery':
        return 'text-purple-400';
      case 'delivered':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Your Food';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-800 rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 text-center border-b border-dark-700">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-400 text-sm">
            Your order has been confirmed and is being prepared
          </p>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-4">
          {/* Order ID */}
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Order ID</span>
              <span className="text-white font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          {/* Restaurant */}
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sera-blue/20 rounded-lg flex items-center justify-center">
                <span className="text-sera-blue font-bold text-sm">🍽️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{order.restaurantName}</h3>
                <p className="text-gray-400 text-sm">{order.items.length} items</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className={`w-5 h-5 ${getStatusColor(order.status)}`} />
              <div className="flex-1">
                <p className={`font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </p>
                <p className="text-gray-400 text-sm">
                  Estimated delivery: {order.estimatedDeliveryTime}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Delivery Address</p>
                <p className="text-gray-400 text-sm">{order.deliveryAddress}</p>
                {order.deliveryInstructions && (
                  <p className="text-gray-500 text-xs mt-1 italic">
                    "{order.deliveryInstructions}"
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-dark-700 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-white">
                    ₹{item.customization?.totalPrice || parseInt(item.price.replace('₹', '')) * item.quantity}
                  </span>
                </div>
              ))}
              <div className="border-t border-dark-600 pt-2 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery Fee</span>
                  <span className="text-white">
                    {order.deliveryFee === 0 ? 'Free' : `₹${order.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-dark-600">
                  <span className="text-white">Total</span>
                  <span className="text-sera-orange">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-700">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-dark-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-dark-600 transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                // TODO: Navigate to orders page
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-sera-blue to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
