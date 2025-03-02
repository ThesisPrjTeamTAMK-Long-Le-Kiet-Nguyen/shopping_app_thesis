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

// Get all bags
exports.getAllBags = async (req, res) => {
    try {
        await connectToDB();
        const bags = await db.collection('bags').find().toArray();
        res.json(bags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bags' });
    }
};

// Add a new bag
exports.addBag = async (req, res) => {
    const { id, name, price, brand, type, size, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !type || !size || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newBag = {
            id,
            name,
            price,
            brand,
            type,
            size,
            colors, // Keep the colors array as provided
        };

        await db.collection('bags').insertOne(newBag);
        res.status(201).json({ message: 'Bag added successfully', bag: newBag });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add bag' });
    }
};

// Update a bag
exports.updateBag = async (req, res) => {
    const { id } = req.params; // Get bag ID from the URL
    const updates = req.body; // Expecting updated bag details in the request body
    try {
        const result = await db.collection('bags').findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { returnOriginal: false }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Bag not found' });
        }

        res.json({ message: 'Bag updated successfully', bag: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bag' });
    }
};