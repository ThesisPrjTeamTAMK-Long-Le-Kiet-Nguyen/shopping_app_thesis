import { Request, Response } from 'express';
import { CartModel } from '../models/cart';
import { Cart, CartItem, ApiResponse } from '../types';

// Extended Request type to include user property from auth middleware
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

interface AddToCartRequest {
    id: string;
    name: string;
    quantity: number;
    color: string;
    type?: string;
    price: number;
}

interface UpdateQuantityRequest {
    quantity: number;
}

export const addToCart = async (
    req: AuthRequest,
    res: Response<ApiResponse<Cart>>
) => {
    const { id, name, quantity, color, type, price } = req.body as AddToCartRequest;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated'
        });
    }

    try {
        // Find the cart for the user
        let cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = new CartModel({
                userId,
                items: []
            });
        }

        // Fixed: Added type for item parameter
        const existingItemIndex = cart.items.findIndex(
            (item: CartItem) => item.id === id && item.color === color
        );

        if (existingItemIndex > -1) {
            // If it exists, update the quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // If it doesn't exist, add a new item
            const newItem: CartItem = {
                id,
                name,
                quantity,
                color,
                type,
                price
            };
            cart.items.push(newItem);
        }

        // Save the updated cart
        const updatedCart = await cart.save();

        res.status(201).json({
            success: true,
            data: updatedCart,
            message: 'Item added to cart successfully'
        });
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add item to cart'
        });
    }
};

export const getCart = async (
    req: AuthRequest,
    res: Response<ApiResponse<Cart | { items: [] }>>
) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated'
        });
    }

    try {
        const cart = await CartModel.findOne({ userId });
        res.json({
            success: true,
            data: cart || { items: [] }
        });
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cart'
        });
    }
};

export const removeFromCart = async (
    req: AuthRequest,
    res: Response<ApiResponse<Cart>>
) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated'
        });
    }

    try {
        // Find the cart for the user
        const cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        // Fixed: Added type for item parameter
        const itemIndex = cart.items.findIndex((item: CartItem) => item.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);

        // Save the updated cart
        const updatedCart = await cart.save();

        res.json({
            success: true,
            data: updatedCart,
            message: 'Item removed from cart successfully'
        });
    } catch (error) {
        console.error('Failed to remove item from cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove item from cart'
        });
    }
};

export const updateCartItemQuantity = async (
    req: AuthRequest,
    res: Response<ApiResponse<Cart>>
) => {
    const { id } = req.params;
    const { quantity } = req.body as UpdateQuantityRequest;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated'
        });
    }

    if (quantity < 0) {
        return res.status(400).json({
            success: false,
            error: 'Quantity cannot be negative'
        });
    }

    try {
        const cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex((item: CartItem) => item.id === id);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        if (quantity === 0) {
            // Remove the item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Update the quantity if greater than 0
            cart.items[itemIndex].quantity = quantity;
        }

        // Save the updated cart
        const updatedCart = await cart.save();

        res.json({
            success: true,
            data: updatedCart,
            message: quantity === 0 
                ? 'Item removed from cart successfully'
                : 'Cart item quantity updated successfully'
        });
    } catch (error) {
        console.error('Failed to update cart item quantity:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update cart item quantity'
        });
    }
};

export const clearCart = async (
    req: AuthRequest,
    res: Response<ApiResponse<void>>
) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            error: 'User not authenticated'
        });
    }

    try {
        const cart = await CartModel.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: 'Cart not found'
            });
        }

        // Clear all items from the cart
        cart.items = [];
        await cart.save();

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Failed to clear cart:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear cart'
        });
    }
};

export default {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
};