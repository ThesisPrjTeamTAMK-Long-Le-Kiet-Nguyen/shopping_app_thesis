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
    colors: string[];
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
    req: Request<{}, {}, GripRequest>,
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
    req: Request<{ id: string }, {}, Partial<GripRequest>>,
    res: Response<ApiResponse<Grip>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const result = await GripModel.findOneAndUpdate(
            { id },
            { $set: updates },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Grip not found'
            });
        }

        res.json({
            success: true,
            data: result,
            message: 'Grip updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update grip'
        });
    }
};