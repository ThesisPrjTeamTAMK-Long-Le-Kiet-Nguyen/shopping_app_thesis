import { Request, Response } from 'express';
import { ShuttlecockModel } from '../models/product';
import { Shuttlecock, ApiResponse } from '../types';

interface ShuttlecockRequest {
    id: string;
    name: string;
    price: number;
    brand: string;
    featherType: string;
    unitsPerTube: number;
    colors: Array<{
        color: string;
        photo: string;
        types: Array<{
            type: string;
            quantity: number;
            speed: number;
        }>;
    }>;
}

// Add new interface for color addition
interface ColorAddRequest {
    color: string;
    photo: string;
    types: Array<{
        type: string;
        quantity: number;
        speed: number;
    }>;
}

// Add new interface for type addition
interface TypeAddRequest {
    type: string;
    quantity: number;
    speed: number;
}

// Get all shuttlecocks
export const getAllShuttlecocks = async (
    req: Request,
    res: Response<ApiResponse<Shuttlecock[]>>
) => {
    try {
        const shuttlecocks = await ShuttlecockModel.find();
        res.json({
            success: true,
            data: shuttlecocks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch shuttlecocks'
        });
    }
};

// Add a new shuttlecock
export const addShuttlecock = async (
    req: Request<object, object, ShuttlecockRequest>,
    res: Response<ApiResponse<Shuttlecock>>
) => {
    try {
        const { id, name, price, brand, featherType, unitsPerTube, colors } = req.body;

        if (!id || !name || !price || !brand || !featherType || !unitsPerTube || !colors) {
            const missingFields = {
                id: !id,
                name: !name,
                price: !price,
                brand: !brand,
                featherType: !featherType,
                unitsPerTube: !unitsPerTube,
                colors: !colors
            };
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${Object.entries(missingFields)
                    .filter(([_, missing]) => missing)
                    .map(([field]) => field)
                    .join(', ')}`
            });
        }

        if (!Array.isArray(colors) || colors.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Colors must be a non-empty array'
            });
        }

        // Validate types array for each color
        for (const [colorIndex, color] of colors.entries()) {
            if (!color.color || !color.photo) {
                return res.status(400).json({
                    success: false,
                    error: `Color ${colorIndex + 1} missing required fields`
                });
            }

            if (!Array.isArray(color.types) || color.types.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: `Color ${colorIndex + 1} must have at least one type`
                });
            }

            // Validate each type
            for (const [typeIndex, type] of color.types.entries()) {
                if (!type.type || type.quantity === undefined || type.speed === undefined) {
                    return res.status(400).json({
                        success: false,
                        error: `Type ${typeIndex + 1} in color ${colorIndex + 1} has missing required fields`
                    });
                }
            }
        }

        const newShuttlecock = new ShuttlecockModel({
            id,
            name,
            price,
            brand,
            featherType,
            unitsPerTube,
            colors,
        });

        const savedShuttlecock = await newShuttlecock.save();
        
        res.status(201).json({
            success: true,
            data: savedShuttlecock,
            message: 'Shuttlecock added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to add shuttlecock: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
};

// Update a shuttlecock
export const updateShuttlecock = async (
    req: Request<{ id: string }, object, Partial<ShuttlecockRequest>>,
    res: Response<ApiResponse<Shuttlecock>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        // Find the shuttlecock first
        const existingShuttlecock = await ShuttlecockModel.findOne({ id });

        if (!existingShuttlecock) {
            return res.status(404).json({
                success: false,
                error: 'Shuttlecock not found'
            });
        }

        // Handle color updates specifically
        if (updates.colors) {
            for (const updateColor of updates.colors) {
                // Find matching color in existing shuttlecock
                const existingColorIndex = existingShuttlecock.colors.findIndex(
                    (c: { color: string; }) => c.color === updateColor.color
                );

                if (existingColorIndex !== -1) {
                    // Color exists, update its properties
                    if (updateColor.photo) {
                        existingShuttlecock.colors[existingColorIndex].photo = updateColor.photo;
                    }

                    // Update types if provided
                    if (updateColor.types) {
                        for (const updateType of updateColor.types) {
                            // Find matching type in existing color
                            const existingTypeIndex = existingShuttlecock.colors[existingColorIndex].types.findIndex(
                                (t: { type: string; }) => t.type === updateType.type
                            );

                            if (existingTypeIndex !== -1) {
                                // Type exists, update quantity and speed
                                const existingType = existingShuttlecock.colors[existingColorIndex].types[existingTypeIndex];
                                existingType.quantity = updateType.quantity;
                                if (updateType.speed !== undefined) {
                                    existingType.speed = updateType.speed;
                                }
                            }
                            // Don't add new types here - that should be done through addShuttlecockType endpoint
                        }
                    }
                }
                // Don't add new colors here - that should be done through addShuttlecockColor endpoint
            }
        }

        // Handle other updates
        const updatedData = {
            ...existingShuttlecock.toObject(),
            ...updates,
            colors: existingShuttlecock.colors // Preserve the modified colors array
        };

        const result = await ShuttlecockModel.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        res.json({
            success: true,
            data: result,
            message: 'Shuttlecock updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update shuttlecock'
        });
    }
};

export const getShuttlecockById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Shuttlecock>>
) => {
    const { id } = req.params;
    try {
        const shuttlecock = await ShuttlecockModel.findOne({ id });

        if (!shuttlecock) {
            return res.status(404).json({
                success: false,
                error: 'Shuttlecock not found'
            });
        }

        res.json({
            success: true,
            data: shuttlecock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch shuttlecock'
        });
    }
};

// Add new function to add a color to a shuttlecock
export const addShuttlecockColor = async (
    req: Request<{ id: string }, object, ColorAddRequest>,
    res: Response<ApiResponse<Shuttlecock>>
) => {
    const { id } = req.params;
    const { color, photo, types } = req.body;

    try {
        // Validate required fields
        if (!color || !photo || !types || !Array.isArray(types) || types.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Color, photo, and at least one type are required'
            });
        }

        // Find the shuttlecock
        const shuttlecock = await ShuttlecockModel.findOne({ id });
        if (!shuttlecock) {
            return res.status(404).json({
                success: false,
                error: 'Shuttlecock not found'
            });
        }

        // Check if color already exists
        if (shuttlecock.colors.some((c: { color: string; }) => c.color === color)) {
            return res.status(400).json({
                success: false,
                error: 'Color already exists for this shuttlecock'
            });
        }

        // Add the new color
        shuttlecock.colors.push({
            color,
            photo,
            types: types.map(t => ({
                type: t.type,
                quantity: t.quantity,
                speed: t.speed
            }))
        });

        const updatedShuttlecock = await shuttlecock.save();
        res.json({
            success: true,
            data: updatedShuttlecock,
            message: 'Color added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add color'
        });
    }
};

// Add new function to add a type to an existing color
export const addShuttlecockType = async (
    req: Request<{ id: string; colorId: string }, object, TypeAddRequest>,
    res: Response<ApiResponse<Shuttlecock>>
) => {
    const { id, colorId } = req.params;
    const { type, quantity, speed } = req.body;

    try {
        // Validate required fields
        if (!type || quantity === undefined || speed === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Type, quantity, and speed are required'
            });
        }

        // Find the shuttlecock
        const shuttlecock = await ShuttlecockModel.findOne({ id });
        if (!shuttlecock) {
            return res.status(404).json({
                success: false,
                error: 'Shuttlecock not found'
            });
        }

        // Find the color
        const colorIndex = shuttlecock.colors.findIndex((c: { _id: { toString: () => string; }; }) => c._id.toString() === colorId);
        if (colorIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Color not found'
            });
        }

        // Check if type already exists in this color
        if (shuttlecock.colors[colorIndex].types.some((t: { type: string; }) => t.type === type)) {
            return res.status(400).json({
                success: false,
                error: 'Type already exists for this color'
            });
        }

        // Add the new type
        shuttlecock.colors[colorIndex].types.push({
            type,
            quantity,
            speed
        });

        const updatedShuttlecock = await shuttlecock.save();
        res.json({
            success: true,
            data: updatedShuttlecock,
            message: 'Type added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add type'
        });
    }
};