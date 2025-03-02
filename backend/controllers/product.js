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
    const { id } = req.params; // Get product ID from the URL
    const { category } = req.body; // Expecting category in the request body

    try {
        const result = await getModelByCategory(category).deleteOne({ id: id }); // Use the custom id for lookup

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
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