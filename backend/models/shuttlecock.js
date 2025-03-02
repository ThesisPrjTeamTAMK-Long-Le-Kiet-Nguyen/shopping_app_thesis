const mongoose = require('mongoose');
const { typeSchema, colorSchema } = require('./commonSchemas'); // Import both schemas

const shuttlecockSchema = new mongoose.Schema({
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
    featherType: {
        type: String,
        required: true,
    },
    unitsPerTube: {
        type: Number,
        required: true,
    },
    colors: [colorSchema], // Use imported colorSchema
}, { collection: 'shuttlecocks' });

shuttlecockSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Shuttlecock = mongoose.models.Shuttlecock || mongoose.model('Shuttlecock', shuttlecockSchema, 'shuttlecocks');
module.exports = Shuttlecock; 