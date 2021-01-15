const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'user',
        },
        paymentAmount: {
            type: Number,
            required: true,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        sessionKey: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }


    },
    { timestamps: true }
);

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
