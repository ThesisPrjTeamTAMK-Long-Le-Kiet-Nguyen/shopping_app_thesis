import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user';
import { User, ApiResponse } from '../types';

interface RegisterUserRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

interface UpdateUserRequest {
    email?: string;
}

// Extended Request type to include user property from auth middleware
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const registerUser = async (
    req: Request<Record<string, never>, unknown, RegisterUserRequest>,
    res: Response<ApiResponse<User>>
) => {
    const { email, password, confirmPassword } = req.body;
    
    try {
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'Password does not match'
            });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            email,
            password: hashedPassword,
            role: 'customer'
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to register user'
        });
    }
};

export const getUserProfile = async (
    req: AuthRequest,
    res: Response<ApiResponse<User>>
) => {
    try {
        const user = await UserModel.findById(req.user?.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user profile'
        });
    }
};

export const updateUserProfile = async (
    req: AuthRequest,
    res: Response<ApiResponse<User>>
) => {
    const { email } = req.body as UpdateUserRequest;
    try {
        const user = await UserModel.findByIdAndUpdate(
            req.user?.id,
            { email },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update user profile'
        });
    }
};

export const deleteUserAccount = async (
    req: AuthRequest,
    res: Response<ApiResponse<null>>
) => {
    try {
        await UserModel.findByIdAndDelete(req.user?.id);
        res.json({
            success: true,
            message: 'User account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete user account'
        });
    }
};