import { Document } from 'mongoose';

// Shared product types
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