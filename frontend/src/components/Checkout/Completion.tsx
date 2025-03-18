import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Completion = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  });

  useEffect(() => {
    // Clear cart after successful order
    localStorage.removeItem('cart');
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

            <div className="bg-muted p-6 rounded-lg space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order Number:</span>
                <span className="font-semibold">#{orderDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Estimated Delivery:</span>
                <span className="font-semibold">{orderDetails.estimatedDelivery}</span>
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