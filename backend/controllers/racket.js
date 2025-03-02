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

// Get all rackets
exports.getAllRackets = async (req, res) => {
    try {
        await connectToDB();
        const rackets = await db.collection('rackets').find().toArray();
        res.json(rackets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rackets' });
    }
};

// Add a new racket
exports.addRacket = async (req, res) => {
    const { id, name, price, brand, series, racketType, flexibility, material, balancePoint, cover, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !series || !racketType || !flexibility || !material || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newRacket = {
            id,
            name,
            price,
            brand,
            series,
            racketType,
            flexibility,
            material,
            balancePoint,
            cover,
            colors,
        };

        await db.collection('rackets').insertOne(newRacket);
        res.status(201).json({ message: 'Racket added successfully', racket: newRacket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add racket' });
    }
};

// Update a racket
exports.updateRacket = async (req, res) => {
    const { id } = req.params; // Get racket ID from the URL
    const updates = req.body; // Expecting updated racket details in the request body
    try {
        const result = await db.collection('rackets').findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { returnOriginal: false }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Racket not found' });
        }

        res.json({ message: 'Racket updated successfully', racket: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update racket' });
    }
};