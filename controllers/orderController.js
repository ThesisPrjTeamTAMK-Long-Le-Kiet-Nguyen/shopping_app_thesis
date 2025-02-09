const Order = require('../models/order');
const User = require('../models/user');
const Item = require('../models/item');
// Create a new order
exports.createOrder = async (req, res) => {
    const { items } = req.body; // Expecting items in the request body
    try {
        // Fetch all products from the API
        const orderItems = [];
        let totalAmount = 0;

        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
        const products = await response.json();

        // Validate each item in the order
        for (const orderItem of items) {
            const { item: itemId, quantity } = orderItem;

            // Find the product in the fetched data
            let foundProduct = null;
            for (const category in products) {
                foundProduct = products[category].find(product => product._id === itemId);
                if (foundProduct) {
                    break;
                }
            }

            if (!foundProduct) {
                return res.status(400).json({ error: `Item with ID ${itemId} does not exist.` });
            }
            if (quantity <= 0 || quantity > foundProduct.stock) {
                return res.status(400).json({ error: `Invalid quantity for item ${foundProduct.name}.` });
            }

            // Calculate total amount
            totalAmount += foundProduct.price * quantity;

            // Push item details to orderItems array
            orderItems.push({ item: foundProduct._id, quantity });
        }

        // Create the order
        const newOrder = new Order({
            user: req.user.id, // Get user ID from the authenticated request
            items: orderItems,
            totalAmount,
        });
        await newOrder.save();

        // Optionally update item stock (if you want to keep track of stock in the database)
        for (const orderItem of items) {
            const { item: itemId, quantity } = orderItem;
            // Update stock logic can be added here if needed
        }

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        console.log('Fetching orders for user ID:', req.user.id); // Log the user ID
        const orders = await Order.find({ user: req.user.id })
            .populate('items.item') // Populate item details
            .exec(); // Execute the query

        console.log('Orders found:', orders); // Log the orders found
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Update an order
exports.updateOrder = async (req, res) => {
    const { status } = req.body; // Expecting status in the request body
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: 'Order not found or you do not have permission to update this order' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found or you do not have permission to delete this order' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};