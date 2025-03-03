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
    colors: string[];
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
    req: Request<{}, {}, ShoeRequest>,
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
    req: Request<{ id: string }, {}, Partial<ShoeRequest>>,
    res: Response<ApiResponse<Shoe>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const result = await ShoeModel.findOneAndUpdate(
            { id },
            { $set: updates },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Shoe not found'
            });
        }

        res.json({
            success: true,
            data: result,
            message: 'Shoe updated successfully'
        });
    } catch (error) {
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