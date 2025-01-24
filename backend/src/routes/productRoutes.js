// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Fetch all products from all collections
router.get('/', productController.getAllProducts);

// Fetch products from bags collection
router.get('/bags', productController.getBags);

// Fetch products from grips collection
router.get('/grips', productController.getGrips);

// Fetch products from rackets collection
router.get('/rackets', productController.getRackets);

// Fetch products from shoes collection
router.get('/shoes', productController.getShoes);

// Fetch products from shuttlecocks collection
router.get('/shuttlecocks', productController.getShuttlecocks);

// Fetch products from stringings collection
router.get('/stringings', productController.getStringings);

module.exports = router;