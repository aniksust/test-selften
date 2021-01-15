const { errorHandler } = require('../helpers/dbErrorHandler');
const AdminBalance = require('./../models//adminBalance');

//@GET balance
exports.showBalance = async (req, res, next)=>{
    try{
        const data = await AdminBalance.find()
        res.json(data);
    }catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    } 
    
}

exports.addUpdateBalance = async (req, res, next) => {
    try{
        const { userId } = req.params;

        let { balance } = req.body;
        if(!balance){
            return res.status(400).json({
                error: 'Balance field is required'
            });
        }

        if(isNaN(balance)){
            return res.status(400).json({
                error: 'Please write digits only'
            });
        }

        const prevbalance = await AdminBalance.find();

        if(!prevbalance){
            const newBalance = new AdminBalance({
                balance,
                updatedBy: userId,
            })
                
            const data = await newBalance.save();
            return res.json(data);
                
        }

        if(prevbalance){
            let addBalance = Number(prevbalance[0].balance) + Number(balance);
            if (addBalance < 0){
                 addBalance = 0;
            }
            const b = await AdminBalance.findByIdAndUpdate(prevbalance[0].id, {balance: addBalance});
            
            return res.json(b);
            
        }

            
        
    }catch(err){
        return res.status(400).json({
            error: 'Could not perform'
        });
    }


       
}

exports.addUpdateDiamondValue = async (req, res)=>{
    try{
        const { userId } = req.params;

        let { diamondValue } = req.body;

        if(!diamondValue){
            return res.status(400).json({
                error: 'Value field is required'
            });
        }

        if(isNaN(diamondValue)){
            return res.status(400).json({
                error: 'Please write digits only'
            });
        }

        const prevbalance = await AdminBalance.find();
        
        if(!prevbalance){
            const newBalance = new AdminBalance({
                balance: 0,
                updatedBy: userId,
                takaPerDiamond: diamondValue,
            })
            const data = await newBalance.save();
               
            return res.json(data);
            
            
        }
        if(prevbalance){
            
            
            prevbalance[0].takaPerDiamond = Number(diamondValue);
            const b = await prevbalance[0].save();
            
            return res.json(b);
            
        }
    }catch(err){
        return res.status(400).json({
            error: 'Diamonds could not add',
        });
    }

            
        
}

