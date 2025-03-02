const Bag = require('../models/bag'); // Import the Bag model

// Get all bags
exports.getAllBags = async (req, res) => {
    try {
        const bags = await Bag.find(); // Use Mongoose to find all bags
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

        const newBag = new Bag({
            id,
            name,
            price,
            brand,
            type,
            size,
            colors, // Keep the colors array as provided
        });

        await newBag.save(); // Use Mongoose to save the new bag
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
        const result = await Bag.findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'Bag not found' });
        }

        res.json({ message: 'Bag updated successfully', bag: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update bag' });
    }
};