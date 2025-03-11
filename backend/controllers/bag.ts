import { Request, Response } from 'express';
import { BagModel } from '../models/product';
import { Bag, ApiResponse } from '../types';

interface BagRequest {
    id: string;
    name: string;
    price: number;
    brand: string;
    type: string;
    size: string;
    colors: Array<{
        color: string;
        photo: string;
        quantity: number;
    }>;
}

// Add new interface for color addition
interface ColorAddRequest {
    color: string;
    photo: string;
    quantity: number;
}

// Get all bags
export const getAllBags = async (
    req: Request,
    res: Response<ApiResponse<Bag[]>>
) => {
    try {
        const bags = await BagModel.find();
        res.json({
            success: true,
            data: bags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bags'
        });
    }
};

// Add a new bag
export const addBag = async (
    req: Request<object, object, BagRequest>,
    res: Response<ApiResponse<Bag>>
) => {
    const { id, name, price, brand, type, size, colors } = req.body;
    try {
        if (!id || !name || !price || !brand || !type || !size || !colors) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Colors must be a non-empty array'
            });
        }

        const newBag = new BagModel({
            id,
            name,
            price,
            brand,
            type,
            size,
            colors,
        });

        const savedBag = await newBag.save();
        res.status(201).json({
            success: true,
            data: savedBag,
            message: 'Bag added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add bag'
        });
    }
};

// Update a bag
export const updateBag = async (
    req: Request<{ id: string }, object, Partial<BagRequest>>,
    res: Response<ApiResponse<Bag>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        // Find the bag first
        const existingBag = await BagModel.findOne({ id });

        if (!existingBag) {
            return res.status(404).json({
                success: false,
                error: 'Bag not found'
            });
        }

        // Handle color updates specifically
        if (updates.colors) {
            for (const updateColor of updates.colors) {
                // Find matching color in existing bag
                const existingColorIndex = existingBag.colors.findIndex(
                    (c: { color: string; }) => c.color === updateColor.color
                );

                if (existingColorIndex !== -1) {
                    // Color exists, update its properties
                    if (updateColor.photo) {
                        existingBag.colors[existingColorIndex].photo = updateColor.photo;
                    }
                    if (updateColor.quantity !== undefined) {
                        existingBag.colors[existingColorIndex].quantity = updateColor.quantity;
                    }
                }
                // Don't add new colors here - that should be done through addBagColor endpoint
            }
        }

        // Handle other updates
        const updatedData = {
            ...existingBag.toObject(),
            ...updates,
            colors: existingBag.colors // Preserve the modified colors array
        };

        const result = await BagModel.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        res.json({
            success: true,
            data: result,
            message: 'Bag updated successfully'
        });
    } catch (error) {
        console.error('Error updating bag:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update bag'
        });
    }
};

// Add new function to add a color to a bag
export const addBagColor = async (
    req: Request<{ id: string }, object, ColorAddRequest>,
    res: Response<ApiResponse<Bag>>
) => {
    const { id } = req.params;
    const { color, photo, quantity } = req.body;

    try {
        // Validate required fields
        if (!color || !photo || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Color, photo, and quantity are required'
            });
        }

        // Find the bag
        const bag = await BagModel.findOne({ id });
        if (!bag) {
            return res.status(404).json({
                success: false,
                error: 'Bag not found'
            });
        }

        // Check if color already exists
        if (bag.colors.some((c: { color: string; }) => c.color === color)) {
            return res.status(400).json({
                success: false,
                error: 'Color already exists for this bag'
            });
        }

        // Add the new color
        bag.colors.push({
            color,
            photo,
            quantity
        });

        const updatedBag = await bag.save();
        res.json({
            success: true,
            data: updatedBag,
            message: 'Color added successfully'
        });
    } catch (error) {
        console.error('Error adding color:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add color'
        });
    }
};

export const getBagById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Bag>>
) => {
    const { id } = req.params;
    try {
        const bag = await BagModel.findOne({ id });

        if (!bag) {
            return res.status(404).json({
                success: false,
                error: 'Bag not found'
            });
        }

        res.json({
            success: true,
            data: bag
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bag'
        });
    }
};