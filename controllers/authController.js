import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// ✅ Generate token with both userId and name
const generateToken = (userId, name) => {
    return jwt.sign({ id: userId, name }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// ✅ Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.name), // ✅ fixed
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ✅ Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, user.name), // ✅ fixed
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
