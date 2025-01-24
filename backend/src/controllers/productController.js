// backend/src/controllers/productController.js
const { MongoClient } = require('mongodb');

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://kietnguyen:7AHlwIiOSRZcMkJv@shoppingbadminton.44m9i.mongodb.net/?retryWrites=true&w=majority&appName=Shoppingbadminton";

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

// Fetch products from bags collection
exports.getBags = async (req, res) => {
    try {
        await connectToDB();
        const bags = await db.collection('bags').find().toArray();
        res.json(bags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bags' });
    }
};

// Fetch products from grips collection
exports.getGrips = async (req, res) => {
    try {
        await connectToDB();
        const grips = await db.collection('grips').find().toArray();
        res.json(grips);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch grips' });
    }
};

// Fetch products from rackets collection
exports.getRackets = async (req, res) => {
    try {
        await connectToDB();
        const rackets = await db.collection('rackets').find().toArray();
        res.json(rackets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rackets' });
    }
};

// Fetch products from shoes collection
exports.getShoes = async (req, res) => {
    try {
        await connectToDB();
        const shoes = await db.collection('shoes').find().toArray();
        res.json(shoes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shoes' });
    }
};

// Fetch products from shuttlecocks collection
exports.getShuttlecocks = async (req, res) => {
    try {
        await connectToDB();
        const shuttlecocks = await db.collection('shuttlecocks').find().toArray();
        res.json(shuttlecocks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shuttlecocks' });
    }
};

// Fetch products from stringings collection
exports.getStringings = async (req, res) => {
    try {
        await connectToDB();
        const stringings = await db.collection('stringings').find().toArray();
        res.json(stringings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stringings' });
    }
};