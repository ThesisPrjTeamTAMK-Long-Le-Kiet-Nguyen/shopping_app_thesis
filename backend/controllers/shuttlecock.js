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

// Get all shuttlecocks
exports.getAllShuttlecocks = async (req, res) => {
    try {
        await connectToDB();
        const shuttlecocks = await db.collection('shuttlecocks').find().toArray();
        res.json(shuttlecocks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shuttlecocks' });
    }
};

// Add a new shuttlecock
exports.addShuttlecock = async (req, res) => {
    const { id, name, price, brand, featherType, unitsPerTube, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !featherType || !unitsPerTube || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newShuttlecock = {
            id,
            name,
            price,
            brand,
            featherType,
            unitsPerTube,
            colors, // Keep the colors array as provided
        };

        await db.collection('shuttlecocks').insertOne(newShuttlecock);
        res.status(201).json({ message: 'Shuttlecock added successfully', shuttlecock: newShuttlecock });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add shuttlecock' });
    }
};

// Update a shuttlecock
exports.updateShuttlecock = async (req, res) => {
    const { id } = req.params; // Get shuttlecock ID from the URL
    const updates = req.body; // Expecting updated shuttlecock details in the request body
    try {
        const result = await db.collection('shuttlecocks').findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { returnOriginal: false }
        );

        if (!result.value) {
            return res.status(404).json({ error: 'Shuttlecock not found' });
        }

        res.json({ message: 'Shuttlecock updated successfully', shuttlecock: result.value });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shuttlecock' });
    }
};