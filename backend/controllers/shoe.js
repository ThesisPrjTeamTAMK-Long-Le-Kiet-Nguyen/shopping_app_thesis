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

// Get all shoes
exports.getAllShoes = async (req, res) => {
    try {
        await connectToDB();
        const shoes = await db.collection('shoes').find().toArray();
        res.json(shoes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shoes' });
    }
};

// Add a new shoe
exports.addShoe = async (req, res) => {
    const { id, name, price, brand, series, midsole, outsole, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !series || !midsole || !outsole || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newShoe = {
            id,
            name,
            price,
            brand,
            series,
            midsole,
            outsole,
            colors, // Keep the colors array as provided
        };

        await db.collection('shoes').insertOne(newShoe);
        res.status(201).json({ message: 'Shoe added successfully', shoe: newShoe });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add shoe' });
    }
};

// Update a shoe
exports.updateShoe = async (req, res) => {
    const { id } = req.params; // Get shoe ID from the URL
    const updates = req.body; // Expecting updated shoe details in the request body
    try {
        const result = await db.collection('shoes').findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { returnOriginal: false }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Shoe not found' });
        }

        res.json({ message: 'Shoe updated successfully', shoe: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shoe' });
    }
};