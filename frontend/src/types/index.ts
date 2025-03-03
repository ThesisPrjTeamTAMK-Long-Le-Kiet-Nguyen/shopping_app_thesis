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
  price: number;
  color: string;
  quantity: number;
  type?: string;
}

// API Response Types
export interface ApiResponse<T> {
  role: string;
  token: string;
  username: string;
  data: T;
  message?: string;
  error?: string;
}