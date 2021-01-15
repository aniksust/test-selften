const formidable = require('formidable');
const fs = require('fs');
const Category = require('../models/category');
const Product = require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.categoryById = async (req, res, next, id) => {
    try{
        const category = await Category.findById(id);
    
        req.category = category;
        next();
    }catch(err){
        return res.status(400).json({
            error: 'Category does not exist'
        });
    }
    
};

exports.create = async (req, res) => { 
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
        const { name } = fields;

        if (!name) {
            return res.status(400).json({
                error: 'Name field is required'
            });
        }

        let category = new Category(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            category.photo.data = fs.readFileSync(files.photo.path);
            category.photo.contentType = files.photo.type;
        }

        const result = await category.save();
            
        return res.json(result);
        
    });
    }catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.photo = async (req, res, next) => {
    if (req.category.photo.data) {
        res.set('Content-Type', req.category.photo.contentType);
        return await res.send(req.category.photo.data);
    }
    next();
};


exports.read = async (req, res) => {
    return await res.json(req.category);
};

exports.update = async (req, res) => {
    try{
        const category = req.category;
        category.name = req.body.name;
        const data = await category.save();
        return res.json(data);
    }

    
    catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
};

exports.remove = async (req, res) => {
    try{
        const category = req.category;
        const data = await Product.find({ category });
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`
            });
        } else {
            await category.remove();
                
            return res.json({
                message: 'Category deleted'
            });
        }
    }catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
    
};

exports.list = async (req, res) => {
    try{
        const data = await Category.find()
        res.json(data);
    }

    catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
    
};
