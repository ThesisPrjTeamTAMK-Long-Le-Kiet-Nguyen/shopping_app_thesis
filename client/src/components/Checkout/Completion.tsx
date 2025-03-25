import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import cartService from '@/services/cartService';

interface LocationState {
  orderNumber: string;
}

// Memoized OrderNumber component
const OrderNumber = ({ orderNumber }: { orderNumber: string }) => (
  <div className="bg-muted p-6 rounded-lg">
    <div className="flex justify-between">
      <span className="font-medium">Order Number:</span>
      <span className="font-semibold">#{orderNumber}</span>
    </div>
  </div>
);

// Memoized OrderInfo component
const OrderInfo = () => (
  <div className="space-y-4">
    <p className="text-base text-muted-foreground">
      Your order will be processing, check "your order" to see the order status.
    </p>
    <p className="text-sm text-muted-foreground">
      Contact us through email or phone if needed.
    </p>
  </div>
);

const Completion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = useMemo(() => 
    (location.state as LocationState)?.orderNumber || 'N/A',
    [location.state]
  );

  // Memoize clear cart function
  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    }
  }, []);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Memoize navigation handler
  const handleContinueShopping = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold">Thank you! 🎉</h1>
            <p className="text-lg text-muted-foreground">
              Your order has been successfully placed
            </p>

            <OrderNumber orderNumber={orderNumber} />
            <OrderInfo />

            <Button 
              onClick={handleContinueShopping}
              className="mt-6"
              size="lg"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Completion;