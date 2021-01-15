const Product = require("../models/product")
const Topup = require("../models/topup")

exports.searchProductAndTopup = async (req, res, next)=>{
    try{
        const {searchText} = req.params;
        const product = await Product.find({ "name": { "$regex": searchText, "$options": "i" } });
        const topup = await Topup.find({ "title": { "$regex": searchText, "$options": "i" } });

        res.status(200).json([product, topup])
    }catch(err){
        res.status(400).json({error: 'Not found'})
    }

}