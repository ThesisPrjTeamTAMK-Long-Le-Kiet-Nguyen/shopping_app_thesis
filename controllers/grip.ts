import { Request, Response } from 'express';
import { GripModel } from '../models/product';
import { Grip, ApiResponse } from '../types';

interface GripRequest {
    id: string;
    name: string;
    price: number;
    brand: string;
    thickness: number;
    length: number;
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

// Get all grips
export const getAllGrips = async (
    req: Request,
    res: Response<ApiResponse<Grip[]>>
) => {
    try {
        const grips = await GripModel.find();
        res.json({
            success: true,
            data: grips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch grips'
        });
    }
};

// Add a new grip
export const addGrip = async (
    req: Request<object, object, GripRequest>,
    res: Response<ApiResponse<Grip>>
) => {
    const { id, name, price, brand, thickness, length, colors } = req.body;
    try {
        if (!id || !name || !price || !brand || !thickness || !length || !colors) {
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

        const newGrip = new GripModel({
            id,
            name,
            price,
            brand,
            thickness,
            length,
            colors,
        });

        const savedGrip = await newGrip.save();
        res.status(201).json({
            success: true,
            data: savedGrip,
            message: 'Grip added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add grip'
        });
    }
};

// Update a grip
export const updateGrip = async (
    req: Request<{ id: string }, object, Partial<GripRequest>>,
    res: Response<ApiResponse<Grip>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        // Find the grip first
        const existingGrip = await GripModel.findOne({ id });

        if (!existingGrip) {
            return res.status(404).json({
                success: false,
                error: 'Grip not found'
            });
        }

        // Handle color updates specifically
        if (updates.colors) {
            for (const updateColor of updates.colors) {
                // Find matching color in existing grip
                const existingColorIndex = existingGrip.colors.findIndex(
                    (c: { color: string; }) => c.color === updateColor.color
                );

                if (existingColorIndex !== -1) {
                    // Color exists, update its properties
                    if (updateColor.photo) {
                        existingGrip.colors[existingColorIndex].photo = updateColor.photo;
                    }
                    if (updateColor.quantity !== undefined) {
                        existingGrip.colors[existingColorIndex].quantity = updateColor.quantity;
                    }
                }
                // Don't add new colors here - that should be done through addGripColor endpoint
            }
        }

        // Handle other updates
        const updatedData = {
            ...existingGrip.toObject(),
            ...updates,
            colors: existingGrip.colors // Preserve the modified colors array
        };

        const result = await GripModel.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        res.json({
            success: true,
            data: result,
            message: 'Grip updated successfully'
        });
    } catch (error) {
        console.error('Error updating grip:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update grip'
        });
    }
};

// Add new function to add a color to a grip
export const addGripColor = async (
    req: Request<{ id: string }, object, ColorAddRequest>,
    res: Response<ApiResponse<Grip>>
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

        // Find the grip
        const grip = await GripModel.findOne({ id });
        if (!grip) {
            return res.status(404).json({
                success: false,
                error: 'Grip not found'
            });
        }

        // Check if color already exists
        if (grip.colors.some((c: { color: string; }) => c.color === color)) {
            return res.status(400).json({
                success: false,
                error: 'Color already exists for this grip'
            });
        }

        // Add the new color
        grip.colors.push({
            color,
            photo,
            quantity
        });

        const updatedGrip = await grip.save();
        res.json({
            success: true,
            data: updatedGrip,
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

export const getGripById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Grip>>
) => {
    const { id } = req.params;
    try {
        const grip = await GripModel.findOne({ id });

        if (!grip) {
            return res.status(404).json({
                success: false,
                error: 'Grip not found'
            });
        }

        res.json({
            success: true,
            data: grip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch grip'
        });
    }
};