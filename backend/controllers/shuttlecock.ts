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
    colors: string[];
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
    const { id, name, price, brand, featherType, unitsPerTube, colors } = req.body;
    try {
        if (!id || !name || !price || !brand || !featherType || !unitsPerTube || !colors) {
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
            error: 'Failed to add shuttlecock'
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

        // Update the shuttlecock with the new data
        const updatedData = {
            ...existingShuttlecock.toObject(),
            ...updates,
            // If colors are being updated, replace the entire colors array
            ...(updates.colors && { colors: updates.colors })
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
        console.error('Error updating shuttlecock:', error);
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