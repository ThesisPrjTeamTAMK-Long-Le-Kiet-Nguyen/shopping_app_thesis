import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment';
import { authenticateUser } from '../utils/authenticate';

const router = express.Router();

// Create payment intent (protected route)
router.post('/create-payment-intent', authenticateUser, createPaymentIntent);

// Webhook endpoint (no authentication needed, Stripe handles security)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;