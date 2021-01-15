const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const RechargePackage = require('../models/rechargePackage');

//@GET all RechargePackage thumbs
exports.getAllRechargePackages = async (req, res, next)=>{
    try{
        const rechargePackage = await RechargePackage.find().populate('topupGameName');

        res.json(rechargePackage);
    }

    catch(err){
        return res.status(400).json({
            error: 'RechargePackage not found'
        });
    }
    
    
}

exports.getRechargePackageByGameId = async (req, res, next)=>{
    try{
        const {gameId} = req.params;
        const rechargePackage = await RechargePackage.find({topupGameName: gameId}).populate('topupGameName');
        console.log(rechargePackage)
        
        res.json(rechargePackage);
    }catch(err){
        return res.status(400).json({
            error: 'RechargePackage not found'
        });
    }
}

exports.createRechargePackage = async (req, res) => {
    try{
        
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        
        form.parse(req, async (err, fields) => {
            
            // check for all fields
            const { topupGameName, packageName, packageAmount } = fields;
            
            if ( !topupGameName ) {
                
                return res.status(400).json({
                    error: 'Game Name field is missing'
                });
            }
            if ( !packageAmount ) {
                
                return res.status(400).json({
                    error: 'Package amount is missing'
                });
            }
            if ( !packageName ) {
                
                return res.status(400).json({
                    error: 'Package Name field is missing'
                });
            }
            
            
            let rechargePackage = new RechargePackage(fields);
    
            // 1kb = 1000
            // 1mb = 1000000
            
            
    
            const result = await rechargePackage.save();
            
              
            res.json(result);
            
        });
    }catch(err){
        return res.status(400).json({
            error: 'RechargePackage not created'
        });
    }
}




exports.getRechargePackageById = async (req, res, next, id) => {
    try{
        const rechargePackage = await RechargePackage.findById(id)
        .populate('topupGameName');
        req.rechargePackage = rechargePackage;
        next();
    }catch(err){
        return res.status(400).json({
            error: 'Recharge Package not found'
        });
    } 
};

exports.updateRechargePackageById = async (req, res, next)=>{
    try{
        const {packageId, packageName, packageAmount} = req.params;
        if(!packageId || !packageName, !packageAmount){
            return res.status(400).json({
                error: 'Required field missing'
            });
        }
        const rechargePackage = await RechargePackage.findById(packageId);
        rechargePackage.packageName = packageName;
        rechargePackage.packageAmount = packageAmount;
        await rechargePackage.save();

        res.json(newPK);
    }catch(err){
        return res.status(400).json({
            error: 'Recharge Package not found'
        });
    }

}
exports.deleteRechargePackageById = async (req, res, next)=>{
    const {packageId} = req.params;
    const rechargePackages = await RechargePackage.findByIdAndDelete(packageId);
    res.json(rechargePackages);
}