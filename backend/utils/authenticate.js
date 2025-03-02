const jwt = require('jsonwebtoken');

// Function to extract token from the Authorization header
const getTokenFrom = (request) => {
    const authorization = request.header('Authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
};

exports.authenticateUser = (req, res, next) => {
    const token = getTokenFrom(req); // Use the function to get the token
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the verified user to the request
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the next middleware
    } else {
        res.status(403).json({ error: 'Access denied. Admins only.' });
    }
};