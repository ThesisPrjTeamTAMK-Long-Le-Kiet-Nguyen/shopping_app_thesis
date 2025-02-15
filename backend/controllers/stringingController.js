const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI;

// MongoDB client
let db;

// Connect to MongoDB
const connectToDB = async () => {
    if (!db) {
        const client = await MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to Database');
        db = client.db('badminton');
    }
};

// Get all stringings
exports.getAllStringings = async (req, res) => {
    try {
        await connectToDB();
        const stringings = await db.collection('stringings').find().toArray();
        res.json(stringings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stringings' });
    }
};

// Add a new stringing
exports.addStringing = async (req, res) => {
    const { id, name, price, brand, series, gauge, type, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !series || !gauge || !type || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newStringing = {
            id,
            name,
            price,
            brand,
            series,
            gauge,
            type,
            colors, // Keep the colors array as provided
        };

        await db.collection('stringings').insertOne(newStringing);
        res.status(201).json({ message: 'Stringing added successfully', stringing: newStringing });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add stringing' });
    }
};

// Update a stringing
exports.updateStringing = async (req, res) => {
    const { id } = req.params; // Get stringing ID from the URL
    const updates = req.body; // Expecting updated stringing details in the request body
    try {
        const result = await db.collection('stringings').findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { returnOriginal: false }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Stringing not found' });
        }

        res.json({ message: 'Stringing updated successfully', stringing: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stringing' });
    }
}; 