import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import paymentService from '@/services/paymentService';
import { config } from '@/config';

interface StripePaymentFormProps {
    orderId: string;
    onCancel: () => void;
}

const stripePromise = loadStripe(config.STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ onCancel }: Omit<StripePaymentFormProps, 'orderId'>) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/completion`,
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
            </div>
        </form>
    );
};

const StripePaymentForm = ({ orderId, onCancel }: StripePaymentFormProps) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializePayment = async () => {
            try {
                const response = await paymentService.createPaymentIntent(orderId);
                if (response.success && response.data) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError('Failed to initialize payment');
                }
            } catch (error) {
                console.error('Payment initialization error:', error);
                setError('Failed to initialize payment');
            }
        };

        initializePayment();
    }, [orderId]);

    if (error) {
        return (
            <div className="text-center space-y-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={onCancel}>Try Again</Button>
            </div>
        );
    }

    if (!clientSecret) {
        return (
            <div className="text-center">
                <p className="text-muted-foreground">Loading payment form...</p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                },
            }}
        >
            <PaymentForm onCancel={onCancel} />
        </Elements>
    );
};

export default StripePaymentForm; 