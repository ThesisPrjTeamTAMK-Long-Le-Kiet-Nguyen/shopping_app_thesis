export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  type: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: {
      _id: string;
      email: string;
  };
  receiverName: string;
  phoneNumber: string;
  address: string;
  note?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}