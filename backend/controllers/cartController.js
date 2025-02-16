const { MongoClient } = require('mongodb');

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

// Add item to cart
exports.addToCart = async (req, res) => {
    const { id, name, quantity, color, type } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        await connectToDB();

        // Find the cart for the user
        let cart = await db.collection('carts').findOne({ userId });
        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = { userId, items: [] };
        }

        // Check if the item already exists in the cart
        const existingItemIndex = cart.items.findIndex(item => item.id === id && item.color === color);
        if (existingItemIndex > -1) {
            // If it exists, update the quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // If it doesn't exist, add a new item
            cart.items.push({ id, name, quantity, color, type });
        }

        // Upsert the cart
        await db.collection('carts').updateOne(
            { userId },
            { $set: { items: cart.items } },
            { upsert: true }
        );

        res.status(201).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// Get cart
exports.getCart = async (req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        await connectToDB();
        const cart = await db.collection('carts').findOne({ userId });
        res.json(cart || { items: [] }); // Return the cart or an empty array if no cart exists
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { id } = req.params; // Get item ID from the URL
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        await connectToDB();
        // Find the cart for the user
        const cart = await db.collection('carts').findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the item index in the cart
        const itemIndex = cart.items.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Update the cart in the database
        await db.collection('carts').updateOne(
            { userId },
            { $set: { items: cart.items } }
        );

        res.json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        console.error('Failed to remove item from cart:', error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};