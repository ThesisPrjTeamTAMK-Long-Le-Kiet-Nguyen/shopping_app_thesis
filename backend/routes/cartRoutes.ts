import { Router } from 'express';
import { 
    addToCart, 
    getCart, 
    removeFromCart 
} from '../controllers/cart';
import { authenticateUser } from '../utils/authenticate';

const router = Router();

// Add item to cart
router.post('/', authenticateUser, addToCart);

// Get user's cart
router.get('/', authenticateUser, getCart);

// Remove item from cart
router.delete('/:id', authenticateUser, removeFromCart);

export default router;