const express = require('express');
const router = express.Router();
const Sport = require("../models/Sport");
const authenticateToken = require("../middleware/auth");

// CREATE: Add a new sport
router.post('/', authenticateToken, async (req, res) => {
    const { name, sportId, type, players, country } = req.body;
    try {
        const newSport = new Sport({ name, sportId, type, players, country });
        await newSport.save();
        res.status(201).json(newSport);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create sport', error: err });
    }
});

// READ: Get all sports
router.get('/', authenticateToken, async (req, res) => {
    try {
        const sports = await Sport.find();
        res.status(200).json(sports);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve sports', error: err });
    }
});

// READ: Get a specific sport by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (!sport) return res.status(404).json({ message: 'Sport not found' });
        res.status(200).json(sport);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve sport', error: err });
    }
});

// UPDATE: Update a sport by ID
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        // Dynamically update based on req.body (it will update all provided fields)
        const updatedSport = await Sport.findByIdAndUpdate(
            req.params.id,
            req.body, // Pass the entire req.body to update the fields dynamically
            { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures validation
        );

        if (!updatedSport) {
            return res.status(404).json({ message: 'Sport not found' });
        }

        res.status(200).json(updatedSport);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update sport', error: err });
    }
});


// DELETE: Delete a sport by ID
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deletedSport = await Sport.findByIdAndDelete(req.params.id);
        if (!deletedSport) return res.status(404).json({ message: 'Sport not found' });
        res.status(200).json({ message: 'Sport deleted', sport: deletedSport });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete sport', error: err });
    }
});

module.exports = router;