// backend/src/controllers/productController.js
const { MongoClient, ObjectId } = require('mongodb');
const Bag = require('../models/bag');
const Grip = require('../models/grip');
const Racket = require('../models/racket');
const Shoe = require('../models/shoe');
const Shuttlecock = require('../models/shuttlecock');
const Stringing = require('../models/stringing');

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB client
let db;

// Connect to MongoDB
const connectToDB = async () => {
    if (!db) {
        const client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to Database');
        db = client.db('badminton');
    }
};

// Fetch all products from all collections
exports.getAllProducts = async (req, res) => {
    try {
        const [rackets, shoes, stringings, shuttlecocks, grips, bags] = await Promise.all([
            Racket.find(),
            Shoe.find(),
            Stringing.find(),
            Shuttlecock.find(),
            Grip.find(),
            Bag.find(),
        ]);

        // Combine all products into a single array in the specified order
        const allProducts = {
            rackets,
            shoes,
            stringings,
            shuttlecocks,
            grips,
            bags,
        };

        res.json(allProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Delete a product (generic for all products)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    // Get the full path and extract the product type
    const fullPath = req.baseUrl + req.path; // This will be like '/products/rackets/racket-2106'
    const pathParts = fullPath.split('/');
    const productType = pathParts[2]; // This will get 'rackets' from the path
    
    console.log('Product type:', productType); // Debug log
    console.log('Product ID:', id); // Debug log

    try {
        let Model;
        switch (productType) {
            case 'rackets':
                Model = Racket;
                break;
            case 'bags':
                Model = Bag;
                break;
            case 'shoes':
                Model = Shoe;
                break;
            case 'stringings':
                Model = Stringing;
                break;
            case 'grips':
                Model = Grip;
                break;
            case 'shuttlecocks':
                Model = Shuttlecock;
                break;
            default:
                return res.status(400).json({ 
                    error: 'Invalid product type',
                    receivedType: productType,
                    fullPath: fullPath 
                });
        }

        const result = await Model.findOneAndDelete({ id: id });

        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ 
            message: 'Product deleted successfully',
            deletedProduct: result
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
};

// Helper function to get the model based on category
const getModelByCategory = (category) => {
    switch (category) {
        case 'bags':
            return Bag;
        case 'grips':
            return Grip;
        case 'rackets':
            return Racket;
        case 'shoes':
            return Shoe;
        case 'shuttlecocks':
            return Shuttlecock;
        case 'stringings':
            return Stringing;
        default:
            throw new Error('Invalid category');
    }
};