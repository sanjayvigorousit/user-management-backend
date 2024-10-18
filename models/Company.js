const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Number,
        default: () => Date.now(),
    }
});

module.exports = mongoose.model('Company', CompanySchema);
