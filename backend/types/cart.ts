import { Document } from 'mongoose';
import { User } from './user';

export interface CartItem {
    id: string;
    name: string;
    quantity: number;
    color: string;
    type?: string;
    price: number;
}

export interface Cart extends Document {
    userId: User['_id'];
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
} 