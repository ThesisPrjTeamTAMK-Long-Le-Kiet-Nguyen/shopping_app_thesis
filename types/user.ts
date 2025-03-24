import { Document } from 'mongoose';

export type UserRole = 'admin' | 'customer';

export interface User extends Document {
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
} 