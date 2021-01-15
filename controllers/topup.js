const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Topup = require('../models/topup');

//@GET all topup thumbs
exports.getAllTopups = async (req, res, next)=>{
    try{
        const topup = await Topup.find()
        res.json(topup);
    }catch(err){
            return res.status(400).json({
                error: 'Topup thumbs not found'
            });
    }
    
    
}
exports.createTopup = async (req, res) => {
    try{
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        
        form.parse(req, async (err, fields, files) => {
            
            if (err) {
                
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                });
            }
            // check for all fields
            const { title, type } = fields;
            
            if (!title ) {
                
                return res.status(400).json({
                    error: 'Title field is required'
                });
            }
            if (!type ) {
                
                return res.status(400).json({
                    error: 'Type field is required'
                });
            }
            
            
            let topup = new Topup(fields);
    
            // 1kb = 1000
            // 1mb = 1000000
            
            if (files.thumb) {
                // console.log("FILES PHOTO: ", files.photo);
                if (files.thumb.size > 1000000) {
                    return res.status(400).json({
                        error: 'Image should be less than 1mb in size'
                    });
                }
                topup.thumb.data = fs.readFileSync(files.thumb.path);
                topup.thumb.contentType = files.thumb.type;
            }
    
            const result = await topup.save();
            res.json(result);
            
        });
    }catch(err){
        return res.status(400).json({
            error: 'Topup create error',
        });
    }
}


//photo
exports.thumb = async (req, res, next) => {
    if (req.topup.thumb.data) {
        await res.set('Content-Type', req.topup.thumb.contentType);
        return res.send(req.topup.thumb.data);
    }
    next();
};

exports.getTopupById = async (req, res, next, id) => {
    try{
        const topup = await Topup.findById(id);
        req.topup = topup;
        next();
    }
    
    catch(err){
        return res.status(400).json({
            error: 'topup not found'
        });
    }
        
};

exports.getSingleTopupBy = async (req, res, next) => {
    try{
        const {topupId} = req.params;
        const topup = await Topup.findById(topupId);
        return res.json(topup);
    }
    
    catch(err){
        return res.status(400).json({
            error: 'topup not found'
        });
    }
        
};

exports.updateTopupById = async (req, res, next)=>{
    const topups = await Topup.find();
    res.json(topups);
}
exports.deleteTopupById = async (req, res, next)=>{
    const topups = await Topup.find();
    res.json(topups);
}