// Base product types
export interface ProductColor {
  _id?: string;
  color: string;
  photo: string;
  quantity?: number;
  types?: ProductType[];
}

export interface ProductType {
  _id?: string;
  type: string;
  quantity: number;
  maxTension?: string;
  size?: string;
  speed?: number;
}

export interface BaseProduct {
  _id?: string;
  id: string;
  name: string;
  price: number;
  brand: string;
  colors: ProductColor[];
}

// Specific product interfaces
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

export interface ShoeSize {
  _id?: string;
  size: string;
  quantity: number;
}

export interface ShoeColor {
  _id?: string;
  color: string;
  photo: string;
  types: ShoeSize[];
}

export interface Shoe {
  _id?: string;
  id: string;
  name: string;
  price: number;
  brand: string;
  series: string;
  midsole: string;
  outsole: string;
  colors: ShoeColor[];
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

export interface AllProducts {
  rackets: Racket[];
  bags: Bag[];
  shoes: Shoe[];
  stringings: Stringing[];
  grips: Grip[];
  shuttlecocks: Shuttlecock[];
}