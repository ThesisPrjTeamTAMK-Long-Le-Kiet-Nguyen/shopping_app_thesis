import { Document } from 'mongoose';

// User types
export type UserRole = 'admin' | 'customer';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}

// Product shared types
export interface Color {
    color: string;
    photo: string;
    types?: Type[];
    quantity?: number;
}

export interface Type {
    type: string;
    quantity: number;
    speed?: number;
    maxTension?: string;
}

// Product interfaces
export interface Racket extends Document {
    id: string;
    name: string;
    price: number;
    brand: string;
    series: string;
    racketType: string;
    flexibility: string;
    material: string;
    balancePoint: number;
    cover: boolean;
    colors: Color[];
}

export interface Bag extends Document {
    id: string;
    name: string;
    price: number;
    brand: string;
    type: string;
    size: string;
    colors: Color[];
}

export interface Shoe extends Document {
    id: string;
    name: string;
    price: number;
    brand: string;
    series: string;
    midsole: string;
    outsole: string;
    colors: Color[];
}

export interface Grip extends Document {
    id: string;
    name: string;
    price: number;
    brand: string;
    thickness: number;
    length: number;
    colors: Color[];
}

export interface Shuttlecock extends Document {
    id: string;
    name: string;
    price: number;
    brand: string;
    featherType: string;
    unitsPerTube: number;
    colors: Color[];
}

export interface Stringing extends Document {
    id: string;
    name: string;
    price: number;
    brand: string;
    series: string;
    gauge: number;
    type: string;
    colors: Color[];
}

// Cart types
export interface CartItem {
    id: string;
    name: string;
    quantity: number;
    color: string;
    type?: string;
    price: number;
}

export interface Cart extends Document {
    userId: User['_id'];
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Config type
export interface Config {
    MONGODB_URI: any;
    PORT: number;
    JWT_SECRET: string;
}

// Add other shared types here