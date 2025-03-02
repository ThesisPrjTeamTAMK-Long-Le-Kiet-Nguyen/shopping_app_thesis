const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    speed: {
        type: Number,
        required: false, // Optional for some products
    },
});

const colorSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    types: [typeSchema], // Array of types
});

module.exports = { typeSchema, colorSchema }; 