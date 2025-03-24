import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../../services/cartService';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem, Cart, ApiResponse } from '@/types';
import { Input } from "@/components/ui/input";
import './ShoppingCart.css';

// Extend the CartItem interface from types to include _id
interface ExtendedCartItem extends CartItem {
  _id: string;
}

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchCartItems = async () => {
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
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId: string) => {
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
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
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
  };

  const handleIncrement = (itemId: string, currentQuantity: number) => {
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const handleDecrement = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  const handleQuantityInput = (itemId: string, value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity)) {
      handleQuantityChange(itemId, newQuantity);
    }
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Loading your shopping cart...</p>
      </div>
    );
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
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                Your shopping cart is currently empty.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
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
                        onClick={() => handleRemoveFromCart(item.id)}
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
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                      className="w-16 text-center"
                      disabled={updatingItems.has(item.id)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement(item.id, item.quantity)}
                      disabled={updatingItems.has(item.id)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Separator className="my-4" />
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingCart;