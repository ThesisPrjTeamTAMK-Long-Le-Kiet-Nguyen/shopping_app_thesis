import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import middleware from './utils/middleware';
import config from './utils/config';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import loginRouter from './controllers/login';
import logger from './utils/logger';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

const app: Express = express();

// MongoDB connection
const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('MongoDB connected');
    })
    .catch((err) => {
        logger.error('MongoDB connection error:', err);
    });

// Middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/login', loginRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;