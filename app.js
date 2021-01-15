const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const Message = require('./models/message');
const MessagePair = require('./models/messagePair')
require('dotenv').config();
// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');
const topupRoutes = require('./routes/topup');
const rechargePackageRoutes = require('./routes/rechargePackage');
const wallet = require('./routes/wallet');
const topupOrder = require('./routes/topupOrder');
const adminBalance = require('./routes/adminBalance');
const couponRoutes = require('./routes/couponRoutes');
const diamondRoutes = require('./routes/diamondRoutes');
const searchRoutes = require('./routes/search');
const sliderRoutes = require('./routes/slider')
// app
const app = express();

//socket setup
const server = http.createServer(app);
const io = socketio(server);



// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);
app.use('/api', topupRoutes);
app.use('/api', rechargePackageRoutes);
app.use('/api', wallet);
app.use('/api', topupOrder);
app.use('/api', adminBalance);
app.use('/api', couponRoutes);
app.use('/api', diamondRoutes);
app.use('/api', searchRoutes);
app.use('/api', sliderRoutes);

// set static folder
app.use(express.static('client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
  

//starts socket coding
io.on('connection', socket => {
    
    
    //get newMessage and save
    socket.on('sendMessage', (newMsgDetails) => {
        const { userId, receiverId, pairId, message } = newMsgDetails;

        const newMessage = new Message({
            user: userId,
            receiver: receiverId,
            message,
        });

        newMessage.save().then(msg => {
            MessagePair.findById(pairId).then(pair => {
                    
                pair.message.push(msg);
                pair.save().then(savedPair => {
                    io.emit('newMessage', msg);
                    
                    }  
                ).catch(err => {
                    console.log(err)
                })


                
                                    
            })
        })
    });

    socket.on('disconnect', socket => {
        console.log('Client disconnected.');
    });
})


// end socket coding

const port = process.env.PORT || 4999;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
