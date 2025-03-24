import axios from 'axios';

const baseUrl = 'http://localhost:3000/api/payments';

const paymentService = {
    createPaymentIntent: async (orderId: string) => {
        try {
            const response = await axios.post(`${baseUrl}/create-payment-intent`, {
                orderId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            console.error('Error creating payment intent:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create payment intent'
            };
        }
    }
};

export default paymentService; 