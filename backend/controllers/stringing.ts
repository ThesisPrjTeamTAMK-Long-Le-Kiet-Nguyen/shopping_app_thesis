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
    colors: string[];
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
    req: Request<{}, {}, StringingRequest>,
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
    req: Request<{ id: string }, {}, Partial<StringingRequest>>,
    res: Response<ApiResponse<Stringing>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const result = await StringingModel.findOneAndUpdate(
            { id },
            { $set: updates },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Stringing not found'
            });
        }

        res.json({
            success: true,
            data: result,
            message: 'Stringing updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update stringing'
        });
    }
};