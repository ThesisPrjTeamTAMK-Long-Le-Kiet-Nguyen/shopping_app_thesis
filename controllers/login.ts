import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { UserModel } from '../models/user';
import { ApiResponse } from '../types';
import config from '../utils/config';

const loginRouter = Router();

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    role: string;
    email: string;
}

loginRouter.post('/', async (
    req: Request<Record<string, never>, unknown, LoginRequest>,
    res: Response<ApiResponse<LoginResponse>>
) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            data: {
                token,
                role: user.role,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to login'
        });
    }
});

export default loginRouter;