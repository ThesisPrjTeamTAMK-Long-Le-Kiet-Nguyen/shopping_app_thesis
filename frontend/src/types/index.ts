// Product Types
interface ProductColor {
  color: string;
  photo: string;
  quantity?: number;
  types?: ProductType[];
}

interface ProductType {
  type: string;
  quantity: number;
  maxTension?: string;
  size?: string;
  speed?: number;
}

// Base Product Interface
interface BaseProduct {
  id: string;
  name: string;
  price: number;
  brand: string;
  colors: ProductColor[];
}

// Specific Product Interfaces
export interface Racket extends BaseProduct {
  series: string;
  racketType: string;
  flexibility: string;
  material: string;
  balancePoint: number;
  cover: boolean;
}

export interface Bag extends BaseProduct {
  type: string;
  size: string;
}

export interface Shoe extends BaseProduct {
  series: string;
  midsole: string;
  outsole: string;
}

export interface Stringing extends BaseProduct {
  series: string;
  gauge: number;
  type: string;
}

export interface Grip extends BaseProduct {
  thickness: number;
  length: number;
}

export interface Shuttlecock extends BaseProduct {
  featherType: string;
  unitsPerTube: number;
}

// Auth Types
export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData extends Credentials {
  username: string;
  confirmPassword?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  color: string;
  type?: string;
  price: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  role: string;
  username: string;
  token: string;
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Config type (if needed in frontend)
export interface Config {
  MONGODB_URI: string;
  PORT: number;
  JWT_SECRET: string;
}

// Collection type for all products
export interface AllProducts {
  rackets: Racket[];
  bags: Bag[];
  shoes: Shoe[];
  stringings: Stringing[];
  grips: Grip[];
  shuttlecocks: Shuttlecock[];
}

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