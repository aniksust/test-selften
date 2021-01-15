const formidable = require('formidable');
const Wallet = require('../models/wallet');
const {sslcommerz} = require('./sslCommerce');
const PaymentHistory = require('./../models/paymentHistory');
const User = require('./../models/user');
const adminId = '5fdadfe6cc7fc11b2772b5e0';
const MessagePair = require('./../models/messagePair');
const Message = require('./../models/message')

exports.getWallet = async (req, res, next)=>{
    try{
        const {userId} = req.params;
        const wallet =  await Wallet.findOne({user: userId});
        
        if(!wData){
            return res.json({});
        }

        return res.json(wallet);
    }catch(err){
        return res.status(400).json({
                error: 'RechargePackage not found'
            });
    }

        
    
}

exports.addWallet = async (req, res, next) =>{
    try{
        
        const {userId} = req.params;
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields) => {
            const {amount} = fields;

            if(!amount){
                return res.status(400).json({
                    error: 'Amount field is missing'
                });
            } 
            if(amount < 10){
                return res.status(400).json({
                    error: 'Minimum amount 10'
                });
            }

            //add to history as not approved
            // approve after payment
            const newHistory = new PaymentHistory({
                user: userId,
                paymentAmount: amount,
                approved: false,
            });

            const tempHistory = await newHistory.save();

            const user = await User.findById(userId);

            const {address, city, postCode} = user;
            if(!address){
                return res.status(400).json({
                    error: 'Your profile is missing address. Pease fill address first'
                });
            }
            if(!city){
                return res.status(400).json({
                    error: 'Your profile is missing city. Pease fill city first'
                });
            }
            if(!postCode){
                return res.status(400).json({
                    error: 'Your profile is missing postal code. Pease fill postal code first'
                });
            }

            // ask for payment
            const data = {
                currency: "BDT",
                product_name: "Topup to wallet",
                total_amount: amount,
                tran_id: tempHistory._id,
                product_category: "Topup",
                success_url: `${process.env.SITE_URL}/api/wallet/success/${tempHistory._id}`,
                fail_url: `${process.env.SITE_URL}/api/wallet/fail/${tempHistory._id}`,
                cancel_url: `${process.env.SITE_URL}/api/wallet/cancell/${tempHistory._id}`,
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
                value_a: tempHistory._id,
                GatewayPageURL: "",
                emi_option: 0,
                product_profile: "non-physical-goods",
            }
                                    
            const response = await sslcommerz.init_transaction(data)
                
            if(response.status === 'SUCCESS'){
                tempHistory.sessionKey = response.sessionkey;
                await tempHistory.save();

                return res.json(response);
            }
            
                   



        })
    }
    catch(err){
        return console.log(error);
    }

}


exports.success = async (req, res)=>{
    try{
        const {transactionId} = req.params;
        const response = await sslcommerz.transaction_status_id(transactionId);

         if(response.element[0].status === 'VALID' || response.element[0].status === 'VALIDATED'){
            const paymentHistory = await PaymentHistory.findById(transactionId);
            const wallet = await Wallet.findOne({user: paymentHistory.user});
            if(paymentHistory.approved === false){
                wallet.amount = wallet.amount + paymentHistory.paymentAmount;
                paymentHistory.approved === true;
                const savedWallet = await wallet.save();
                const savedHistory = await paymentHistory.save();

                //send message
                let newMessage = new Message({
                    user: adminId,
                    receiver: savedWallet.user,
                    message: `Your wallet has been recharged. Transaction history id:- ${transactionId}`,
                });

                const message = await newMessage.save();

                const pair = await MessagePair.findOne({ $or: [{ $and: [{ user: savedWallet.user }, { receiver: savedWallet.user }] }, { $and: [{ user: savedWallet.user }, { receiver: savedWallet.user }] }] })

                if (!pair) {
                    const msgId = message._id;
                    const newPair = new MessagePair({
                        user: adminId,
                        receiver: savedWallet.user,
                        message: [msgId],
                    });

                    const newpair = await newPair.save();
                    //save pair id to topup order
                    
                                    
                    //redirect to success page
                    return res.redirect(`${process.env.SITE_URL}/topup-order/success/${transactionId}`);
                }
                    
                if (pair) {
                    pair.message.push(message);
                    pair.save();
                            
                    return res.redirect(`${process.env.SITE_URL}/topup-order/success/${transactionId}`);

                                                            
                }
                        

            }
         }else{
            PaymentHistory.findByIdAndDelete(transactionId).then(del=>{
                return res.redirect(`${process.env.SITE_URL}/topup-order/fail/${transactionId}`);
            }).catch(err=>{
                console.log(err);
            })
        }
            
        


    }    
    catch(err){
        console.log(err);
    }
}

exports.fail = async (req, res)=>{
    const {transactionId} = req.params;
    const del = await PaymentHistory.findByIdAndDelete(transactionId);
    
    return res.redirect(`${process.env.SITE_URL}/topup-order/fail/${transactionId}`);
    
}