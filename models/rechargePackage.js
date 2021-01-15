const mongoose = require('mongoose');
const schema = mongoose.Schema;

const rechargePackageSchema = new schema({
    topupGameName: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    packageAmount: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('RechargePackage', rechargePackageSchema);