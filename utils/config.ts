import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

const config: Config = {
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_URI: process.env.MONGODB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || ''
};

export default config;