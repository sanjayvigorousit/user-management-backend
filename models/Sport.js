
const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sportId: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    players: {
        type: Number,
        required: true
    },
    country: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
