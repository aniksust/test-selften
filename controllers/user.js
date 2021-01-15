const User = require('../models/user');
const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Message = require('../models/message');
const MessagePair = require('../models/messagePair');
const formidable = require('formidable');



exports.getUserById = async (req, res, next)=>{
    const {userId} = req.params;

    try{
        const user = await User.findById(userId);
        return res.json(user);
    }catch(err){
        console.log(err);
    }
}

exports.profileUpdate = async (req, res, next)=>{
    
    try{
        const {userId} = req.params;
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        
        form.parse(req, async (err, fields) => {
            
            const {name, email, phone, address, postCode, city, about } = fields;
            
            // if(!name || !email || !phone || !address || !postCode || !city || !about ){
            //     return res.status(400).json({
            //         error: 'All field required',
            //     });
            // }

            
            const user = await User.findById(userId);
            console.log(user);
            if(name){
                user.name = name;
            }
            if(email){
                user.email = email
            }

            if(phone){
                user.phone = phone
            }

            if(address){
                user.address = address
            }
             if(postCode){
                 user.postCode = postCode
             }
             if(city){
                 user.city = city
             }
             if(about){
                 user.about = about
             }
              

            const updatedUser = await user.save();
            console.log(updatedUser);
            return res.json(updatedUser);
        
        })

    }catch(err){
        return res.status(400).json({
            error: 'Profile could not update'
        });
    }
}

exports.userById = async (req, res, next, id) => {
    try{
        const user = await User.findById(id);
            
        
        req.profile = user;
        next();
    }
        catch(err){
            return res.status(400).json({
                error: 'User not found'
            });
        }
    
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// exports.update = (req, res) => {
//     console.log('user update', req.body);
//     req.body.role = 0; // role will always be 0
//     User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'You are not authorized to perform this action'
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json(user);
//     });
// };

exports.update = async (req, res) => {
    try{
        const { name, password } = req.body;

        const user = await User.findOne({ _id: req.profile._id });
            if (!user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            if (!name) {
                return res.status(400).json({
                    error: 'Name is required'
                });
            } else {
                user.name = name;
            }

            if (password) {
                if (password.length < 6) {
                    return res.status(400).json({
                        error: 'Password should be min 6 characters long'
                    });
                } else {
                    user.password = password;
                }
            }

            const updatedUser = await user.save();
                if (!updatedUser) {
                    console.log('USER UPDATE ERROR', err);
                    return res.status(400).json({
                        error: 'User update failed'
                    });
                }
                updatedUser.hashed_password = undefined;
                updatedUser.salt = undefined;
                res.json(updatedUser);
    }catch(err){
            return res.status(400).json({
                error: 'Error updating'
            });
        }
    
};

exports.addOrderToUserHistory = async (req, res, next) => {
    try{
        let history = [];

        req.body.order.products.forEach(item => {
            history.push({
                _id: item._id,
                name: item.name,
                description: item.description,
                category: item.category,
                quantity: item.count,
                transaction_id: req.body.order.transaction_id,
                amount: req.body.order.amount
            });
        });

    const data = await User.findOneAndUpdate({ _id: req.profile._id }, { $push: { history: history } }, { new: true });
        if (!data) {
            return res.status(400).json({
                error: 'Could not update user purchase history'
            });
        }
        next();
    
    }catch(err){
        return res.status(400).json({
            error: 'Could not update user purchase history'
        });
    }
};

exports.purchaseHistory = async (req, res) => {
    try{

    
        const orders = await Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .sort('-created');
        
        return res.json(orders);

    }catch(err){
             
        return res.status(400).json({
            error: errorHandler(err)
        });
            
    }
        
};

exports.sendMessagesByPair = async (req, res) => {
    try{
        const { userId, receiverId, pairId } = req.params;
        let form = new formidable.IncomingForm();
            form.keepExtensions = true;
            
        form.parse(req, async (err, fields, files) => {
                const { message } = fields;

                const newMessage = new Message({
                user: userId,
                receiver: receiverId,
                message,
            });

            const msg = await newMessage.save();

            const pair = await MessagePair.findById(pairId);
                    
            pair.message.push(msg);
            await pair.save()
                                    
            return res.json({message: 'message sent'})
                
        })
        

    }catch(err){
        return res.status(400).json({
            error: 'Could not send message',
        });
    }
    
}

exports.getUnseenMessagesByReceiver = async (req, res) => {
    try{
        const { userId } = req.params; 
        const messages = await Message.find({receiver: userId, seen: false});
            
        res.json(messages);
        

    }catch(err){
        return res.status(400).json({
            error: 'Could not send message',
        });
    }
        
}

exports.getMessagesByUser = async (req, res) => {
    try{
        const { userId } = req.params; 
        const messages = await MessagePair.find({ $or:[ {'user':userId}, {'receiver':userId}]}).populate('user').populate('receiver').populate('message')
        res.json(messages); 
            
    }catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }

}

exports.getMessagesByPair = async (req, res) => {
    try{
        const { pairId, userId } = req.params;

        const messages = await MessagePair.findById(pairId).populate('user').populate('receiver').populate(
        {
            path:'message',
            options: {
                limit: 20

            }
        })
        
        
        const unSeenMsg = await messages.message.filter((mail) => {
            
            return mail.seen === false
        });
        for (msg in unSeenMsg){
            if(unSeenMsg[msg].receiver = userId){
                
                unSeenMsg[msg].seen = true;
                unSeenMsg[msg].save()
                .then(m=>{
                    //
                })

            }
        }
        
        res.json(messages);
    }catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }

}

exports.getChat = async (req, res) => {
    try{
        const { userId, receiverId } = req.params;
        const messages = await Message.find({user: userId, receiver: receiverId })
        res.json(messages);
    }
    

    catch(err){
        return res.status(400).json({
                    error: errorHandler(err)
                });
    }
        
}

exports.addChat = async (req, res) => {
    try{
        const { userId, receiverId } = req.params;
        const newMessage = new Message({
            user: userId,
            receiver: receiverId,
            message: req.body.message
        })

        const messages = await newMessage.save()
        res.json(messages);
    }
    catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
        
}

//get all admins
exports.gerAllAdmins = async (req, res)=>{
    try{
        const admins = await User.find({role: 1})
        res.json(admins);
    }catch(err){
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
    
    
}