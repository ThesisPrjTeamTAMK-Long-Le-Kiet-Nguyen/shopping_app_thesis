export * from './product';
export * from './api';
export * from './cart';
export * from './order';
export * from './user';

export interface Config {
    PORT: number;
    MONGODB_URI: string;
    JWT_SECRET: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
}