const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const UserActivity = require('../models/UserActivity');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const activities = await UserActivity.find({ userId: req.user.id }).sort({ timestamp: -1 });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const activities = await UserActivity.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve user activities', error: err });
    }
});

module.exports = router;
