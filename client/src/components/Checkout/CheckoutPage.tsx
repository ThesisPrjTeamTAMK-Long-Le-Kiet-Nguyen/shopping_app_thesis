import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { CartItem } from '@/types';
import cartService from '@/services/cartService';
import orderService from '@/services/orderService';
import StripePaymentForm from './StripePaymentForm';

interface ExtendedCartItem extends CartItem {
  _id: string;
}

interface CheckoutFormData {
  receiverName: string;
  phoneNumber: string;
  address: string;
  note: string;
  paymentMethod: 'cod' | 'online';
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<ExtendedCartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    receiverName: '',
    phoneNumber: '',
    address: '',
    note: '',
    paymentMethod: 'cod'
  });

  // Fetch cart items when component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await cartService.getCart();
        if (response.success && response.data) {
          setCartItems(response.data.items as ExtendedCartItem[]);
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
        toast.error('Failed to load cart items');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (value: 'cod' | 'online') => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.receiverName || !formData.phoneNumber || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      // Create order
      const orderData = {
        receiverName: formData.receiverName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        note: formData.note,
        paymentMethod: formData.paymentMethod
      };

      const response = await orderService.createOrder(orderData);
      
      if (response.success && response.data) {
        if (formData.paymentMethod === 'cod') {
          // Clear the cart after successful order creation
          await cartService.clearCart();
          toast.success('Order placed successfully!');
          navigate('/completion', { 
            state: { 
              orderNumber: response.data.orderNumber 
            }
          });
        } else {
          // For online payment, store the order ID and show payment form
          setOrderId(response.data._id);
        }
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPayment = () => {
    setOrderId(null);
    setFormData(prev => ({
      ...prev,
      paymentMethod: 'cod'
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Loading checkout details...</p>
      </div>
    );
  }

  if (orderId && formData.paymentMethod === 'online') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>
        <Card>
          <CardContent className="p-6">
            <StripePaymentForm
              orderId={orderId}
              onCancel={handleCancelPayment}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Receiver Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Receiver's Name *</Label>
                  <Input
                    id="receiverName"
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleInputChange}
                    placeholder="Enter receiver's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter delivery address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Delivery Note</Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Add any special instructions for delivery"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary and Payment */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.color} - {item.type} (x{item.quantity})
                      </p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="flex justify-between items-center font-bold text-lg">
                  <p>Total</p>
                  <p>${calculateTotal().toFixed(2)}</p>
                </div>

                <div className="space-y-4 mt-8">
                  <h3 className="font-semibold">Payment Method</h3>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online Payment</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage; 