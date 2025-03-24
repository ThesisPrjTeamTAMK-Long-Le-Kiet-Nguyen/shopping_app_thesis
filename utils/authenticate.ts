import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from './config';

interface AuthRequest extends Request {
    user?: jwt.JwtPayload;
}

// Function to extract token from the Authorization header
const getTokenFrom = (request: Request): string | null => {
    const authorization = request.header('Authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

export const authenticateUser = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Response | void => {
    const token = getTokenFrom(req);
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload;
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
};

// Middleware to check if the user is an admin
export const isAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Response | void => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
};

export default {
    authenticateUser,
    isAdmin
};