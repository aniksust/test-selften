const mongoose = require('mongoose');
const { stringify } = require('uuid');
const schema = mongoose.Schema;

const topupOrderSchema = new schema({
    gameUserId:{
        type: String,
    },
    accountType: {
        type: String,
        enum: ['facebook', 'gmail']
    },
    gmailOrFacebook: {
        type: String,
    },
    password: {
        type: String,
    },

    securityCode: {
        type: String,
    },
    pair: {
        type: mongoose.Schema.ObjectId,
        ref: 'MessagePair',
    },
    selectRecharge: {
        type: mongoose.Schema.ObjectId,
        ref: 'RechargePackage',
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    topupGameId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topup',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // requestedTopupForGame: {
    //     type: String,
    // },
    status: {
        type: String,
        enum: ['cancelled', 'pending', 'completed'],
        default: 'pending',
    },
    assignedTo:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        
    },
    paid:{
        type: Boolean,
        default: false,
    },
    sslComSessionKey:{
        type: String,
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

module.exports = mongoose.model("TopupOrder", topupOrderSchema);