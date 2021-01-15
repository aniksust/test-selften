const formidable = require('formidable');
const user = require('../models/user');
const User = require('../models/user');
const Coupon  = require('./../models/coupon');


exports.getCouponsByUser = async (req, res)=>{
    try{
        const {userId} = req.params;

    
        const user = await User.findById(userId);
        return res.json(user);

    }catch(err){
        res.status(400).json({error: 'No coupon found'})
    }

    
}

exports.collectCoupon = async (req, res) =>{
    try{

    const { userId, couponId } = req.params;

    const coupon = await Coupon.findById(couponId);
        
        const user = await User.findById(userId)
        if(!user.coupon){
            user.coupon = coupon;
            await user.save();
            return res.json(coupon)
        }
        if(user.coupon){
            user.coupon.push(coupon);
            await user.save();
            res.json(coupon);
            
        }
    }
    catch(err){
        return res.status(400).json({error: 'Invalid coupon id'});
    }
        
    
}

exports.addCoupon = async (req, res)=>{
    try{
                let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        
        form.parse(req, async (err, fields, files) => {
            const { couponName, couponCode, shortDetails, diamonds, discounts} = fields;
            if( !couponName || !couponCode || !shortDetails || !diamonds || !discounts) {
                return res.status(400).json({
                    error: 'Some fields are missing'
                });
            }

            const newCoupon = Coupon({
                couponName, 
                couponCode, 
                shortDetails, 
                diamonds, 
                discounts
            });

            const coupon = await newCoupon.save()
                
            return res.json(coupon);    
        
        })
    }catch(err){
        return res.status(400).json({error: 'Coupon was not created'})
    }

}
exports.showCoupon = async (req, res)=>{       
    try{
        const coupon = await Coupon.find();
        return res.json(coupon);

    }
    catch(err){
        res.status(400).json({
                error: 'Coupon could not found'
            });
    }
}