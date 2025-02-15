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

// Get all grips
exports.getAllGrips = async (req, res) => {
    try {
        await connectToDB();
        const grips = await db.collection('grips').find().toArray();
        res.json(grips);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch grips' });
    }
};

// Add a new grip
exports.addGrip = async (req, res) => {
    const { id, name, price, brand, thickness, length, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !thickness || !length || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newGrip = {
            id,
            name,
            price,
            brand,
            thickness,
            length,
            colors, // Keep the colors array as provided
        };

        await db.collection('grips').insertOne(newGrip);
        res.status(201).json({ message: 'Grip added successfully', grip: newGrip });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add grip' });
    }
};

// Update a grip
exports.updateGrip = async (req, res) => {
    const { id } = req.params; // Get grip ID from the URL
    const updates = req.body; // Expecting updated grip details in the request body
    try {
        const result = await db.collection('grips').findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { returnOriginal: false }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Grip not found' });
        }

        res.json({ message: 'Grip updated successfully', grip: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update grip' });
    }
}; 