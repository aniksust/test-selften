const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const TopupOrder = require('../models/topupOrder');
const Wallet = require('../models/wallet');
const RechargePackage = require('../models/rechargePackage');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Topup = require('./../models/topup');
const Message = require('../models/message');
const MessagePair = require('../models/messagePair');
const User = require('../models/user');
const AdminBalance = require('./../models/adminBalance');
const Diamonds = require('./../models/diamonds');
const {sslcommerz} = require('./sslCommerce');
const adminId = '5fdadfe6cc7fc11b2772b5e0';

exports.topupOrdersByUser = async (req, res, next)=>{
    try{
        const {userId} = req.params;
        const topuporders = await TopupOrder.find({ user: userId, status: 'pending', paid: true}).populate('user').populate('topupGameId').populate('selectRecharge').populate('pair').populate('assignedTo');
        
        return res.json(topuporders);
    }catch(err){
        return res.status(400).json({
            error: 'Could not get topup orders'
        });
    }
}

//@GET all topup thumbs
exports.getAllTopupOrders = async (req, res, next)=>{
    try{
        const topuporder = await TopupOrder.find({ status: 'pending', paid: true}).populate('user').populate('topupGameId').populate('selectRecharge').populate('pair').populate('assignedTo');
            
        res.json(topuporder);
    }catch(err){
        return res.status(400).json({
            error: 'Could not get topup orders'
        });
    }
    
}

exports.assignTopupOrder = async (req, res)=>{
    try{
        const {adminId, topupOrderId} = req.params;

        const data = await TopupOrder.findByIdAndUpdate(topupOrderId, {assignedTo: adminId});
           
        res.json(data);
            
        
    }catch(err){
        return res.status(400).json({
            error: 'Could not assign topup orders'
        });
    }

}

//get all assigned topup orders
exports.getAllAssignedTopupOrders = async (req, res, next) => { 
    try{
        const { userId } = req.params;
        const topuporder = await TopupOrder.find({assignedTo: userId, status: 'pending', paid: true }).populate('user').populate('topupGameId').populate('selectRecharge').populate('pair');

        return res.json(topuporder);
    }catch(err){
        return res.status(400).json({
            error: 'topup Orders not found'
        });
    }
    
}


exports.SSLComSuccess = async (req, res)=>{
    try{
        const {transactionId} = req.params;
        
            //validate transaction id
        const response = await sslcommerz.transaction_status_id(transactionId);
        
        if(response.element[0].status === 'VALID' || response.element[0].status === 'VALIDATED'){
            const data = await TopupOrder.findById(transactionId);

            if(!data){
                return res.status(400).json({error: 'Invalid transaction id'});
            }
            //save order as paid
            data.paid = true;
            await data.save();

            //deduct admin balance
            const bl = await AdminBalance.find();
            if(bl){
                if(Number(bl[0].balance) > Number(response.element[0].currency_amount)){
                    bl[0].balance = Number(bl[0].balance) - Number(response.element[0].currency_amount);
                    await bl[0].save();
                    
                    //create diamonds
                    const diamondAmount = parseInt(Number(response.element[0].currency_amount) / Number(bl[0].takaPerDiamond));
                    const diamond = await Diamonds.findOne({user: data.user});
                    
                    if(!diamond){
                        const newDiamond = new Diamonds({
                            user: data.user,
                            amount: diamondAmount,
                        });
                        await newDiamond.save();
                    }
                    if(diamond){
                        diamond.amount = Number(diamond.amount) + diamondAmount;
                        await diamond.save();
                    }
                    
                }
            }
            //send message
            let newMessage = new Message({
                user: adminId,
                receiver: data.user,
                message: `Your topup order no:- ${transactionId} has been created. Someone will start working on it in a moment`,
            })
            const message = await newMessage.save();
                const pair = await MessagePair.findOne({ $or: [{ $and: [{ user: data.user }, { receiver: data.user }] }, { $and: [{ user: data.user }, { receiver: data.user }] }] });

                if (pair){ 
                    pair.message.push(message);
                    await pair.save();
                    //save pair id to topup order
                    data.pair = pair;
                    await data.save()
                    return res.redirect(`${process.env.SITE_URL}/topup-order/success/${transactionId}`)
                }
                if (!pair) {
                    const msgId = message._id
                    const newPair = new MessagePair({
                        user: adminId,
                        receiver: data.user,
                        message: [msgId],
                    })
                    const newpair = await newPair.save();
                        //save pair id to topup order
                    data.pair = newpair;
                    const newOrder = await data.save();
                    //redirect to success page
                    return res.redirect(`${process.env.SITE_URL}/topup-order/success/${transactionId}`);
                    
                    
                }
        }else{
            const del = await TopupOrder.findByIdAndDelete(transactionId);
            return res.redirect(`${process.env.SITE_URL}/topup-order/fail/${transactionId}`);
            
        }
    }catch(err){
        res.status(400).json({error: 'Order saving failed'});
    }
    
}

