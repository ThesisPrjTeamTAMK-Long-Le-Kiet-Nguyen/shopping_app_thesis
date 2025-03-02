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

const bagSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    colors: [colorSchema], // Array of colors
}, { collection: 'bags' });

bagSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Bag = mongoose.models.Bag || mongoose.model('Bag', bagSchema, 'bags');
module.exports = Bag; 