const Shuttlecock = require('../models/shuttlecock'); // Import the Shuttlecock model

// Get all shuttlecocks
exports.getAllShuttlecocks = async (req, res) => {
    try {
        const shuttlecocks = await Shuttlecock.find(); // Use Mongoose to find all shuttlecocks
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

        const newShuttlecock = new Shuttlecock({
            id,
            name,
            price,
            brand,
            featherType,
            unitsPerTube,
            colors, // Keep the colors array as provided
        });

        await newShuttlecock.save(); // Use Mongoose to save the new shuttlecock
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
        const result = await Shuttlecock.findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'Shuttlecock not found' });
        }

        res.json({ message: 'Shuttlecock updated successfully', shuttlecock: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shuttlecock' });
    }
};