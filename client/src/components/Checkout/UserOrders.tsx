import { useEffect, useState, useCallback, useMemo } from 'react';
import { Order } from '../../types';
import orderService from '../../services/orderService';
import { Button } from "@/components/ui/button";
import { Package, CreditCard, Calendar } from "lucide-react";
import { toast } from 'sonner';
import LoaderUI from '@/components/LoaderUI';

// Memoized OrderCard component
const OrderCard = ({ order, onCancelOrder }: { order: Order; onCancelOrder: (id: string) => Promise<void> }) => {
  const canCancel = useMemo(() => ['pending', 'processing'].includes(order.orderStatus), [order.orderStatus]);
  
  const statusColor = useMemo(() => {
    switch (order.orderStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [order.orderStatus]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
          <p className="text-sm text-gray-500">
            <Calendar className="inline-block h-4 w-4 mr-1" />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Order Items</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
              <span>Payment: {order.paymentStatus}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Total: </span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          {canCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancelOrder(order._id)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize fetch function
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Memoize cancel handler
  const handleCancelOrder = useCallback(async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  }, [fetchOrders]);

  if (loading) {
    return <LoaderUI />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchOrders}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onCancelOrder={handleCancelOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders; 