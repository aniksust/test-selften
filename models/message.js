const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = new schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Message', messageSchema);