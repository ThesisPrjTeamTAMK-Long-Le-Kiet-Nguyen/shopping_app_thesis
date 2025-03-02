// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const racketController = require('../controllers/racket');
const bagController = require('../controllers/bag');
const shoeController = require('../controllers/shoe');
const stringingController = require('../controllers/stringing');
const gripController = require('../controllers/grip');
const shuttlecockController = require('../controllers/shuttlecock');
const { authenticateUser, isAdmin } = require('../utils/authenticate');

// Fetch all products from all collections
router.get('/', productController.getAllProducts);

// Fetch products from bags collection
router.get('/bags', bagController.getAllBags);

// Fetch products from grips collection
router.get('/grips', gripController.getAllGrips);

// Fetch products from rackets collection
router.get('/rackets', racketController.getAllRackets);

// Fetch products from shoes collection
router.get('/shoes', shoeController.getAllShoes);

// Fetch products from shuttlecocks collection
router.get('/shuttlecocks', shuttlecockController.getAllShuttlecocks);

// Fetch products from stringings collection
router.get('/stringings', stringingController.getAllStringings);

// Racket routes
router.post('/rackets/add', authenticateUser, racketController.addRacket);
router.put('/rackets/:id', authenticateUser, isAdmin, racketController.updateRacket);
router.delete('/rackets/:id', authenticateUser, isAdmin, productController.deleteProduct);

// Bag routes
router.post('/bags/add', authenticateUser, isAdmin, bagController.addBag);
router.put('/bags/:id', authenticateUser, isAdmin, bagController.updateBag);
router.delete('/bags/:id', authenticateUser, isAdmin, productController.deleteProduct);

// Shoe routes
router.post('/shoes/add', authenticateUser, isAdmin, shoeController.addShoe);
router.put('/shoes/:id', authenticateUser, isAdmin, shoeController.updateShoe);
router.delete('/shoes/:id', authenticateUser, isAdmin, productController.deleteProduct);

// Stringing routes
router.post('/stringings/add', authenticateUser, isAdmin, stringingController.addStringing);
router.put('/stringings/:id', authenticateUser, isAdmin, stringingController.updateStringing);
router.delete('/stringings/:id', authenticateUser, isAdmin, productController.deleteProduct);

// Grip routes
router.post('/grips/add', authenticateUser, isAdmin, gripController.addGrip);
router.put('/grips/:id', authenticateUser, isAdmin, gripController.updateGrip);
router.delete('/grips/:id', authenticateUser, isAdmin, productController.deleteProduct);

// Shuttlecock routes
router.post('/shuttlecocks/add', authenticateUser, isAdmin, shuttlecockController.addShuttlecock);
router.put('/shuttlecocks/:id', authenticateUser, isAdmin, shuttlecockController.updateShuttlecock);
router.delete('/shuttlecocks/:id', authenticateUser, isAdmin, productController.deleteProduct);

module.exports = router;