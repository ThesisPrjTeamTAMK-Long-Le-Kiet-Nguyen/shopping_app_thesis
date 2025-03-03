import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

const config: Config = {
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_URI: process.env.MONGODB_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || ''
};

export default config;