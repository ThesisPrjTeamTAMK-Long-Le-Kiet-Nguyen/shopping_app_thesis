// backend/src/controllers/productController.js
import { Request, Response } from 'express';
import {
    RacketModel,
    ShoeModel,
    StringingModel,
    ShuttlecockModel,
    GripModel,
    BagModel
} from '../models/product';


type ProductModel = typeof RacketModel | typeof ShoeModel | typeof StringingModel |
    typeof ShuttlecockModel | typeof GripModel | typeof BagModel;


export const getAllProducts = async (
    req: Request,
    res: Response
) => {
    try {
        const [rackets, shoes, stringings, shuttlecocks, grips, bags] = await Promise.all([
            RacketModel.find(),
            ShoeModel.find(),
            StringingModel.find(),
            ShuttlecockModel.find(),
            GripModel.find(),
            BagModel.find(),
        ]);

        const allProducts = {
            rackets,
            shoes,
            stringings,
            shuttlecocks,
            grips,
            bags,
        };

        res.json({
            success: true,
            data: allProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;
    const fullPath = req.baseUrl + req.path;
    const pathParts = fullPath.split('/');
    const productType = pathParts[2];

    try {
        let Model: ProductModel;
        switch (productType) {
            case 'rackets':
                Model = RacketModel;
                break;
            case 'bags':
                Model = BagModel;
                break;
            case 'shoes':
                Model = ShoeModel;
                break;
            case 'stringings':
                Model = StringingModel;
                break;
            case 'grips':
                Model = GripModel;
                break;
            case 'shuttlecocks':
                Model = ShuttlecockModel;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid product type',
                    details: { receivedType: productType, fullPath }
                });
        }

        const result = await Model.findOneAndDelete({ id });

        if (!result) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully',
            data: result
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Helper function to get the model based on category
const getModelByCategory = (category: string): ProductModel => {
    switch (category) {
        case 'bags':
            return BagModel;
        case 'grips':
            return GripModel;
        case 'rackets':
            return RacketModel;
        case 'shoes':
            return ShoeModel;
        case 'shuttlecocks':
            return ShuttlecockModel;
        case 'stringings':
            return StringingModel;
        default:
            throw new Error('Invalid category');
    }
};