const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Reference to the user
    },
    items: [{
        id: {
            type: String,
            required: true, // Custom ID of the product
        },
        name: {
            type: String,
            required: true, // Name of the product
        },
        quantity: {
            type: Number,
            required: true,
            min: 1, // Minimum quantity is 1
        },
        color: {
            type: String,
            required: true, // Selected color of the product
        },
        type: {
            type: String, // For products like rackets or shoes that have types
        },
    }],
}, { collection: 'carts', timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema, 'carts');

module.exports = Cart;