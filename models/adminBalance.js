const mongoose = require( 'mongoose');
const schema = mongoose.Schema;

const adminBalanceSchema = new schema({
    balance: {
        type: Number,
        default: 0,
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    takaPerDiamond: {
        type: Number,
        default: 1,
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
}, { capped : true, size:4000,  max : 1 });

module.exports = mongoose.model('AdminBalance', adminBalanceSchema);