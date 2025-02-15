const Cart = require('../models/cart');

// Add item to cart
exports.addToCart = async (req, res) => {
    const { id, name, quantity, color, type } = req.body; // Expecting these fields in the request body
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
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

        await cart.save(); // Save the cart
        res.status(201).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// Get user's cart
exports.getCart = async (req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items'); // Populate item details if needed
        res.json(cart || { items: [] }); // Return the cart or an empty array if no cart exists
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    const { id } = req.params; // Get item ID from the URL
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });
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
        await cart.save();

        res.json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
}; 