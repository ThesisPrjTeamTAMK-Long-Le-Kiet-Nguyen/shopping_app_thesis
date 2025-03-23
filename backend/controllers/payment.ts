import { Request, Response } from 'express';
import Stripe from 'stripe';
import config from '../utils/config';
import { OrderModel } from '../models/order';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia' // Using the latest API version
});

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        // Get order details
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.totalAmount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber
            }
        });

        // Update order with payment intent ID
        order.paymentIntentId = paymentIntent.id;
        await order.save();

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ success: false, message: 'Error creating payment intent' });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            config.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const orderId = paymentIntent.metadata.orderId;
                
                // Update order status
                await OrderModel.findByIdAndUpdate(orderId, {
                    paymentStatus: 'paid',
                    orderStatus: 'processing'
                });

                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                const failedOrderId = failedPayment.metadata.orderId;
                
                // Update order status
                await OrderModel.findByIdAndUpdate(failedOrderId, {
                    paymentStatus: 'failed'
                });

                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ success: false, message: 'Error handling webhook' });
    }
}; 