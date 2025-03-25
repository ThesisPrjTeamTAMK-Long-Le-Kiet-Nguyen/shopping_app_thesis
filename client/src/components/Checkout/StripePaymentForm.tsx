import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Memoized PaymentForm component
const PaymentForm = ({ onCancel }: Omit<StripePaymentFormProps, 'orderId'>) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    // Memoize submit handler
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
    }, [stripe, elements]);

    // Memoize button disabled state
    const isButtonDisabled = useMemo(() => 
        !stripe || isProcessing,
        [stripe, isProcessing]
    );

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
                    disabled={isButtonDisabled}
                    className="flex-1"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </Button>
            </div>
        </form>
    );
};

// Memoized ErrorDisplay component
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="text-center space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={onRetry}>Try Again</Button>
    </div>
);

// Memoized LoadingDisplay component
const LoadingDisplay = () => (
    <div className="text-center">
        <p className="text-muted-foreground">Loading payment form...</p>
    </div>
);

const StripePaymentForm = ({ orderId, onCancel }: StripePaymentFormProps) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Memoize payment initialization
    const initializePayment = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await paymentService.createPaymentIntent(orderId);
            if (response.success && response.data) {
                setClientSecret(response.data.clientSecret);
            } else {
                setError('Failed to initialize payment');
            }
        } catch (error) {
            console.error('Payment initialization error:', error);
            setError('Failed to initialize payment');
        } finally {
            setIsLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        initializePayment();
    }, [initializePayment]);

    if (error) {
        return <ErrorDisplay error={error} onRetry={initializePayment} />;
    }

    if (isLoading) {
        return <LoadingDisplay />;
    }

    if (!clientSecret) {
        return <ErrorDisplay error="Payment initialization failed" onRetry={initializePayment} />;
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