exports.SSLComFail = (req, res)=>{
    const {transactionId} = req.params;
    TopupOrder.findByIdAndDelete(transactionId).then(del=>{
        res.redirect(`${process.env.SITE_URL}/topup-order/fail/${transactionId}`);
    })
}

exports.createTopupOrder = (req, res, next) => {
        const { userId, topupGameId, withSSLCommerz } = req.params;
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        
    form.parse(req, (err, fields, files) => {
            
        if (err) {
                
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
            
        Topup.findById(topupGameId).then(topup => {
        
            
            if (!topup) {
                return res.status(400).json({
                    error: 'Game invalid'
                });
            }
            
            const { gameUserId, accountType, gmailOrFacebook, password, securityCode, selectRecharge } = fields;
            
            

            if (topup && topup.type === 'inGame') {
                

                if (!accountType) {
                        
                    return res.status(400).json({
                        error: 'Account Type field is required'
                    });
                }
                if (!gmailOrFacebook) {
                        
                    return res.status(400).json({
                        error: 'Gmail or Facebook number field is required'
                    });
                }
                if (!password) {
                        
                    return res.status(400).json({
                        error: 'Password Type field is required'
                    });
                }
                if (accountType === 'gmail' && !securityCode) {
                        
                    return res.status(400).json({
                        error: 'Security Code Type field is required for gmail'
                    });
                }
                if (!selectRecharge) {
                        
                    return res.status(400).json({
                        error: 'Recharge Package field is required'
                    });
                }
                if (!topupGameId) {
                        
                    return res.status(400).json({
                        error: 'You are in a wrong url'
                    });
                }
            }

            if(topup && topup.type === 'codeId'){

                if (!gameUserId ) {
                    
                    return res.status(400).json({
                        error: 'Account Type field is required'
                    });
                }
                if (!password ) {
                    
                    return res.status(400).json({
                        error: 'Password Type field is required'
                    });
                }
                if (!selectRecharge ) {
                    
                    return res.status(400).json({
                        error: 'Recharge Package field is required'
                    });
                }
                if (!topupGameId ) {
                    
                    return res.status(400).json({
                        error: 'You are in a wrong url'
                    });
                }
            }
                
                
                //get price
                RechargePackage.findById(selectRecharge)
                    .then(package => {
                        
                        let topuporder = new TopupOrder(fields);
                        topuporder.topupGameId = topupGameId;
                        topuporder.user = userId;
                        const price = Number(package.packageAmount);
                        topuporder.price = price;
                        
                        // if ssl commerce pays
                        if(withSSLCommerz === 'y'){
                             
                            topuporder.save((err, result) => {
                                if (err) {
                                            console.log('Topup Order CREATE ERROR ', err);
                                            return res.status(400).json({
                                                error: errorHandler(err)
                                            });
                                        }
                                
                                // ssl commerce data map
                                User.findById(userId).then(user=>{
                                    const data = {
                                        currency: "BDT",
                                        product_name: package.packageName,
                                        total_amount: price,
                                        tran_id: result._id,
                                        product_category: "Topup",
                                        success_url: `${process.env.SITE_URL}/api/topup-order/success/${result._id}`,
                                        fail_url: `${process.env.SITE_URL}/api/topup-order/fail/${result._id}`,
                                        cancel_url: `${process.env.SITE_URL}/api/topup-order/cancell/${result._id}`,
                                        cus_name: user.name,
                                        cus_email: user.email,
                                        cus_add1: user.address,
                                        cus_city: user.city,
                                        cus_postcode: user.postCode,
                                        cus_country: "Bangladesh",
                                        cus_phone: user.phone,
                                        shipping_method: 'NO',
                                        ipn_url: "",
                                        num_of_item: 1,
                                        value_a: result._id,
                                        GatewayPageURL: "",
                                        emi_option: 0,
                                        product_profile: "non-physical-goods",
                                    }
                                   
                                    sslcommerz.init_transaction(data).then(response => {
                                        
                                        if(response.status === 'SUCCESS'){
                                            result.sslComSessionKey = response.sessionkey;
                                            result.save();
                                            return res.json(response);
                                        }else{
                                            return res.status(400).json({error: 'Error: try to fill address information, city, zipcode etc if empty'})
                                        }
                                        
                                    }).catch(error => {
                                        return console.log(error);
                                    })
                                    
                                })

                            })
                        }

                        // if paid by wallet
                        if(withSSLCommerz === 'n'){
                            // check user wallet and deduct price
                            Wallet.findOne({ user: userId }).then(userWallet => {
                                if (price > Number(userWallet.amount)) {
                                    return res.status(400).json({
                                        error: "User wallet is insufficient",
                                    });
                                } else {
                                    

                                    const leftAmount = Number(userWallet.amount) - Number(price);
                                    userWallet.amount = leftAmount;
                                    userWallet.save()
                                    .then(wallet => {
                                        
                                        
                                        //mark paid as true
                                        topuporder.paid = true;
                                        topuporder.save((err, result) => {
                                            if (err) {
                                                console.log('Topup Order CREATE ERROR ', err);
                                                return res.status(400).json({
                                                    error: errorHandler(err)
                                                });
                                            }

                                            //deduct admin balance
                                            AdminBalance.find().then(bl=>{
                                                if(bl){
                                                    if(Number(bl[0].balance) > Number(price)){
                                                        bl[0].balance = Number(bl[0].balance) - Number(price);
                                                        bl[0].save();
                                                    }

                                                    //create diamonds
                                                    const diamondAmount = parseInt(Number(price) / Number(bl[0].takaPerDiamond));
                                                    Diamonds.findOne({user: userId})
                                                    .then(diamond=>{
                                                        if(!diamond){
                                                            const newDiamond = new Diamonds({
                                                                user: userId,
                                                                amount: diamondAmount,
                                                            });
                                                            newDiamond.save();
                                                        }
                                                        if(diamond){
                                                            diamond.amount = Number(diamond.amount) + diamondAmount;
                                                            diamond.save();
                                                        }
                                                    })
                                                }
                                            })
                                            

                                            //send message
                                            let newMessage = new Message({
                                                user: adminId,
                                                receiver: userId,
                                                message: `Your topup order no:- ${result._id} has been created. Someone will start working on it in a moment`,
                                            });

                                            newMessage.save().then(message => {
                                                
                                                MessagePair.findOne({ $or: [{ $and: [{ user: userId }, { receiver: userId }] }, { $and: [{ user: userId }, { receiver: userId }] }] })
                                                    .then(pair => {
                                                        
                                                        if (pair) {
                                                            
                                                            
                                                            pair.message.push(message);
                                                            pair.save()
                                                                //save pair id to topup order
                                                                result.pair = pair;
                                                                result.save();
                                                                res.json({ message: 'updated' })
                                                            
                                                            
                                                        }
                                                        if (!pair) {
                                                            const msgId = message._id;



                                                            const newPair = new MessagePair({
                                                                user: adminId,
                                                                receiver: userId,
                                                                message: [msgId],
                                                            });

                                                            newPair.save().then(newpair => {
                                                                //save pair id to topup order
                                                                result.pair = newpair;
                                                                result.save();
                                                                res.json(result);
                                                            }).catch(err => {
                                                                console.log(err);
                                                            })
                                                        }
                                                    })
                                            })
                                                
                                        })
                                    })
                                }
        
                                    
        
                            })
                        }
                            
                            
                        
                    })
            
                
                
                // check for all fields
                

            }).catch(err=>{
                return res.status(400).json({
                    error: 'Game invalid'
                });
            })
            

            
            
    

        });
    };



exports.getTopupOrderById = async (req, res, next, id) => {
    try{
        const topupOrder = await TopupOrder.findById(id);
        req.topupOrder = topupOrder;
        next();

    }catch(err){
        return res.status(400).json({
            error: 'Topup Order not found'
        });
    }

    
};
 
exports.updateTopupOrderById = async (req, res, next) => {
    try{
        const { userId, topupOrderId, status, customerId } = req.params;
        const topupOrder = await TopupOrder.findByIdAndUpdate(topupOrderId, { status: status });

        //send message
        let newMessage = new Message({
            user: userId,
            receiver: customerId,
            message: `Your topup order no:- ${topupOrderId} has been ${status}`,
        })
        const message = await newMessage.save();

        const pair = await MessagePair.findOne({ $or: [{ $and: [{ user: userId }, { receiver: customerId }] }, { $and: [{ user: customerId }, { receiver: userId }] }] })
        
            
        if (pair) {
            
            const msgId = message._id;
            pair.message.push(message);
            await pair.save();
            
            return res.json({message: 'updated'})
            
        }
        if (!pair) {
            const msgId = message._i
            const newPair = new MessagePair({
                user: userId,
                receiver: customerId,
                message: [msgId],
            });
            const newpair = await newPair.save();
            return res.json({message: 'updated'})
            
        }
    
    }catch(err){
            return res.status(400).json({
                error: 'Topup Order could not be updated'
            });
        }
}
exports.deleteTopupOrderById = async (req, res, next)=>{
    try{
        const topups = await TopupOrder.find();
        res.json(topups);
    }catch(err){
        return res.status(400).json({
            error: 'Topup Order could not be deleted'
        });
    }

}