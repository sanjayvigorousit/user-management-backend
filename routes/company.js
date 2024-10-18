const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Company = require('../models/Company');

router.post('/', authenticateToken, async (req, res) => {
    const { companyName, email, contactNumber, website } = req.body;

    try {
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company already exists' });
        }
        const newCompany = new Company({
            companyName,
            email,
            contactNumber,
            website,
        });
        await newCompany.save();
        res.status(201).json({ message: 'Company registered successfully' });
    } catch (error) {

    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const company = await Company.find();
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve company', error: err })
    }
});

module.exports = router;