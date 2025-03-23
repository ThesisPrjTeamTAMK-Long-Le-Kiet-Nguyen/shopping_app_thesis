import { Document } from 'mongoose';
import { User } from './user';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    type?: string;
}

export interface Order extends Document {
    orderNumber: string;
    userId: User['_id'];
    receiverName: string;
    phoneNumber: string;
    address: string;
    note?: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: 'cod' | 'online';
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentIntentId?: string;
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
} 