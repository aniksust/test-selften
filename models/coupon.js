const mongoose = require('mongoose');
const schema = mongoose.Schema;

const couponSchema = new schema({
    couponName: {
        type: String,
    },
    couponCode: {
        type: String,
    },
    shortDetails: {
        type: String,
    },
    discounts: {
        type: Number,
    },
    diamonds: {
        type: Number,
    },
    available: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('Coupon', couponSchema);