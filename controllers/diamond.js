const Diamonds = require('./../models/diamonds');

exports.getDiamonds = async (req, res)=>{
    const {userId } = req.params;

    try{
        const diamond = await Diamonds.findOne({user: userId})
        
        return res.json(diamond);

    }catch(err){
       res.status(400).json({error: 'Diamond get error'}); 
    }


}