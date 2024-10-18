const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserActivity = require('../models/UserActivity');
const authenticateToken = require('../middleware/auth');


router.post('/', authenticateToken, async (req, res) => {
    const { username, email, password, userType } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            userType,
        });

        await newUser.save();

        const userActivity = new UserActivity({
            userId: req.user.id,
            activityType: 'user_create',
            metadata: {
                createdUserId: newUser._id,
                createdUsername: newUser.username,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            },
            timestamp: new Date()
        });

        await userActivity.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId).select('-password'); // Exclude the password field from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Failed to update user' });
        }

        const userActivity = new UserActivity({
            userId: req.user.id,
            activityType: 'user_update',
            metadata: {
                ip: req.ip,
                userAgent: req.headers['user-agent'],
            }
        });
        await userActivity.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error', details: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfull.", user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error })
    }
});


module.exports = router;
