// backend/src/controllers/productController.js
const { MongoClient, ObjectId } = require('mongodb');

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
        await connectToDB();
        const bags = await db.collection('bags').find().toArray();
        const grips = await db.collection('grips').find().toArray();
        const rackets = await db.collection('rackets').find().toArray();
        const shoes = await db.collection('shoes').find().toArray();
        const shuttlecocks = await db.collection('shuttlecocks').find().toArray();
        const stringings = await db.collection('stringings').find().toArray();

        // Combine all products into a single array
        const allProducts = {
            bags,
            grips,
            rackets,
            shoes,
            shuttlecocks,
            stringings,
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
        await connectToDB();
        const result = await db.collection(category).deleteOne({ id: id }); // Use the custom id for lookup

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};