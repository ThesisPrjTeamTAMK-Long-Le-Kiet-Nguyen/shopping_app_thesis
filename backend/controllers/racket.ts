import { Request, Response } from 'express';
import { RacketModel } from '../models/product';
import { Racket, ApiResponse } from '../types';

interface RacketRequest {
    id: string;
    name: string;
    price: number;
    brand: string;
    series: string;
    racketType: string;
    flexibility: string;
    material: string;
    balancePoint: number;
    cover: boolean;
    colors: string[];
}

export const getAllRackets = async (
    req: Request,
    res: Response<ApiResponse<Racket[]>>
) => {
    try {
        const rackets = await RacketModel.find();
        res.json({
            success: true,
            data: rackets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch rackets'
        });
    }
};

export const addRacket = async (
    req: Request<{}, {}, RacketRequest>,
    res: Response<ApiResponse<Racket>>
) => {
    const { id, name, price, brand, series, racketType, flexibility, material, balancePoint, cover, colors } = req.body;
    try {
        if (!id || !name || !price || !brand || !series || !racketType || !flexibility || !material || !colors) {
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

        const newRacket = new RacketModel({
            id,
            name,
            price,
            brand,
            series,
            racketType,
            flexibility,
            material,
            balancePoint,
            cover,
            colors,
        });

        const savedRacket = await newRacket.save();
        res.status(201).json({
            success: true,
            data: savedRacket,
            message: 'Racket added successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add racket'
        });
    }
};

export const updateRacket = async (
    req: Request<{ id: string }, {}, Partial<RacketRequest>>,
    res: Response<ApiResponse<Racket>>
) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const result = await RacketModel.findOneAndUpdate(
            { id },
            { $set: updates },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Racket not found'
            });
        }

        res.json({
            success: true,
            data: result,
            message: 'Racket updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update racket'
        });
    }
};