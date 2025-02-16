const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    try {
        // Validate input
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Password does not match' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with default role as 'customer'
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'customer' // Set default role
        });
        console.log(newUser);
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { username, email }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

exports.deleteUserAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user account' });
    }
};