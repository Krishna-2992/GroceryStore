const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// User Registration
exports.register = async (req, res) => {
    try {
        // Destructure with optional phone
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            phone = null // Default to null if not provided
        } = req.body;

        // Check if user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            role: role || 'staff',
            phone: phone ? phone.trim() : null // Trim phone if provided, else null
        });

        // Save user
        await user.save();

        // Generate token
        const token = generateToken(user);

        // Prepare response (exclude password)
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone
        };

        res.status(201).json({
            user: userResponse,
            token
        });
    } catch (error) {
        // Handle specific mongoose validation errors
        if (error.code === 11000) {
            // Duplicate key error
            const duplicateField = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${duplicateField} already in use`
            });
        }

        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Prepare response (exclude password)
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        res.json({
            user: userResponse,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        // Find user by ID from token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        console.log("user id", req.user.id);

        // Find and update user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating profile',
            error: error.message
        });
    }
};