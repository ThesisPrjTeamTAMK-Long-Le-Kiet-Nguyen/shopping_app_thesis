import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '@/services/cartService';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem, Cart, ApiResponse } from '@/types';
import { Input } from "@/components/ui/input";
import LoaderUI from '@/components/LoaderUI';
import './ShoppingCart.css';

// Extend the CartItem interface from types to include _id
interface ExtendedCartItem extends CartItem {
  _id: string;
}

interface CartItemProps {
  item: ExtendedCartItem;
  onRemove: (id: string) => Promise<void>;
  onQuantityChange: (id: string, quantity: number) => Promise<void>;
  isUpdating: boolean;
}

// Memoized CartItem component
const CartItemComponent = ({ item, onRemove, onQuantityChange, isUpdating }: CartItemProps) => {
  const handleIncrement = useCallback(() => {
    onQuantityChange(item.id, item.quantity + 1);
  }, [item.id, item.quantity, onQuantityChange]);

  const handleDecrement = useCallback(() => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  }, [item.id, item.quantity, onQuantityChange]);

  const handleQuantityInput = useCallback((value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity)) {
      onQuantityChange(item.id, newQuantity);
    }
  }, [item.id, onQuantityChange]);

  return (
    <div className="cart-item">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <div className="text-sm text-muted-foreground">
            <p>Color: {item.color}</p>
            {item.type && <p>Type: {item.type}</p>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={item.quantity <= 1 || isUpdating}
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="0"
          value={item.quantity}
          onChange={(e) => handleQuantityInput(e.target.value)}
          className="w-16 text-center"
          disabled={isUpdating}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={isUpdating}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

// Memoized EmptyCart component
const EmptyCart = () => (
  <div className="text-center py-8">
    <p className="text-lg text-muted-foreground">
      Your shopping cart is currently empty.
    </p>
  </div>
);

// Memoized CartSummary component
const CartSummary = ({ total, onCheckout, disabled }: { 
  total: number; 
  onCheckout: () => void;
  disabled: boolean;
}) => (
  <>
    <div className="flex justify-between items-center pt-4">
      <p className="text-lg font-semibold">Total</p>
      <p className="text-2xl font-bold">${total.toFixed(2)}</p>
    </div>

    <div className="flex justify-end pt-6">
      <Button 
        className="w-full sm:w-auto"
        onClick={onCheckout}
        disabled={disabled}
      >
        Proceed to Checkout
      </Button>
    </div>
  </>
);

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // Memoize fetch cart items function
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await cartService.getCart() as ApiResponse<Cart>;
      if (response.success && response.data) {
        setCartItems(response.data.items as ExtendedCartItem[]);
      }
    } catch (err) {
      console.error('Failed to fetch cart items:', err);
      setError('Failed to load cart items. Please try again later.');
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Memoize handlers
  const handleRemoveFromCart = useCallback(async (itemId: string) => {
    try {
      const response = await cartService.removeFromCart(itemId) as ApiResponse<void>;
      if (response.success) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  }, []);

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    try {
      setUpdatingItems(prev => new Set(prev).add(itemId));
      const response = await cartService.updateCartItemQuantity(itemId, newQuantity) as ApiResponse<Cart>;
      
      if (response.success && response.data) {
        setCartItems(response.data.items as ExtendedCartItem[]);
        if (newQuantity === 0) {
          toast.success('Item removed from cart');
        } else {
          toast.success('Cart updated');
        }
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  }, []);

  const handleCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  // Memoize total calculation
  const total = useMemo(() => 
    cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
    [cartItems]
  );

  if (loading) {
    return <LoaderUI />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shopping-cart">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
          
          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItemComponent
                  key={item._id}
                  item={item}
                  onRemove={handleRemoveFromCart}
                  onQuantityChange={handleQuantityChange}
                  isUpdating={updatingItems.has(item.id)}
                />
              ))}
              
              <CartSummary 
                total={total}
                onCheckout={handleCheckout}
                disabled={cartItems.length === 0}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingCart;