import { useEffect, useState } from 'react';
import { Order } from '../../types';
import orderService from '../../services/orderService';
import { Button } from "@/components/ui/button";
import { Package, CreditCard, Calendar, Trash2, User, Phone, MapPin, StickyNote } from "lucide-react";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed';

const OrderAdmin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      await orderService.updatePaymentStatus(orderId, newStatus);
      toast.success('Payment status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await orderService.deleteOrder(orderId);
      toast.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
                  <p className="text-sm text-gray-500">
                    <Calendar className="inline-block h-4 w-4 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Customer: {order.userId.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Shipping Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Receiver:</span> {order.receiverName}</p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{order.phoneNumber}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{order.address}</span>
                    </p>
                    {order.note && (
                      <p className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        <span>{order.note}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Method:</span> {order.paymentMethod.toUpperCase()}</p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Total:</span> ${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                        {item.color && <p className="text-gray-500">Color: {item.color}</p>}
                        {item.type && <p className="text-gray-500">Type: {item.type}</p>}
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <div className="flex flex-col items-end gap-2">
                  <label className="text-sm font-medium">Order Status</label>
                  <Select
                    value={order.orderStatus}
                    onValueChange={(value) => handleUpdateOrderStatus(order._id, value as OrderStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select
                    value={order.paymentStatus}
                    onValueChange={(value) => handleUpdatePaymentStatus(order._id, value as PaymentStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderAdmin; 