import mongoose, { Schema } from 'mongoose';
import { Cart, CartItem } from '../types';

const cartItemSchema = new Schema<CartItem>({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    color: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
});

const cartSchema = new Schema<Cart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [cartItemSchema],
}, { 
    collection: 'carts', 
    timestamps: true 
});

export const CartModel = mongoose.models.Cart || mongoose.model<Cart>('Cart', cartSchema, 'carts');