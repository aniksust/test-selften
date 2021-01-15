const mongoose = require('mongoose');
const schema = mongoose.Schema;

const sliderSchema = new schema({
    title: {
        type: String,
        required: [true, 'New top up system needs a title']
    },

    photo:{
        data: Buffer,
        contentType: String
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Slider', sliderSchema);