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