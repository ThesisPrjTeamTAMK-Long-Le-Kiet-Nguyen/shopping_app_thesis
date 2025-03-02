const Stringing = require('../models/stringing'); // Import the Stringing model

// Get all stringings
exports.getAllStringings = async (req, res) => {
    try {
        const stringings = await Stringing.find(); // Use Mongoose to find all stringings
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

        const newStringing = new Stringing({
            id,
            name,
            price,
            brand,
            series,
            gauge,
            type,
            colors, // Keep the colors array as provided
        });

        await newStringing.save(); // Use Mongoose to save the new stringing
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
        const result = await Stringing.findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'Stringing not found' });
        }

        res.json({ message: 'Stringing updated successfully', stringing: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stringing' });
    }
};