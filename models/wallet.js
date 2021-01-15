const mongoose = require('mongoose');
const schema = mongoose.Schema;

const walletSchema = new schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    card: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Wallet', walletSchema);