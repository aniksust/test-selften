const mongoose = require('mongoose');
const schema = mongoose.Schema;

const diamondSchema = new schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Diamonds', diamondSchema);