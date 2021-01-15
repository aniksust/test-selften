const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');
const Wallet = require('../models/wallet');
const axios = require('axios');

exports.resetPassword = async (req, res, next)=>{
    const {phone} = req.params;

    try{
        const user = await User.findOne({phone});
        const generateMsg = (length)=> {
            var result           = '';
            var characters       = '0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        const generatedMsg = await generateMsg(5);
        const msg = `Your selften password reset OTP:- ${generatedMsg.toUpperCase()}`
        user.otpcode = generatedMsg.toUpperCase(),
        await user.save();
        
        const alphaURI = `http://alphasms.biz/index.php?app=ws&u=${process.env.ALPHA_OTP_USER_NAME}&h=${process.env.ALPHA_OTP_HASH_TOKEN}&op=pv&to=${user.phone}&msg=${msg}`;
        const {data} = await axios.get(alphaURI);
        return res.json({sendAgain: 'again', phone: user.phone})

    }catch(err){
        return res.status(400).json({
            error: 'Phone number does not belong to any user'
        });
    }
}



exports.resendOTP = async (req, res)=>{
    try{
        
        const {phone} = req.params;
        const user = await User.findOne({phone: phone});
        
        if(user.verified){
            return res.status(400).json({
            
            error: 'Phone number already belongs to a verified user'
        });
        }

        if(!user.verified){
            const generateMsg = (length)=> {
                var result           = '';
                var characters       = '0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            const generatedMsg = await generateMsg(5);
            const msg = `Your selften registration OTP:- ${generatedMsg.toUpperCase()}`
            user.otpcode = generatedMsg.toUpperCase(),
            await user.save();
            
            const alphaURI = `http://alphasms.biz/index.php?app=ws&u=${process.env.ALPHA_OTP_USER_NAME}&h=${process.env.ALPHA_OTP_HASH_TOKEN}&op=pv&to=${user.phone}&msg=${msg}`;
            const {data} = await axios.get(alphaURI);
            
            return res.json({sendAgain: 'again', phone: user.phone})
        }

        



    }catch(err){
        return res.status(400).json({
                
            error: 'Phone number does not belong to any user'
        });
    }
    
}

exports.checkResetOTP = async (req, res, next)=>{
    try{
        const { phone, otpcode } = req.params;
        const user = await User.findOne({phone: phone});

        if(!user){
            return res.status(400).json({

                 error: 'Wrong phone number or user does not exist'
            });
        }

        if(user.otpcode !== otpcode){
            return res.status(400).json({

                error: 'Wrong otp'
            });
        }

        user.otpcode = undefined;
        //after save
        await user.save();

        return res.json({
            user
        });
    }catch(err){
        return res.status(400).json({

                error: 'Wrong otp'
            });
    }
}   
//verify otp
exports.verifyOTP = async (req, res, next)=>{
    try{
        const { phone, otpcode } = req.params;
        const user = await User.findOne({phone: phone});

        if(user.verified){
            return res.status(400).json({
            
            error: 'Phone number already belongs to a verified user'
        });
        }

        if(!user.verified){
            if(user.otpcode !== otpcode){
                return res.status(400).json({

                    error: 'Wrong otp'
                });
            }

            user.otpcode = undefined;
            user.verified = true;
            //after save
            await user.save();


            const newWallet = new Wallet({
                user: user._id,
            });

            const wallet = await newWallet.save();

            return res.json({
                user
            });
        }
    }catch(err){
        return res.status(400).json({

                error: 'Wrong phone number or user does not exist'
            });
    }




}

//set new password after forget password
exports.setNewPassword = async (req, res, next)=>{
    try{
        const {phone, password} = req.params;

        if(!phone){
            return res.status(400).json({error: 'Missing password field'})
        }
        if(!password || password.length < 6){
            return res.status(400).json({error: 'Password should be 6 character long'})
        }

        const user = await User.findOne({phone});
        if(user.count > 10){
            return res.status(400).json({error: 'You have reached try limit'})
        }else{
            user.count = user.count + 1
        }
        user.password = password;
        await user.save();

        return res.json({success: 'success password change'})
    }catch(err){
        res.status(400).json({error: 'User does not exist'})
    }

}

// using promise
exports.signup = async (req, res) => {
    // console.log("req.body", req.body);
    try{    
        //generate otp
        const generateMsg = (length)=> {
            var result           = '';
            var characters       = '0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        //check phone
        const checkPhone = await User.findOne({phone: req.body.phone});
        if(checkPhone){
            if(checkPhone.otpcode !== 'undefined'){
                //send otp message again
                const generatedMsg = await generateMsg(5);
                const msg = `Your selften registration OTP:- ${generatedMsg.toUpperCase()}`
                checkPhone.otpcode = generatedMsg.toUpperCase(),
                await checkPhone.save();
                
                const alphaURI = `http://alphasms.biz/index.php?app=ws&u=${process.env.ALPHA_OTP_USER_NAME}&h=${process.env.ALPHA_OTP_HASH_TOKEN}&op=pv&to=${checkPhone.phone}&msg=${msg}`;
                const {data} = await axios.get(alphaURI);
                console.log(data)
                return res.json({sendAgain: 'again', phone: checkPhone.phone})
            }
            else{
                return res.status(400).json({
                
                    error: 'Phone already registered. Please sign in'
                });
            }

        }
        if(!checkPhone){
            //check mail
            const checkEmail = await User.findOne({email: req.body.email});
            if(checkEmail){
                if(checkEmail.otpcode !== 'undefined'){
                    //send otp message again
                    const generatedMsg = await generateMsg(5);
                    const msg = `Your selften registration OTP:- ${generatedMsg.toUpperCase()}`
                    checkEmail.otpcode = generatedMsg.toUpperCase(),
                    await checkEmail.save();
                    
                    const alphaURI = `http://alphasms.biz/index.php?app=ws&u=${process.env.ALPHA_OTP_USER_NAME}&h=${process.env.ALPHA_OTP_HASH_TOKEN}&op=pv&to=${checkEmail.phone}&msg=${msg}`;
                    const {data} =  await axios.get(alphaURI);
                    console.log(data)
                    return res.json({sendAgain: 'again', phone: checkEmail.phone})
                }
                else{
                    return res.status(400).json({
                
                        error: 'Email already registered'
                    });
                }
                
            }
        }

        

        const newUser = new User(req.body);
        const user = await newUser.save();
        

        //otp code
       
        const generatedMsg = await generateMsg(5);
        const msg = `Your selften registration OTP:- ${generatedMsg.toUpperCase()}`
        user.otpcode = generatedMsg.toUpperCase(),
        await user.save();
        
        const alphaURI = `http://alphasms.biz/index.php?app=ws&u=${process.env.ALPHA_OTP_USER_NAME}&h=${process.env.ALPHA_OTP_HASH_TOKEN}&op=pv&to=${req.body.phone}&msg=${msg}`;

        const {data} = await axios.get(alphaURI);
        console.log(data.data)
        return res.json({sendAgain: 'First', phone: user.phone});

        
    }catch(err){
        return res.status(400).json({
                
            error: 'Something wrong happened'
        });
    }
};


exports.signin = async (req, res) => {
    try{
        
        // find the user based on email
        const { password } = req.body;

        function checkEmailOrPhone(email){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        if(!checkEmailOrPhone(req.body.email)){
        const phoneUser = await User.findOne({ phone: req.body.email });
             
            if(!phoneUser){
                return res.status(400).json({
                    error: 'User with that phone does not exist. Please signup'
                });
            }

            // if user is found make sure the email and password match
            // create authenticate method in user model
            if (!phoneUser.authenticate(password)) {
                return res.status(401).json({
                    error: 'Phone and password dont match'
                });
            }
            // generate a signed token with user id and secret
            const token = await jwt.sign({ _id: phoneUser._id }, process.env.JWT_SECRET);
            // persist the token as 't' in cookie with expiry date
            res.cookie('t', token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email, role, phone, verified } = phoneUser;
            
            return res.json({ token, user: { _id, email, name, role, phone, verified } });
        }

        if(checkEmailOrPhone(req.body.email)){
            const user = await User.findOne({ email: req.body.email });
            if (!user) {

                return res.status(401).json({
                    error: 'Email does not belong to any user'
                });

            }
            // if user is found make sure the email and password match
            // create authenticate method in user model
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Email and password dont match'
                });
            }
            // generate a signed token with user id and secret
            const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            // persist the token as 't' in cookie with expiry date
            res.cookie('t', token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email, role, phone } = user;
            return res.json({ token, user: { _id, email, name, role, phone } });

        }





    }catch(err){
        return res.status(400).json({
                error: 'User with that email or phone does not exist'
        });
    }
};

exports.signout = async (req, res) => {
    await res.clearCookie('t');
    return res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = async (req, res, next) => {
    let user = await req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

/**
 * google login full
 * https://www.udemy.com/instructor/communication/qa/7520556/detail/
 */
