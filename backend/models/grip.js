const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
});

const gripSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    thickness: {
        type: Number,
        required: true,
    },
    length: {
        type: Number,
        required: true,
    },
    colors: [colorSchema], // Array of colors
}, { collection: 'grips' });

gripSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Grip = mongoose.models.Grip || mongoose.model('Grip', gripSchema, 'grips');
module.exports = Grip; 