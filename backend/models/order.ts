import mongoose, { Schema } from 'mongoose';
import { Order, OrderItem } from '../types';

const orderItemSchema = new Schema<OrderItem>({
    productId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
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
});

const orderSchema = new Schema<Order>({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'online'],
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
}, { 
    collection: 'orders', 
    timestamps: true 
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        const lastOrder = await (this.constructor as any).findOne().sort({ orderNumber: -1 });
        const lastNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-')[1]) : 0;
        this.orderNumber = `ORD-${String(lastNumber + 1).padStart(6, '0')}`;
    }
    next();
});

export const OrderModel = mongoose.models.Order || mongoose.model<Order>('Order', orderSchema, 'orders'); 