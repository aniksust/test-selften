const mongoose = require('mongoose');
const schema = mongoose.Schema;

const topupSchema = new schema({
    title: {
        type: String,
        required: [true, 'New top up system needs a title']
    },
    region: {
        type: String,
        trim: true,
    },
    platform: {
        type: String,
        trim: true,
    },
    publisher: {
        type: String,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    },
    thumb:{
        data: Buffer,
        contentType: String
    },
    type: {
        type: String,
        enum: ['inGame', 'idCode']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Topup', topupSchema);