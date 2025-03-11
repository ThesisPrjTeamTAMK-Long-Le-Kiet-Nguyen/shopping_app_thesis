import { Request, Response } from 'express';
import { ShoeModel } from '../models/product';
import { Shoe, ApiResponse } from '../types';

interface ShoeRequest {
    id: string;
    name: string;
    price: number;
    brand: string;
    series: string;
    midsole: string;
    outsole: string;
    colors: Array<{
        color: string;
        photo: string;
        types: Array<{
            size: string;
            quantity: number;
        }>;
    }>;
}

// Add new interface for color addition
interface ColorAddRequest {
    color: string;
    photo: string;
    types: Array<{
        size: string;
        quantity: number;
    }>;
}

// Add new interface for size addition
interface SizeAddRequest {
    size: string;
    quantity: number;
}

// Get all shoes
export const getAllShoes = async (
    req: Request,
    res: Response<ApiResponse<Shoe[]>>
) => {
    try {
        const shoes = await ShoeModel.find();
        res.json({
            success: true,
            data: shoes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch shoes'
        });
    }
};

// Add a new shoe
export const addShoe = async (
    req: Request<object, object, ShoeRequest>,
    res: Response<ApiResponse<Shoe>>
) => {
    const { id, name, price, brand, series, midsole, outsole, colors } = req.body;
    try {
        if (!id || !name || !price || !brand || !series || !midsole || !outsole || !colors) {
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

        const newShoe = new ShoeModel({
            id,
            name,
            price,
            brand,
            series,
            midsole,
            outsole,
            colors,
        });

        const savedShoe = await newShoe.save();
        res.status(201).json({
            success: true,
            data: savedShoe,
            message: 'Shoe added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add shoe'
        });
    }
};

// Update a shoe
export const updateShoe = async (
    req: Request<{ id: string }, object, Partial<ShoeRequest>>,
    res: Response<ApiResponse<Shoe>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        // Find the shoe first
        const existingShoe = await ShoeModel.findOne({ id });

        if (!existingShoe) {
            return res.status(404).json({
                success: false,
                error: 'Shoe not found'
            });
        }

        // Handle color updates specifically
        if (updates.colors) {
            for (const updateColor of updates.colors) {
                // Find matching color in existing shoe
                const existingColorIndex = existingShoe.colors.findIndex(
                    (c: { color: string; }) => c.color === updateColor.color
                );

                if (existingColorIndex !== -1) {
                    // Color exists, update its properties
                    if (updateColor.photo) {
                        existingShoe.colors[existingColorIndex].photo = updateColor.photo;
                    }

                    // Update sizes if provided
                    if (updateColor.types) {
                        for (const updateSize of updateColor.types) {
                            // Find matching size in existing color
                            const existingSizeIndex = existingShoe.colors[existingColorIndex].types.findIndex(
                                (t: { size: string; }) => t.size === updateSize.size
                            );

                            if (existingSizeIndex !== -1) {
                                // Size exists, update quantity
                                existingShoe.colors[existingColorIndex].types[existingSizeIndex].quantity = updateSize.quantity;
                            }
                            // Don't add new sizes here - that should be done through addShoeSize endpoint
                        }
                    }
                }
                // Don't add new colors here - that should be done through addShoeColor endpoint
            }
        }

        // Handle other updates
        const updatedData = {
            ...existingShoe.toObject(),
            ...updates,
            colors: existingShoe.colors // Preserve the modified colors array
        };

        const result = await ShoeModel.findOneAndUpdate(
            { id },
            { $set: updatedData },
            { new: true }
        );

        res.json({
            success: true,
            data: result,
            message: 'Shoe updated successfully'
        });
    } catch (error) {
        console.error('Error updating shoe:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update shoe'
        });
    }
};

export const getShoeById = async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Shoe>>
) => {
    const { id } = req.params;
    try {
        const shoe = await ShoeModel.findOne({ id });

        if (!shoe) {
            return res.status(404).json({
                success: false,
                error: 'Shoe not found'
            });
        }

        res.json({
            success: true,
            data: shoe
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch shoe'
        });
    }
};

// Add new function to add a color to a shoe
export const addShoeColor = async (
    req: Request<{ id: string }, object, ColorAddRequest>,
    res: Response<ApiResponse<Shoe>>
) => {
    const { id } = req.params;
    const { color, photo, types } = req.body;

    try {
        // Validate required fields
        if (!color || !photo || !types || !Array.isArray(types) || types.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Color, photo, and at least one size are required'
            });
        }

        // Find the shoe
        const shoe = await ShoeModel.findOne({ id });
        if (!shoe) {
            return res.status(404).json({
                success: false,
                error: 'Shoe not found'
            });
        }

        // Check if color already exists
        if (shoe.colors.some((c: { color: string; }) => c.color === color)) {
            return res.status(400).json({
                success: false,
                error: 'Color already exists for this shoe'
            });
        }

        // Add the new color
        shoe.colors.push({
            color,
            photo,
            types: types.map(t => ({
                size: t.size,
                quantity: t.quantity
            }))
        });

        const updatedShoe = await shoe.save();
        res.json({
            success: true,
            data: updatedShoe,
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

// Add new function to add a size to an existing color
export const addShoeSize = async (
    req: Request<{ id: string; colorId: string }, object, SizeAddRequest>,
    res: Response<ApiResponse<Shoe>>
) => {
    const { id, colorId } = req.params;
    const { size, quantity } = req.body;

    try {
        // Validate required fields
        if (!size || quantity === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Size and quantity are required'
            });
        }

        // Find the shoe
        const shoe = await ShoeModel.findOne({ id });
        if (!shoe) {
            return res.status(404).json({
                success: false,
                error: 'Shoe not found'
            });
        }

        // Find the color
        const colorIndex = shoe.colors.findIndex((c: { _id: { toString: () => string; }; }) => c._id.toString() === colorId);
        if (colorIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Color not found'
            });
        }

        // Check if size already exists in this color
        if (shoe.colors[colorIndex].types.some((t: { size: string; }) => t.size === size)) {
            return res.status(400).json({
                success: false,
                error: 'Size already exists for this color'
            });
        }

        // Add the new size
        shoe.colors[colorIndex].types.push({
            size,
            quantity
        });

        const updatedShoe = await shoe.save();
        res.json({
            success: true,
            data: updatedShoe,
            message: 'Size added successfully'
        });
    } catch (error) {
        console.error('Error adding size:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add size'
        });
    }
};