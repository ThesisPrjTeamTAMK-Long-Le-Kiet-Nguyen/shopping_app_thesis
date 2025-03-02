const mongoose = require('mongoose');
const { colorSchema } = require('./commonSchemas'); // Import colorSchema

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
    maxTension: {
        type: String,
        required: true,
    },
});

const racketSchema = new mongoose.Schema({
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
    racketType: {
        type: String,
        required: true,
    },
    flexibility: {
        type: String,
        required: true,
    },
    material: {
        type: String,
        required: true,
    },
    balancePoint: {
        type: Number,
        required: true,
    },
    cover: {
        type: Boolean,
        required: true,
    },
    colors: [colorSchema], // Use imported colorSchema
}, { collection: 'rackets' });

racketSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Racket = mongoose.models.Racket || mongoose.model('Racket', racketSchema, 'rackets');
module.exports = Racket;
