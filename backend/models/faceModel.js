const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    faceData: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Face', faceSchema);