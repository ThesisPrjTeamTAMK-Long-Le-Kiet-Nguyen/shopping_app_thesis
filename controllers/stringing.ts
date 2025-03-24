import { Request, Response } from 'express';
import { StringingModel } from '../models/product';
import { Stringing, ApiResponse } from '../types';

interface StringingRequest {
    id: string;
    name: string;
    price: number;
    brand: string;
    series: string;
    gauge: number;
    type: string;
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

export const getAllStringings = async (
    req: Request,
    res: Response<ApiResponse<Stringing[]>>
) => {
    try {
        const stringings = await StringingModel.find();
        res.json({
            success: true,
            data: stringings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stringings'
        });
    }
};

export const addStringing = async (
    req: Request<object, object, StringingRequest>,
    res: Response<ApiResponse<Stringing>>
) => {
    const { id, name, price, brand, series, gauge, type, colors } = req.body;
    try {
        if (!id || !name || !price || !brand || !series || !gauge || !type || !colors) {
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

        const newStringing = new StringingModel({
            id,
            name,
            price,
            brand,
            series,
            gauge,
            type,
            colors,
        });

        const savedStringing = await newStringing.save();
        res.status(201).json({
            success: true,
            data: savedStringing,
            message: 'Stringing added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add stringing'
        });
    }
};

export const updateStringing = async (
    req: Request<{ id: string }, object, Partial<StringingRequest>>,
    res: Response<ApiResponse<Stringing>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        // Find the stringing first
        const existingStringing = await StringingModel.findOne({ id });

        if (!existingStringing) {
            return res.status(404).json({
                success: false,
                error: 'Stringing not found'
            });
        }

        // Handle color updates specifically
        if (updates.colors) {
            for (const updateColor of updates.colors) {
                // Find matching color in existing stringing
                const existingColorIndex = existingStringing.colors.findIndex(
                    (c: { color: string; }) => c.color === updateColor.color
                );

                if (existingColorIndex !== -1) {
                    // Color exists, update its properties
                    if (updateColor.photo) {
                        existingStringing.colors[existingColorIndex].photo = updateColor.photo;
                    }
                    if (updateColor.quantity !== undefined) {
                        existingStringing.colors[existingColorIndex].quantity = updateColor.quantity;
                    }
                }
                // Don't add new colors here - that should be done through addStringingColor endpoint
            }
        }

        // Handle other updates
        const updatedData = {
            ...existingStringing.toObject(),
            ...updates,
            colors: existingStringing.colors // Preserve the modified colors array
        };

        const result = await StringingModel.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        res.json({
            success: true,
            data: result,
            message: 'Stringing updated successfully'
        });
    } catch (error) {
        console.error('Error updating stringing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update stringing'
        });
    }
};

export const getStringingById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Stringing>>
) => {
    const { id } = req.params;
    try {
        const stringing = await StringingModel.findOne({ id });

        if (!stringing) {
            return res.status(404).json({
                success: false,
                error: 'Stringing not found'
            });
        }

        res.json({
            success: true,
            data: stringing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stringing'
        });
    }
};

// Add new function to add a color to a stringing
export const addStringingColor = async (
    req: Request<{ id: string }, object, ColorAddRequest>,
    res: Response<ApiResponse<Stringing>>
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

        // Find the stringing
        const stringing = await StringingModel.findOne({ id });
        if (!stringing) {
            return res.status(404).json({
                success: false,
                error: 'Stringing not found'
            });
        }

        // Check if color already exists
        if (stringing.colors.some((c: { color: string; }) => c.color === color)) {
            return res.status(400).json({
                success: false,
                error: 'Color already exists for this stringing'
            });
        }

        // Add the new color
        stringing.colors.push({
            color,
            photo,
            quantity
        });

        const updatedStringing = await stringing.save();
        res.json({
            success: true,
            data: updatedStringing,
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