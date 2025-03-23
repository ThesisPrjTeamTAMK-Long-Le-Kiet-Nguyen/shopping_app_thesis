import { Router } from 'express';
import { 
    addToCart, 
    getCart, 
    removeFromCart,
    updateCartItemQuantity,
    clearCart 
} from '../controllers/cart';
import { authenticateUser } from '../utils/authenticate';

const router = Router();

// Add item to cart
router.post('/', authenticateUser, addToCart);

// Get user's cart
router.get('/', authenticateUser, getCart);

// Update cart item quantity
router.put('/:id', authenticateUser, updateCartItemQuantity);

// Remove item from cart
router.delete('/:id', authenticateUser, removeFromCart);

// Clear entire cart
router.delete('/', authenticateUser, clearCart);

export default router;