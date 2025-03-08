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
    colors: string[];
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

        // Update the bag with the new data
        const updatedData = {
            ...existingBag.toObject(),
            ...updates,
            // If colors are being updated, replace the entire colors array
            ...(updates.colors && { colors: updates.colors })
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