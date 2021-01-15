const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messagePairSchema = new schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    message: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('MessagePair', messagePairSchema);