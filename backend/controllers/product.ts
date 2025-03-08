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

// New interface for delete requests
interface DeleteRequest {
  colorId?: string;
  typeId?: string;
}

// Delete a specific type from a color
export const deleteProductType = async (
    req: Request<{ id: string; colorId: string; typeId: string }>,
    res: Response
) => {
    const { id, colorId, typeId } = req.params;
    const productType = req.path.split('/')[1];

    try {
        const Model = getModelByCategory(productType);
        const product = await Model.findOne({ id });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Find the color and remove the specific type
        const colorIndex = product.colors.findIndex(
            (color: any) => color._id.toString() === colorId
        );

        if (colorIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Color not found'
            });
        }

        const typeIndex = product.colors[colorIndex].types.findIndex(
            (type: any) => type._id.toString() === typeId
        );

        if (typeIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Type not found'
            });
        }

        // Remove the type
        product.colors[colorIndex].types.splice(typeIndex, 1);

        // If no types left, remove the color
        if (product.colors[colorIndex].types.length === 0) {
            product.colors.splice(colorIndex, 1);
        }

        // If no colors left, delete the entire product
        if (product.colors.length === 0) {
            await Model.findOneAndDelete({ id });
            return res.json({
                success: true,
                message: 'Product deleted as it has no colors remaining',
                data: null
            });
        }

        const updatedProduct = await product.save();

        res.json({
            success: true,
            message: 'Product type deleted successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Delete type error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product type',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Delete an entire color and its types
export const deleteProductColor = async (
    req: Request<{ id: string; colorId: string }>,
    res: Response
) => {
    const { id, colorId } = req.params;
    const productType = req.path.split('/')[1];

    try {
        const Model = getModelByCategory(productType);
        const product = await Model.findOne({ id });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        // Find and remove the color
        const colorIndex = product.colors.findIndex(
            (color: any) => color._id.toString() === colorId
        );

        if (colorIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Color not found'
            });
        }

        // Remove the color
        product.colors.splice(colorIndex, 1);

        // If this was the last color, delete the entire product
        if (product.colors.length === 0) {
            await Model.findOneAndDelete({ id });
            return res.json({
                success: true,
                message: 'Product deleted as it has no colors remaining',
                data: null
            });
        }

        const updatedProduct = await product.save();

        res.json({
            success: true,
            message: 'Product color deleted successfully',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Delete color error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product color',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};