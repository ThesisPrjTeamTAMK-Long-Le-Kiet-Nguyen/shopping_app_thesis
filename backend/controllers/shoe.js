const Shoe = require('../models/shoe'); // Import the Shoe model

// Get all shoes
exports.getAllShoes = async (req, res) => {
    try {
        const shoes = await Shoe.find(); // Use Mongoose to find all shoes
        res.json(shoes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shoes' });
    }
};

// Add a new shoe
exports.addShoe = async (req, res) => {
    const { id, name, price, brand, series, midsole, outsole, colors } = req.body;
    try {
        // Validate input
        if (!id || !name || !price || !brand || !series || !midsole || !outsole || !colors) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate colors structure
        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({ error: 'Colors must be a non-empty array' });
        }

        const newShoe = new Shoe({
            id,
            name,
            price,
            brand,
            series,
            midsole,
            outsole,
            colors, // Keep the colors array as provided
        });

        await newShoe.save(); // Use Mongoose to save the new shoe
        res.status(201).json({ message: 'Shoe added successfully', shoe: newShoe });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add shoe' });
    }
};

// Update a shoe
exports.updateShoe = async (req, res) => {
    const { id } = req.params; // Get shoe ID from the URL
    const updates = req.body; // Expecting updated shoe details in the request body
    try {
        const result = await Shoe.findOneAndUpdate(
            { id: id }, // Use the custom id for lookup
            { $set: updates },
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: 'Shoe not found' });
        }

        res.json({ message: 'Shoe updated successfully', shoe: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update shoe' });
    }
};