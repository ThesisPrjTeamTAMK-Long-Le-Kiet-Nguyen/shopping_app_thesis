// backend/src/routes/productRoutes.js
import { Router } from 'express';
import {
    getAllProducts,
    deleteProduct,
    deleteProductType,
    deleteProductColor,
    updateProductQuantity
} from '../controllers/product';
import {
    getAllRackets,
    getRacketById,
    addRacket,
    updateRacket,
    addRacketColor,
    addRacketType
} from '../controllers/racket';
import {
    getAllBags,
    getBagById,
    addBag,
    updateBag,
    addBagColor
} from '../controllers/bag';
import {
    getAllShoes,
    getShoeById,
    addShoe,
    updateShoe,
    addShoeColor,
    addShoeSize
} from '../controllers/shoe';
import {
    getAllStringings,
    getStringingById,
    addStringing,
    updateStringing,
    addStringingColor
} from '../controllers/stringing';
import {
    getAllGrips,
    getGripById,
    addGrip,
    updateGrip,
    addGripColor
} from '../controllers/grip';
import {
    getAllShuttlecocks,
    getShuttlecockById,
    addShuttlecock,
    updateShuttlecock,
    addShuttlecockColor,
    addShuttlecockType
} from '../controllers/shuttlecock';
import { authenticateUser, isAdmin } from '../utils/authenticate';

const router = Router();

// General products route
router.get('/', getAllProducts);

// Racket routes
router.get('/rackets', getAllRackets);
router.get('/rackets/:id', getRacketById);
router.post('/rackets', authenticateUser, isAdmin, addRacket);
router.put('/rackets/:id', authenticateUser, isAdmin, updateRacket);
router.delete('/rackets/:id', authenticateUser, isAdmin, deleteProduct);
router.post('/rackets/:id/colors', authenticateUser, isAdmin, addRacketColor);
router.post('/rackets/:id/colors/:colorId/types', authenticateUser, isAdmin, addRacketType);

// Bag routes
router.get('/bags', getAllBags);
router.get('/bags/:id', getBagById);
router.post('/bags', authenticateUser, isAdmin, addBag);
router.put('/bags/:id', authenticateUser, isAdmin, updateBag);
router.delete('/bags/:id', authenticateUser, isAdmin, deleteProduct);
router.post('/bags/:id/colors', authenticateUser, isAdmin, addBagColor);

// Shoe routes
router.get('/shoes', getAllShoes);
router.get('/shoes/:id', getShoeById);
router.post('/shoes', authenticateUser, isAdmin, addShoe);
router.put('/shoes/:id', authenticateUser, isAdmin, updateShoe);
router.delete('/shoes/:id', authenticateUser, isAdmin, deleteProduct);
router.post('/shoes/:id/colors', authenticateUser, isAdmin, addShoeColor);
router.post('/shoes/:id/colors/:colorId/types', authenticateUser, isAdmin, addShoeSize);

// Stringing routes
router.get('/stringings', getAllStringings);
router.get('/stringings/:id', getStringingById);
router.post('/stringings', authenticateUser, isAdmin, addStringing);
router.put('/stringings/:id', authenticateUser, isAdmin, updateStringing);
router.delete('/stringings/:id', authenticateUser, isAdmin, deleteProduct);
router.post('/stringings/:id/colors', authenticateUser, isAdmin, addStringingColor);

// Grip routes
router.get('/grips', getAllGrips);
router.get('/grips/:id', getGripById);
router.post('/grips', authenticateUser, isAdmin, addGrip);
router.put('/grips/:id', authenticateUser, isAdmin, updateGrip);
router.delete('/grips/:id', authenticateUser, isAdmin, deleteProduct);
router.post('/grips/:id/colors', authenticateUser, isAdmin, addGripColor);

// Shuttlecock routes
router.get('/shuttlecocks', getAllShuttlecocks);
router.get('/shuttlecocks/:id', getShuttlecockById);
router.post('/shuttlecocks', authenticateUser, isAdmin, addShuttlecock);
router.put('/shuttlecocks/:id', authenticateUser, isAdmin, updateShuttlecock);
router.delete('/shuttlecocks/:id', authenticateUser, isAdmin, deleteProduct);
router.post('/shuttlecocks/:id/colors', authenticateUser, isAdmin, addShuttlecockColor);
router.post('/shuttlecocks/:id/colors/:colorId/types', authenticateUser, isAdmin, addShuttlecockType);

router.delete('/:productType/:id/colors/:colorId/types/:typeId', deleteProductType);
router.delete('/:productType/:id/colors/:colorId', deleteProductColor);

// Add the new route for updating product quantity
router.put('/:productType/:id/quantity', authenticateUser, isAdmin, updateProductQuantity);

export default router;