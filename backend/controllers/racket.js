const Racket = require('../models/racket'); // Import the Racket model

// Get all rackets
exports.getAllRackets = async (req, res) => {
    try {
        const rackets = await Racket.find(); // Use Mongoose to find all rackets
        res.json(rackets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rackets' });
    }
};

// Add a new racket
exports.addRacket = async (req, res) => {
    const { id, name, price, brand, series, racketType, flexibility, material, balancePoint, cover, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !series || !racketType || !flexibility || !material || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newRacket = new Racket({
            id,
            name,
            price,
            brand,
            series,
            racketType,
            flexibility,
            material,
            balancePoint,
            cover,
            colors, // Keep the colors array as provided
        });

        await newRacket.save(); // Use Mongoose to save the new racket
        res.status(201).json({ message: 'Racket added successfully', racket: newRacket });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add racket' });
    }
};

// Update a racket
exports.updateRacket = async (req, res) => {
    const { id } = req.params; // Get racket ID from the URL
    const updates = req.body; // Expecting updated racket details in the request body
    try {
        const result = await Racket.findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'Racket not found' });
        }

        res.json({ message: 'Racket updated successfully', racket: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update racket' });
    }
};