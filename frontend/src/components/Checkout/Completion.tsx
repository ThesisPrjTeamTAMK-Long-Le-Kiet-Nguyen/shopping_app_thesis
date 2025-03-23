import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import cartService from '@/services/cartService';

interface LocationState {
  orderNumber: string;
}

const Completion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as LocationState)?.orderNumber || 'N/A';

  useEffect(() => {
    // Clear cart after successful order
    const clearCart = async () => {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        toast.error('Failed to clear cart');
      }
    };
    clearCart();
  }, []);

  const handleContinueShopping = () => {
    navigate('/');
  };

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

            <div className="bg-muted p-6 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Order Number:</span>
                <span className="font-semibold">#{orderNumber}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              We will send you an email confirmation with your order details shortly.
            </p>

            <Button 
              onClick={handleContinueShopping}
              className="mt-6"
              size="lg"
            >
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Completion;