// backend/src/routes/productRoutes.js
import { Router } from 'express';
import { 
    getAllProducts,
    deleteProduct 
} from '../controllers/product';
import {
    getAllRackets,
    addRacket,
    updateRacket
} from '../controllers/racket';
import {
    getAllBags,
    addBag,
    updateBag
} from '../controllers/bag';
import {
    getAllShoes,
    addShoe,
    updateShoe
} from '../controllers/shoe';
import {
    getAllStringings,
    addStringing,
    updateStringing
} from '../controllers/stringing';
import {
    getAllGrips,
    addGrip,
    updateGrip
} from '../controllers/grip';
import {
    getAllShuttlecocks,
    addShuttlecock,
    updateShuttlecock
} from '../controllers/shuttlecock';
import { authenticateUser, isAdmin } from '../utils/authenticate';

const router = Router();

// General products route
router.get('/', getAllProducts);

// Racket routes
router.get('/rackets', getAllRackets);
router.post('/rackets', authenticateUser, isAdmin, addRacket);
router.put('/rackets/:id', authenticateUser, isAdmin, updateRacket);
router.delete('/rackets/:id', authenticateUser, isAdmin, deleteProduct);

// Bag routes
router.get('/bags', getAllBags);
router.post('/bags', authenticateUser, isAdmin, addBag);
router.put('/bags/:id', authenticateUser, isAdmin, updateBag);
router.delete('/bags/:id', authenticateUser, isAdmin, deleteProduct);

// Shoe routes
router.get('/shoes', getAllShoes);
router.post('/shoes', authenticateUser, isAdmin, addShoe);
router.put('/shoes/:id', authenticateUser, isAdmin, updateShoe);
router.delete('/shoes/:id', authenticateUser, isAdmin, deleteProduct);

// Stringing routes
router.get('/stringings', getAllStringings);
router.post('/stringings', authenticateUser, isAdmin, addStringing);
router.put('/stringings/:id', authenticateUser, isAdmin, updateStringing);
router.delete('/stringings/:id', authenticateUser, isAdmin, deleteProduct);

// Grip routes
router.get('/grips', getAllGrips);
router.post('/grips', authenticateUser, isAdmin, addGrip);
router.put('/grips/:id', authenticateUser, isAdmin, updateGrip);
router.delete('/grips/:id', authenticateUser, isAdmin, deleteProduct);

// Shuttlecock routes
router.get('/shuttlecocks', getAllShuttlecocks);
router.post('/shuttlecocks', authenticateUser, isAdmin, addShuttlecock);
router.put('/shuttlecocks/:id', authenticateUser, isAdmin, updateShuttlecock);
router.delete('/shuttlecocks/:id', authenticateUser, isAdmin, deleteProduct);

export default router;