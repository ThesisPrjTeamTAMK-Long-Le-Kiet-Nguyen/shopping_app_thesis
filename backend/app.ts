import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import middleware from './utils/middleware';
import config from './utils/config';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import loginRouter from './controllers/login';
import logger from './utils/logger';
import orderRoutes from './routes/orderRoutes';
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

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/api/login', loginRouter);
app.use('/orders', orderRoutes);
// Error handling
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;