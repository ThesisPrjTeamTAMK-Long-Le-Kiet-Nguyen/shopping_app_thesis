const mongoose = require('mongoose');
const { colorSchema } = require('./commonSchemas'); // Import colorSchema
const { typeSchema } = require('./commonSchemas'); // Import typeSchema

const shoeSchema = new mongoose.Schema({
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
    series: {
        type: String,
        required: true,
    },
    midsole: {
        type: String,
        required: true,
    },
    outsole: {
        type: String,
        required: true,
    },
    colors: [colorSchema], // Use imported colorSchema
}, { collection: 'shoes' });

shoeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Shoe = mongoose.models.Shoe || mongoose.model('Shoe', shoeSchema, 'shoes');
module.exports = Shoe;