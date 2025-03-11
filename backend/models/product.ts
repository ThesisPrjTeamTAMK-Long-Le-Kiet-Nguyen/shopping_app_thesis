import mongoose, { Schema } from 'mongoose';
import { Racket, Shoe, Stringing, Bag, Grip, Shuttlecock, Type, Color } from '../types';

// Common Type and Color Schemas
const typeSchema = new Schema<Type>({
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
        required: false,
    },
});

const colorSchema = new Schema<Color>({
    color: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    types: [typeSchema],
});

// Racket Schema
const racketSchema = new Schema<Racket>({
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
    colors: [colorSchema],
}, { collection: 'rackets' });

// Shoe Schema
const shoeSchema = new Schema<Shoe>({
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
    colors: [{
        color: { type: String, required: true },
        photo: { type: String, required: true },
        types: [{
            size: { type: String, required: true },
            quantity: { type: Number, required: true }
        }]
    }],
}, { collection: 'shoes' });

// Stringing Schema
const stringingSchema = new Schema<Stringing>({
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
    colors: [colorSchema],
}, { collection: 'stringings' });

// Bag Schema
const bagSchema = new Schema<Bag>({
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
    colors: [colorSchema],
}, { collection: 'bags' });

// Grip Schema
const gripSchema = new Schema<Grip>({
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
    colors: [colorSchema],
}, { collection: 'grips' });

// Shuttlecock Schema
const shuttlecockSchema = new Schema<Shuttlecock>({
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
    colors: [colorSchema],
}, { collection: 'shuttlecocks' });



// Export schemas if needed elsewhere
export { typeSchema as TypeSchema, colorSchema as ColorSchema };

// Export all models
export const RacketModel = mongoose.models.Racket || mongoose.model<Racket>('Racket', racketSchema, 'rackets');
export const ShoeModel = mongoose.models.Shoe || mongoose.model<Shoe>('Shoe', shoeSchema, 'shoes');
export const StringingModel = mongoose.models.Stringing || mongoose.model<Stringing>('Stringing', stringingSchema, 'stringings');
export const BagModel = mongoose.models.Bag || mongoose.model<Bag>('Bag', bagSchema, 'bags');
export const GripModel = mongoose.models.Grip || mongoose.model<Grip>('Grip', gripSchema, 'grips');
export const ShuttlecockModel = mongoose.models.Shuttlecock || mongoose.model<Shuttlecock>('Shuttlecock', shuttlecockSchema, 'shuttlecocks');