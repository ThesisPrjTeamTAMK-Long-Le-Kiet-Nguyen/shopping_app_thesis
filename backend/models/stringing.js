const mongoose = require('mongoose');
const { colorSchema } = require('./commonSchemas'); // Import colorSchema
const { typeSchema } = require('./commonSchemas'); // Import typeSchema

const stringingSchema = new mongoose.Schema({
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
    gauge: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    colors: [colorSchema], // Use imported colorSchema
}, { collection: 'stringings' });

stringingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Stringing = mongoose.models.Stringing || mongoose.model('Stringing', stringingSchema, 'stringings');
module.exports = Stringing; 