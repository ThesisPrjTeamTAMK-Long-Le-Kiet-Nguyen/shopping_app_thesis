const Grip = require('../models/grip'); // Import the Grip model

// Get all grips
exports.getAllGrips = async (req, res) => {
    try {
        const grips = await Grip.find(); // Use Mongoose to find all grips
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

        const newGrip = new Grip({
            id,
            name,
            price,
            brand,
            thickness,
            length,
            colors, // Keep the colors array as provided
        });

        await newGrip.save(); // Use Mongoose to save the new grip
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
        const result = await Grip.findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'Grip not found' });
        }

        res.json({ message: 'Grip updated successfully', grip: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update grip' });
    }
};