import { Router } from 'express';
import { 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    deleteUserAccount 
} from '../controllers/user';
import { authenticateUser } from '../utils/authenticate';

const router = Router();

// User registration route
router.post('/register', registerUser);

// Get user profile route (protected)
router.get('/profile', authenticateUser, getUserProfile);

// Update user profile route (protected)
router.put('/profile', authenticateUser, updateUserProfile);

// Delete user account route (protected)
router.delete('/account', authenticateUser, deleteUserAccount);

export default router;