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

// Generic request types
export interface ColorAddRequest {
  color: string;
  photo: string;
  types: Array<{
    type: string;
    quantity: number;
    speed?: number;
    maxTension?: string;
  }>;
}

export interface TypeAddRequest {
  type: string;
  quantity: number;
  speed?: number;
  maxTension?: string;
}

// Product-specific request types
export interface BagColorAddRequest {
  color: string;
  photo: string;
  quantity: number;
}

export interface ShoeColorAddRequest {
  color: string;
  photo: string;
  types: Array<{
    size: string;
    quantity: number;
  }>;
}

export interface ShoeSizeAddRequest {
  size: string;
  quantity: number;
}

export interface ShuttlecockColorAddRequest {
  color: string;
  photo: string;
  types: Array<{
    type: string;
    quantity: number;
    speed: number;
  }>;
}

export interface ShuttlecockTypeAddRequest {
  type: string;
  quantity: number;
  speed: number;
}

export interface StringingColorAddRequest {
  color: string;
  photo: string;
  quantity: number;
}

export interface GripColorAddRequest {
  color: string;
  photo: string;
  quantity: number;
} 