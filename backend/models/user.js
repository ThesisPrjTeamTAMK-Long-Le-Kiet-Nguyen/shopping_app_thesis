const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'customer'], // Define the roles
        default: 'customer', // Default role is customer
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'users' });

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
module.exports = User;